const { HomeShoppingList, HomeShoppingItem, HomeMember } = require('../models');
const { Op } = require('sequelize');

// ==================== SHOPPING LISTS ====================

const getShoppingLists = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const lists = await HomeShoppingList.findAll({
            where: { space_id: spaceId },
            include: [
                { model: HomeMember, as: 'createdBy', attributes: ['id', 'name'] },
                {
                    model: HomeShoppingItem,
                    as: 'items',
                    attributes: ['id', 'name', 'is_purchased'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        // Add item counts
        const listsWithCounts = lists.map((list) => {
            const plain = list.toJSON();
            plain.total_items = plain.items?.length || 0;
            plain.purchased_items = plain.items?.filter((i) => i.is_purchased).length || 0;
            delete plain.items;
            return plain;
        });

        return { success: true, data: listsWithCounts };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getShoppingList = async (request, reply) => {
    try {
        const { id } = request.params;
        const list = await HomeShoppingList.findByPk(id, {
            include: [
                { model: HomeMember, as: 'createdBy', attributes: ['id', 'name'] },
                {
                    model: HomeShoppingItem,
                    as: 'items',
                    include: [{ model: HomeMember, as: 'addedBy', attributes: ['id', 'name'] }],
                    order: [['is_purchased', 'ASC'], ['created_at', 'DESC']],
                },
            ],
        });
        if (!list) {
            reply.status(404);
            return { success: false, error: 'List not found' };
        }
        return { success: true, data: list };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createShoppingList = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const list = await HomeShoppingList.create({
            ...request.body,
            space_id: spaceId,
        });
        reply.status(201);
        return { success: true, data: list, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateShoppingList = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HomeShoppingList.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'List not found' };
        }
        const list = await HomeShoppingList.findByPk(id);
        return { success: true, data: list };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteShoppingList = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HomeShoppingList.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'List not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const clearPurchasedItems = async (request, reply) => {
    try {
        const { id } = request.params;
        await HomeShoppingItem.destroy({
            where: { list_id: id, is_purchased: true },
        });
        return { success: true, data: { cleared: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== SHOPPING ITEMS ====================

const addItem = async (request, reply) => {
    try {
        const { listId } = request.params;
        const item = await HomeShoppingItem.create({
            ...request.body,
            list_id: listId,
        });
        reply.status(201);
        return { success: true, data: item, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateItem = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HomeShoppingItem.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Item not found' };
        }
        const item = await HomeShoppingItem.findByPk(id);
        return { success: true, data: item };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteItem = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HomeShoppingItem.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Item not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const toggleItemPurchased = async (request, reply) => {
    try {
        const { id } = request.params;
        const item = await HomeShoppingItem.findByPk(id);
        if (!item) {
            reply.status(404);
            return { success: false, error: 'Item not found' };
        }

        const newStatus = !item.is_purchased;
        await item.update({
            is_purchased: newStatus,
            purchased_at: newStatus ? new Date() : null,
        });

        return { success: true, data: item };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const bulkAddItems = async (request, reply) => {
    try {
        const { listId } = request.params;
        const { items } = request.body;

        const itemsToCreate = items.map((item) => ({
            ...item,
            list_id: listId,
        }));

        const createdItems = await HomeShoppingItem.bulkCreate(itemsToCreate);
        reply.status(201);
        return { success: true, data: createdItems, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getFrequentItems = async (request, reply) => {
    try {
        const { spaceId } = request.params;

        // Get most frequently added items across all lists
        const items = await HomeShoppingItem.findAll({
            attributes: [
                'name',
                'category',
                'unit',
                [require('sequelize').fn('COUNT', require('sequelize').col('name')), 'frequency'],
            ],
            include: [{
                model: HomeShoppingList,
                as: 'list',
                where: { space_id: spaceId },
                attributes: [],
            }],
            group: ['name', 'category', 'unit'],
            order: [[require('sequelize').literal('frequency'), 'DESC']],
            limit: 20,
            raw: true,
        });

        return { success: true, data: items };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getShoppingLists,
    getShoppingList,
    createShoppingList,
    updateShoppingList,
    deleteShoppingList,
    clearPurchasedItems,
    addItem,
    updateItem,
    deleteItem,
    toggleItemPurchased,
    bulkAddItems,
    getFrequentItems,
};
