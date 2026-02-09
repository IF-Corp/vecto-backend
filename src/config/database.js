require('dotenv').config();

const env = (key, fallback) => {
    const value = process.env[key];
    return value ? value.trim() : fallback;
};

module.exports = {
    development: {
        username: env('DB_USER', 'postgres'),
        password: env('DB_PASSWORD', 'postgres'),
        database: env('DB_NAME', 'vecto_db'),
        host: env('DB_HOST', 'localhost'),
        port: env('DB_PORT', 5432),
        dialect: 'postgres',
        logging: console.log,
    },
    test: {
        username: env('DB_USER', 'postgres'),
        password: env('DB_PASSWORD', 'postgres'),
        database: env('DB_NAME_TEST', 'vecto_db_test'),
        host: env('DB_HOST', 'localhost'),
        port: env('DB_PORT', 5432),
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: env('DB_USER', undefined),
        password: env('DB_PASSWORD', undefined),
        database: env('DB_NAME', undefined),
        host: env('DB_HOST', undefined),
        port: env('DB_PORT', 5432),
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};
