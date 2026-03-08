#!/usr/bin/env node

/**
 * Schema Validation Script
 *
 * Compares Sequelize model field definitions with Fastify JSON schemas
 * to catch misalignments before they reach production.
 *
 * Usage: node scripts/validate-schemas.js [--verbose]
 *
 * Exit codes:
 *   0 - No errors (warnings are OK)
 *   1 - Errors found
 */

const path = require('path');

// ─── Load models and schemas ────────────────────────────────────────────────

// Ensure we can load models without a DB connection
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const db = require(path.join(__dirname, '..', 'src', 'models'));
const schemas = require(path.join(__dirname, '..', 'src', 'schemas'));

const verbose = process.argv.includes('--verbose');

// ─── Configuration ──────────────────────────────────────────────────────────

// Fields automatically managed by the system (excluded from schema checks)
const AUTO_FIELDS = new Set([
    'id',
    'user_id',
    'createdAt',
    'updatedAt',
    'created_at',
    'updated_at',
]);

// Sequelize DataType key → JSON Schema type
const TYPE_MAP = {
    UUID: 'string',
    STRING: 'string',
    TEXT: 'string',
    CHAR: 'string',
    CITEXT: 'string',
    INTEGER: 'integer',
    SMALLINT: 'integer',
    MEDIUMINT: 'integer',
    BIGINT: 'integer',
    TINYINT: 'integer',
    FLOAT: 'number',
    DOUBLE: 'number',
    'DOUBLE PRECISION': 'number',
    REAL: 'number',
    DECIMAL: 'number',
    BOOLEAN: 'boolean',
    DATE: 'string',
    DATEONLY: 'string',
    TIME: 'string',
    ENUM: 'string',
    ARRAY: 'array',
    JSON: 'object',
    JSONB: 'object',
    VIRTUAL: null,
};

/**
 * Maps schema export names to Sequelize model names.
 * Key: "module:EntityName" → Value: Sequelize model name
 *
 * The entity name is extracted from schema keys like:
 *   createHabitBody → "Habit"
 *   updateCardBody  → "Card"
 *
 * This map resolves cases where the entity name doesn't match the model name.
 */
const ENTITY_TO_MODEL = {
    // project module
    'project:Meeting': 'WorkMeeting',

    // finance module
    'finance:Category': 'FinanceCategory',
    'finance:Goal': 'FinanceGoal',

    // study module
    'study:Settings': 'StudySettings',
    'study:Course': 'StudyCourse',
    'study:Period': 'StudyPeriod',
    'study:Subject': 'StudySubject',
    'study:SubjectWeight': 'StudySubjectWeight',
    'study:Evaluation': 'StudyEvaluation',
    'study:EvaluationFeedback': 'StudyEvaluationFeedback',
    'study:Book': 'StudyBook',
    'study:CourseOnline': 'StudyCourseOnline',
    'study:Topic': 'StudyTopic',
    'study:ProgressLog': 'StudyProgressLog',
    'study:RetentionLog': 'StudyRetentionLog',
    'study:Deck': 'StudyDeck',
    'study:Flashcard': 'StudyFlashcard',
    'study:ReviewSession': 'StudyReviewSession',
    'study:ReviewLog': 'StudyReviewLog',
    'study:Project': 'StudyProject',
    'study:ProjectResource': 'StudyProjectResource',
    'study:Milestone': 'StudyProjectMilestone',
    'study:FocusSession': 'StudyFocusSession',
    'study:FocusBlock': 'StudyFocusBlock',
    'study:LibraryShelf': 'LibraryShelf',
    'study:StudySession': 'StudySession',
    'study:SpacedReview': 'SpacedReview',
    'study:Note': 'Note',

    // home module
    'home:ShoppingList': 'ShoppingList',
    'home:Inventory': 'HouseholdInventory',
    'home:Chore': 'HouseholdChore',

    // freezeMode module
    'freezeMode:FreezePeriod': 'FreezePeriod',
    'freezeMode:FreezeMode': 'FreezeModeConfig',

    // user module
    'user:Onboarding': 'OnboardingState',
};

/**
 * Special schema names that don't follow create/update convention.
 * Maps "module:schemaKey" → model name
 */
const SPECIAL_SCHEMAS = {
    'habit:logHabitBody': 'HabitLog',
    'habit:logRoutineExecutionBody': 'RoutineExecution',
    'habit:reactivateHabitBody': 'Habit',
    'habit:completeFocusSessionBody': 'StudyFocusSession',
    'freezeMode:activateFreezeModeBody': 'FreezeModeConfig',
    'freezeMode:updateFreezeModeBody': 'FreezeModeConfig',
};

