const { ShoppingList, HouseholdInventory, HouseholdChore, Contact, CalendarEvent } = require('../models');

// ==================== SHOPPING LISTS ====================

const getShoppingList = async (request, reply) => {
    try {
        const { userId } = request.params;
        const items = await ShoppingList.findAll({
            where: { user_id: userId },
            order: [['is_purchased', 'ASC'], ['priority', 'DESC'], ['created_at', 'DESC']]
        });
        return { success: true, data: items };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createShoppingItem = async (request, reply) => {
    try {
        const { userId } = request.params;
        const item = await ShoppingList.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: item, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateShoppingItem = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await ShoppingList.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Shopping item not found' };
        }
        const item = await ShoppingList.findByPk(id);
        return { success: true, data: item };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteShoppingItem = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await ShoppingList.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Shopping item not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== HOUSEHOLD INVENTORY ====================

const getInventory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const items = await HouseholdInventory.findAll({
            where: { user_id: userId },
            order: [['category', 'ASC'], ['name', 'ASC']]
        });
        return { success: true, data: items };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createInventoryItem = async (request, reply) => {
    try {
        const { userId } = request.params;
        const item = await HouseholdInventory.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: item, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateInventoryItem = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HouseholdInventory.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Inventory item not found' };
        }
        const item = await HouseholdInventory.findByPk(id);
        return { success: true, data: item };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteInventoryItem = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HouseholdInventory.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Inventory item not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== HOUSEHOLD CHORES ====================

const getChores = async (request, reply) => {
    try {
        const { userId } = request.params;
        const chores = await HouseholdChore.findAll({
            where: { user_id: userId },
            order: [['next_due', 'ASC']]
        });
        return { success: true, data: chores };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createChore = async (request, reply) => {
    try {
        const { userId } = request.params;
        const chore = await HouseholdChore.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: chore, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateChore = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HouseholdChore.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Chore not found' };
        }
        const chore = await HouseholdChore.findByPk(id);
        return { success: true, data: chore };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteChore = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HouseholdChore.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Chore not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== CONTACTS ====================

const getContacts = async (request, reply) => {
    try {
        const { userId } = request.params;
        const contacts = await Contact.findAll({
            where: { user_id: userId },
            order: [['is_favorite', 'DESC'], ['name', 'ASC']]
        });
        return { success: true, data: contacts };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createContact = async (request, reply) => {
    try {
        const { userId } = request.params;
        const contact = await Contact.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: contact, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateContact = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await Contact.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Contact not found' };
        }
        const contact = await Contact.findByPk(id);
        return { success: true, data: contact };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteContact = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await Contact.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Contact not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== CALENDAR EVENTS ====================

const getCalendarEvents = async (request, reply) => {
    try {
        const { userId } = request.params;
        const events = await CalendarEvent.findAll({
            where: { user_id: userId },
            order: [['start_date', 'ASC']]
        });
        return { success: true, data: events };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createCalendarEvent = async (request, reply) => {
    try {
        const { userId } = request.params;
        const event = await CalendarEvent.create({
            ...request.body,
            user_id: userId
        });
        reply.status(201);
        return { success: true, data: event, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateCalendarEvent = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await CalendarEvent.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Calendar event not found' };
        }
        const event = await CalendarEvent.findByPk(id);
        return { success: true, data: event };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteCalendarEvent = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await CalendarEvent.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Calendar event not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Shopping Lists
    getShoppingList,
    createShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    // Household Inventory
    getInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    // Household Chores
    getChores,
    createChore,
    updateChore,
    deleteChore,
    // Contacts
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    // Calendar Events
    getCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
};
