const HomeStockItem = require('../models/HomeStockItem');
const HomeSpace = require('../models/HomeSpace');
const { Op } = require('sequelize');

// Get all stock items for a space
const getStockItems = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { category, lowStock, expiringSoon } = request.query;

        const where = { space_id: spaceId, is_active: true };

        if (category) {
            where.category = category;
        }

        let items = await HomeStockItem.findAll({
            where,
            order: [['name', 'ASC']],
        });

        // Filter low stock items
        if (lowStock === 'true') {
            items = items.filter(
                (item) =>
                    parseFloat(item.current_quantity) <= parseFloat(item.min_quantity)
            );
        }

        // Filter expiring soon (next 7 days)
        if (expiringSoon === 'true') {
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);

            items = items.filter((item) => {
                if (!item.expiry_date) return false;
                const expiryDate = new Date(item.expiry_date);
                return expiryDate >= today && expiryDate <= nextWeek;
            });
        }

        return reply.send({ success: true, data: items });
    } catch (error) {
        console.error('Error getting stock items:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get a single stock item
const getStockItem = async (request, reply) => {
    try {
        const { userId, spaceId, itemId } = request.params;

        const item = await HomeStockItem.findOne({
            where: { id: itemId, space_id: spaceId },
        });

        if (!item) {
            return reply.status(404).send({ success: false, error: 'Item not found' });
        }

        return reply.send({ success: true, data: item });
    } catch (error) {
        console.error('Error getting stock item:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Create a new stock item
const createStockItem = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const data = request.body;

        const item = await HomeStockItem.create({
            ...data,
            space_id: spaceId,
        });

        return reply.status(201).send({ success: true, data: item });
    } catch (error) {
        console.error('Error creating stock item:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update a stock item
const updateStockItem = async (request, reply) => {
    try {
        const { userId, spaceId, itemId } = request.params;
        const data = request.body;

        const item = await HomeStockItem.findOne({
            where: { id: itemId, space_id: spaceId },
        });

        if (!item) {
            return reply.status(404).send({ success: false, error: 'Item not found' });
        }

        await item.update(data);

        return reply.send({ success: true, data: item });
    } catch (error) {
        console.error('Error updating stock item:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update stock quantity
const updateStockQuantity = async (request, reply) => {
    try {
        const { userId, spaceId, itemId } = request.params;
        const { quantity, operation } = request.body;

        const item = await HomeStockItem.findOne({
            where: { id: itemId, space_id: spaceId },
        });

        if (!item) {
            return reply.status(404).send({ success: false, error: 'Item not found' });
        }

        let newQuantity = parseFloat(item.current_quantity);
        const changeAmount = parseFloat(quantity);

        if (operation === 'add') {
            newQuantity += changeAmount;
        } else if (operation === 'subtract') {
            newQuantity = Math.max(0, newQuantity - changeAmount);
        } else if (operation === 'set') {
            newQuantity = changeAmount;
        }

        await item.update({ current_quantity: newQuantity });

        return reply.send({ success: true, data: item });
    } catch (error) {
        console.error('Error updating stock quantity:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Delete a stock item
const deleteStockItem = async (request, reply) => {
    try {
        const { userId, spaceId, itemId } = request.params;

        const item = await HomeStockItem.findOne({
            where: { id: itemId, space_id: spaceId },
        });

        if (!item) {
            return reply.status(404).send({ success: false, error: 'Item not found' });
        }

        await item.update({ is_active: false });

        return reply.send({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting stock item:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get low stock items
const getLowStockItems = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        const items = await HomeStockItem.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const lowStockItems = items.filter(
            (item) =>
                parseFloat(item.current_quantity) <= parseFloat(item.min_quantity)
        );

        return reply.send({ success: true, data: lowStockItems });
    } catch (error) {
        console.error('Error getting low stock items:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get expiring items
const getExpiringItems = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { days = 7 } = request.query;

        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + parseInt(days));

        const items = await HomeStockItem.findAll({
            where: {
                space_id: spaceId,
                is_active: true,
                expiry_date: {
                    [Op.not]: null,
                    [Op.between]: [today, futureDate],
                },
            },
            order: [['expiry_date', 'ASC']],
        });

        return reply.send({ success: true, data: items });
    } catch (error) {
        console.error('Error getting expiring items:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Add stock item to shopping list
const addToShoppingList = async (request, reply) => {
    try {
        const { userId, spaceId, itemId } = request.params;
        const { listId, quantity } = request.body;

        const HomeShoppingItem = require('../models/HomeShoppingItem');

        const stockItem = await HomeStockItem.findOne({
            where: { id: itemId, space_id: spaceId },
        });

        if (!stockItem) {
            return reply.status(404).send({ success: false, error: 'Item not found' });
        }

        const shoppingItem = await HomeShoppingItem.create({
            list_id: listId,
            name: stockItem.name,
            quantity: quantity || stockItem.min_quantity,
            unit: stockItem.unit,
            is_purchased: false,
        });

        return reply.status(201).send({ success: true, data: shoppingItem });
    } catch (error) {
        console.error('Error adding to shopping list:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    getStockItems,
    getStockItem,
    createStockItem,
    updateStockItem,
    updateStockQuantity,
    deleteStockItem,
    getLowStockItems,
    getExpiringItems,
    addToShoppingList,
};