/**
 * Schema keys to skip entirely (not mappable to a single model)
 */
const SKIP_SCHEMAS = new Set([
    'auth:registerBody',
    'auth:loginBody',
    'auth:refreshTokenBody',
    'auth:authResponse',
    'auth:meResponse',
    'habit:joinGroupBody',
]);

/**
 * Schema properties that are known intentional aliases, association fields,
 * or virtual/computed fields handled by the controller.
 * These won't be flagged as "extra schema property not in model".
 * Key: "ModelName" → Set of property names
 */
const KNOWN_ALIASES = {
    // Association/nested fields handled by controllers
    Routine: new Set(['items']),
    RoutineExecution: new Set(['item_times']),
    Task: new Set(['subtasks']),
    WorkMeeting: new Set(['summary', 'action_items', 'meeting_date']),
    StudyFocusSession: new Set(['total_duration', 'item_times']),
    ShoppingList: new Set(['items']),

    // Action flags (not stored, trigger controller logic)
    Habit: new Set(['reset_streak']),

    // camelCase aliases for frontend convenience
    Transaction: new Set([
        'accountId',
        'categoryId',
        'cardId',
        'date',
        'recurringExpenseId',
        'account_name',
    ]),
    Invoice: new Set(['accountId', 'cardId']),

    // Freeze mode: legacy schema maps to config model with different structure
    FreezePeriod: new Set(['modules', 'options', 'activate_immediately']),
    FreezeModeConfig: new Set([
        'pause_habits',
        'pause_tasks',
        'pause_notifications',
        'auto_resume',
        'start_date',
        'end_date',
        'reason',
    ]),
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

function getSequelizeType(attr) {
    const type = attr.type;
    if (!type) return null;
    return type.key || type.constructor?.name || null;
}

function getEnumValues(attr) {
    if (attr.type?.values) return attr.type.values;
    if (attr.values) return attr.values;
    return null;
}

function getArrayElementType(attr) {
    const innerType = attr.type?.type;
    if (!innerType) return null;
    return innerType.key || innerType.constructor?.name || null;
}

function isNullableInSchema(schemaProp) {
    if (!schemaProp) return false;
    if (schemaProp.nullable === true) return true;
    if (Array.isArray(schemaProp.type) && schemaProp.type.includes('null')) return true;
    if (Array.isArray(schemaProp.anyOf)) {
        return schemaProp.anyOf.some((s) => s.type === 'null' || s.nullable === true);
    }
    return false;
}

function getSchemaType(schemaProp) {
    if (!schemaProp) return null;
    if (typeof schemaProp.type === 'string') return schemaProp.type;
    if (Array.isArray(schemaProp.type)) {
        return schemaProp.type.find((t) => t !== 'null') || schemaProp.type[0];
    }
    // Enum objects used as schema values (e.g., timePeriodEnum = { type: 'string', enum: [...] })
    if (schemaProp.enum && !schemaProp.type) return 'string';
    return null;
}

function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelToSnake(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Extract entity name from schema key.
 * createHabitBody → "Habit"
 * updateCardBody  → "Card"
 * updateSettingsBody → "Settings"
 */
function extractEntityName(schemaKey) {
    const match = schemaKey.match(/^(?:create|update)(.+?)Body$/);
    if (match) return match[1];
    return null;
}

function resolveModelName(moduleName, entityName) {
    const key = `${moduleName}:${entityName}`;
    if (ENTITY_TO_MODEL[key]) return ENTITY_TO_MODEL[key];
    // Default: entity name IS the model name
    return entityName;
}

// ─── Validation Logic ───────────────────────────────────────────────────────

let totalErrors = 0;
let totalWarnings = 0;
let totalPairsChecked = 0;
let totalPairsClean = 0;

function validatePair(modelName, schemaKey, schemaObj, moduleName) {
    const model = db[modelName];
    if (!model) {
        console.log(
            `  ${YELLOW}!${RESET} Model "${modelName}" not found (mapped from ${moduleName}:${schemaKey})`,
        );
        totalWarnings++;
        return;
    }

    if (!schemaObj || !schemaObj.properties) {
        if (verbose) {
            console.log(`  ${DIM}skipped ${schemaKey} (no properties)${RESET}`);
        }
        return;
    }

    totalPairsChecked++;
    const issues = [];
    const attrs = model.rawAttributes;
    const schemaProps = schemaObj.properties;
    const knownAliases = KNOWN_ALIASES[modelName] || new Set();

    // 1. Check schema properties against model fields
    for (const [propName, propDef] of Object.entries(schemaProps)) {
        if (AUTO_FIELDS.has(propName)) continue;

        const attr = attrs[propName];

        // Property in schema but not in model
        if (!attr) {
            if (knownAliases.has(propName)) continue;

            // Check camelCase ↔ snake_case variants
            const camelVersion = snakeToCamel(propName);
            const snakeVersion = camelToSnake(propName);
            if (attrs[camelVersion] || attrs[snakeVersion]) continue;

            issues.push({
                level: 'warn',
                type: 'EXTRA_SCHEMA_FIELD',
                field: propName,
                message: `Schema property "${propName}" has no matching model field`,
            });
            continue;
        }

        // Type check
        const seqType = getSequelizeType(attr);
        const schemaType = getSchemaType(propDef);
        const expectedJsonType = TYPE_MAP[seqType];

        if (expectedJsonType && schemaType && expectedJsonType !== schemaType) {
            issues.push({
                level: 'error',
                type: 'TYPE_MISMATCH',
                field: propName,
                message: `Type mismatch: model=${seqType} (expect ${expectedJsonType}), schema=${schemaType}`,
            });
        }

        // Enum check
        const modelEnumValues = getEnumValues(attr);
        const schemaEnumValues = propDef.enum;
        if (modelEnumValues && schemaEnumValues) {
            const modelSet = new Set(modelEnumValues);
            const schemaSet = new Set(schemaEnumValues.filter((v) => v !== null));

            const missingInSchema = modelEnumValues.filter((v) => !schemaSet.has(v));
            const extraInSchema = [...schemaSet].filter((v) => !modelSet.has(v));

            if (missingInSchema.length > 0 || extraInSchema.length > 0) {
                const parts = [];
                if (missingInSchema.length)
                    parts.push(`missing in schema: [${missingInSchema.join(', ')}]`);
                if (extraInSchema.length)
                    parts.push(`extra in schema: [${extraInSchema.join(', ')}]`);
                issues.push({
                    level: 'error',
                    type: 'ENUM_MISMATCH',
                    field: propName,
                    message: `Enum mismatch: ${parts.join('; ')}`,
                });
            }
        }

        // Nullable check (only flag when schema is NOT nullable but model allows null)
        const modelAllowsNull = attr.allowNull !== false;
        const schemaNullable = isNullableInSchema(propDef);

        if (modelAllowsNull && !schemaNullable && attr.defaultValue === undefined) {
            issues.push({
                level: 'warn',
                type: 'NULLABLE_MISMATCH',
                field: propName,
                message: `Model allows null but schema is not nullable (may cause validation errors on null input)`,
            });
        }
    }

    // 2. Check for model fields missing from schema (info only for create, warn for update)
    if (verbose) {
        const isUpdate = schemaKey.startsWith('update');
        for (const [fieldName, attr] of Object.entries(attrs)) {
            if (AUTO_FIELDS.has(fieldName)) continue;
            if (schemaProps[fieldName]) continue;

            const seqType = getSequelizeType(attr);
            if (seqType === 'VIRTUAL') continue;

            if (isUpdate) {
                issues.push({
                    level: 'info',
                    type: 'MISSING_IN_SCHEMA',
                    field: fieldName,
                    message: `Model field "${fieldName}" (${seqType}) not in ${schemaKey}`,
                });
            }
        }
    }

    // Print results
    const errors = issues.filter((i) => i.level === 'error');
    const warnings = issues.filter((i) => i.level === 'warn');
    const infos = issues.filter((i) => i.level === 'info');

    totalErrors += errors.length;
    totalWarnings += warnings.length;

    if (issues.length === 0) {
        totalPairsClean++;
        if (verbose) {
            console.log(`  ${GREEN}OK${RESET} ${modelName} (${schemaKey})`);
        }
        return;
    }

    console.log(`  ${modelName} ${DIM}(${schemaKey})${RESET}`);
    for (const issue of errors) {
        console.log(`    ${RED}ERR${RESET}  ${issue.type}: ${issue.field}`);
        console.log(`         ${issue.message}`);
    }
    for (const issue of warnings) {
        console.log(`    ${YELLOW}WARN${RESET} ${issue.type}: ${issue.field}`);
        console.log(`         ${issue.message}`);
    }
    for (const issue of infos) {
        console.log(`    ${DIM}INFO ${issue.type}: ${issue.field} - ${issue.message}${RESET}`);
    }
}

// ─── Response Schema Null Safety Check ──────────────────────────────────────

function checkResponseNullSafety() {
    const issues = [];

    function walkSchema(obj, path, moduleName) {
        if (!obj || typeof obj !== 'object') return;

        // Check: type is 'object' without nullable: true, inside a response data wrapper
        if (obj.type === 'object' && obj.properties && !obj.nullable && path.includes('.data')) {
            issues.push({
                module: moduleName,
                path,
                message: 'Object type without nullable: true (Fastify will coerce null to {})',
            });
        }

        // Recurse into properties
        if (obj.properties) {
            for (const [key, val] of Object.entries(obj.properties)) {
                if (typeof val === 'object' && val !== null) {
                    walkSchema(val, `${path}.${key}`, moduleName);
                }
            }
        }

        // Recurse into array items
        if (obj.items && typeof obj.items === 'object') {
            walkSchema(obj.items, `${path}[]`, moduleName);
        }
    }

    for (const [moduleName, moduleSchemas] of Object.entries(schemas)) {
        if (moduleName === 'common') continue;

        for (const [schemaKey, schemaObj] of Object.entries(moduleSchemas)) {
            if (!schemaKey.toLowerCase().includes('response')) continue;
            if (!schemaObj || !schemaObj.properties) continue;

            // Response schemas have { success, data } structure
            const data = schemaObj.properties?.data;
            if (!data) continue;

            walkSchema(data, `${moduleName}.${schemaKey}.data`, moduleName);
        }
    }

    return issues;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
    console.log(`\n${BOLD}=== Schema Validation Report ===${RESET}\n`);

    // Validate each module's schemas against models
    for (const [moduleName, moduleSchemas] of Object.entries(schemas)) {
        if (moduleName === 'common') continue;

        const bodySchemas = [];

        for (const [schemaKey, schemaObj] of Object.entries(moduleSchemas)) {
            // Check special mappings first
            const specialKey = `${moduleName}:${schemaKey}`;
            if (SKIP_SCHEMAS.has(specialKey)) continue;

            if (SPECIAL_SCHEMAS[specialKey]) {
                bodySchemas.push({
                    key: schemaKey,
                    schema: schemaObj,
                    modelName: SPECIAL_SCHEMAS[specialKey],
                });
                continue;
            }

            // Extract entity name from create/update pattern
            const entityName = extractEntityName(schemaKey);
            if (!entityName) continue;

            const modelName = resolveModelName(moduleName, entityName);
            bodySchemas.push({ key: schemaKey, schema: schemaObj, modelName });
        }

        if (bodySchemas.length === 0) continue;

        console.log(`${CYAN}${moduleName}${RESET}`);
        for (const { key, schema, modelName } of bodySchemas) {
            validatePair(modelName, key, schema, moduleName);
        }
        console.log();
    }

    // Check response schemas for null safety
    console.log(`${CYAN}Response Null Safety${RESET}`);
    const nullIssues = checkResponseNullSafety();
    if (nullIssues.length === 0) {
        console.log(`  ${GREEN}OK${RESET} All response schemas have proper nullable handling`);
    } else {
        for (const issue of nullIssues) {
            console.log(`  ${RED}ERR${RESET}  NULL_SAFETY: ${issue.path}`);
            console.log(`       ${issue.message}`);
            totalErrors++;
        }
    }

    // Summary
    console.log(`\n${BOLD}─── Summary ───${RESET}`);
    console.log(`  Pairs checked: ${totalPairsChecked}`);
    console.log(`  Clean:         ${totalPairsClean}`);
    if (totalErrors > 0) {
        console.log(`  Errors:        ${RED}${totalErrors}${RESET}`);
    } else {
        console.log(`  Errors:        ${GREEN}0${RESET}`);
    }
    if (totalWarnings > 0) {
        console.log(`  Warnings:      ${YELLOW}${totalWarnings}${RESET}`);
    } else {
        console.log(`  Warnings:      ${GREEN}0${RESET}`);
    }
    console.log();

    if (totalErrors > 0) {
        console.log(
            `${RED}${BOLD}FAIL${RESET} Schema validation found ${totalErrors} error(s). Fix before deploying.\n`,
        );
        process.exit(1);
    } else if (totalWarnings > 0) {
        console.log(
            `${YELLOW}${BOLD}PASS (with warnings)${RESET} ${totalWarnings} warning(s) found. Review recommended.\n`,
        );
        process.exit(0);
    } else {
        console.log(`${GREEN}${BOLD}PASS${RESET} All schemas are aligned with models.\n`);
        process.exit(0);
    }
}

main();
