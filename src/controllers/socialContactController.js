const SocialContact = require('../models/SocialContact');
const SocialCircle = require('../models/SocialCircle');
const SocialContactCircle = require('../models/SocialContactCircle');
const SocialContactNetwork = require('../models/SocialContactNetwork');
const SocialContactTag = require('../models/SocialContactTag');
const SocialContactPreference = require('../models/SocialContactPreference');
const SocialContactRestriction = require('../models/SocialContactRestriction');
const SocialContactSpecialDate = require('../models/SocialContactSpecialDate');
const SocialContactReminder = require('../models/SocialContactReminder');
const SocialContactProfessional = require('../models/SocialContactProfessional');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

async function getContacts(request, reply) {
    try {
        const { userId } = request.params;
        const { circleId, search, favorite, sortBy } = request.query;

        const where = { user_id: userId, is_active: true };

        if (favorite === 'true') {
            where.is_favorite = true;
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { nickname: { [Op.iLike]: `%${search}%` } },
            ];
        }

        let order = [['name', 'ASC']];
        if (sortBy === 'birthday') {
            order = [['birthday', 'ASC NULLS LAST'], ['name', 'ASC']];
        }

        let contacts = await SocialContact.findAll({
            where,
            order,
        });

        // Filter by circle if specified
        if (circleId) {
            const contactIdsInCircle = await SocialContactCircle.findAll({
                where: { circle_id: circleId },
                attributes: ['contact_id'],
            });
            const ids = contactIdsInCircle.map((c) => c.contact_id);
            contacts = contacts.filter((c) => ids.includes(c.id));
        }

        // Get circles for each contact
        const contactsWithCircles = await Promise.all(
            contacts.map(async (contact) => {
                const circleRelations = await SocialContactCircle.findAll({
                    where: { contact_id: contact.id },
                });
                const circles = await SocialCircle.findAll({
                    where: { id: circleRelations.map((r) => r.circle_id) },
                });
                return { ...contact.toJSON(), circles };
            })
        );

        return { success: true, data: contactsWithCircles };
    } catch (error) {
        console.error('Error getting contacts:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getContact(request, reply) {
    try {
        const { id } = request.params;

        const contact = await SocialContact.findByPk(id);

        if (!contact) {
            return reply.status(404).send({ success: false, error: 'Contact not found' });
        }

        // Get related data
        const [circles, networks, tags, preferences, restrictions, specialDates, reminder, professional] = await Promise.all([
            SocialContactCircle.findAll({ where: { contact_id: id } }).then(async (rels) => {
                const circleIds = rels.map((r) => r.circle_id);
                return SocialCircle.findAll({ where: { id: circleIds } });
            }),
            SocialContactNetwork.findAll({ where: { contact_id: id } }),
            SocialContactTag.findAll({ where: { contact_id: id } }),
            SocialContactPreference.findAll({ where: { contact_id: id } }),
            SocialContactRestriction.findAll({ where: { contact_id: id } }),
            SocialContactSpecialDate.findAll({ where: { contact_id: id } }),
            SocialContactReminder.findOne({ where: { contact_id: id } }),
            SocialContactProfessional.findOne({ where: { contact_id: id } }),
        ]);

        return {
            success: true,
            data: {
                ...contact.toJSON(),
                circles,
                networks,
                tags: tags.map((t) => t.tag_name),
                preferences,
                restrictions,
                specialDates,
                reminder,
                professional,
            },
        };
    } catch (error) {
        console.error('Error getting contact:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function createContact(request, reply) {
    try {
        const { userId } = request.params;
        const { circleIds, networks, tags, ...contactData } = request.body;

        const contact = await SocialContact.create({
            user_id: userId,
            ...contactData,
        });

        // Add to circles
        if (circleIds && circleIds.length > 0) {
            for (const circleId of circleIds) {
                await SocialContactCircle.create({
                    contact_id: contact.id,
                    circle_id: circleId,
                });
            }
        }

        // Add networks
        if (networks && networks.length > 0) {
            for (const network of networks) {
                await SocialContactNetwork.create({
                    contact_id: contact.id,
                    ...network,
                });
            }
        }

        // Add tags
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                await SocialContactTag.create({
                    contact_id: contact.id,
                    tag_name: tag,
                });
            }
        }

        return reply.status(201).send({ success: true, data: contact });
    } catch (error) {
        console.error('Error creating contact:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateContact(request, reply) {
    try {
        const { id } = request.params;
        const { circleIds, networks, tags, ...contactData } = request.body;

        const contact = await SocialContact.findByPk(id);

        if (!contact) {
            return reply.status(404).send({ success: false, error: 'Contact not found' });
        }

        await contact.update(contactData);

        // Update circles
        if (circleIds !== undefined) {
            await SocialContactCircle.destroy({ where: { contact_id: id } });
            for (const circleId of circleIds) {
                await SocialContactCircle.create({
                    contact_id: id,
                    circle_id: circleId,
                });
            }
        }

        // Update networks
        if (networks !== undefined) {
            await SocialContactNetwork.destroy({ where: { contact_id: id } });
            for (const network of networks) {
                await SocialContactNetwork.create({
                    contact_id: id,
                    ...network,
                });
            }
        }

        // Update tags
        if (tags !== undefined) {
            await SocialContactTag.destroy({ where: { contact_id: id } });
            for (const tag of tags) {
                await SocialContactTag.create({
                    contact_id: id,
                    tag_name: tag,
                });
            }
        }

        return { success: true, data: contact };
    } catch (error) {
        console.error('Error updating contact:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function deleteContact(request, reply) {
    try {
        const { id } = request.params;

        const contact = await SocialContact.findByPk(id);

        if (!contact) {
            return reply.status(404).send({ success: false, error: 'Contact not found' });
        }

        await contact.update({ is_active: false });

        return { success: true, data: { deleted: true } };
    } catch (error) {
        console.error('Error deleting contact:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function toggleFavorite(request, reply) {
    try {
        const { id } = request.params;

        const contact = await SocialContact.findByPk(id);

        if (!contact) {
            return reply.status(404).send({ success: false, error: 'Contact not found' });
        }

        await contact.update({ is_favorite: !contact.is_favorite });

        return { success: true, data: contact };
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateContactNotes(request, reply) {
    try {
        const { id } = request.params;
        const { preferences, restrictions, specialDates, notes, professional } = request.body;

        const contact = await SocialContact.findByPk(id);

        if (!contact) {
            return reply.status(404).send({ success: false, error: 'Contact not found' });
        }

        if (notes !== undefined) {
            await contact.update({ notes });
        }

        if (preferences !== undefined) {
            await SocialContactPreference.destroy({ where: { contact_id: id } });
            for (const pref of preferences) {
                await SocialContactPreference.create({ contact_id: id, ...pref });
            }
        }

        if (restrictions !== undefined) {
            await SocialContactRestriction.destroy({ where: { contact_id: id } });
            for (const restriction of restrictions) {
                await SocialContactRestriction.create({
                    contact_id: id,
                    description: restriction,
                });
            }
        }

        if (specialDates !== undefined) {
            await SocialContactSpecialDate.destroy({ where: { contact_id: id } });
            for (const date of specialDates) {
                await SocialContactSpecialDate.create({ contact_id: id, ...date });
            }
        }

        if (professional !== undefined) {
            const existingPro = await SocialContactProfessional.findOne({ where: { contact_id: id } });
            if (existingPro) {
                await existingPro.update(professional);
            } else {
                await SocialContactProfessional.create({ contact_id: id, ...professional });
            }
        }

        return { success: true, data: { updated: true } };
    } catch (error) {
        console.error('Error updating contact notes:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateContactReminder(request, reply) {
    try {
        const { id } = request.params;
        const data = request.body;

        const contact = await SocialContact.findByPk(id);

        if (!contact) {
            return reply.status(404).send({ success: false, error: 'Contact not found' });
        }

        let reminder = await SocialContactReminder.findOne({ where: { contact_id: id } });

        if (reminder) {
            await reminder.update(data);
        } else {
            reminder = await SocialContactReminder.create({ contact_id: id, ...data });
        }

        return { success: true, data: reminder };
    } catch (error) {
        console.error('Error updating contact reminder:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getUpcomingBirthdays(request, reply) {
    try {
        const { userId } = request.params;
        const { days = 30 } = request.query;

        const today = new Date();
        const contacts = await SocialContact.findAll({
            where: {
                user_id: userId,
                is_active: true,
                birthday: { [Op.not]: null },
            },
        });

        const upcomingBirthdays = contacts
            .map((contact) => {
                const birthday = new Date(contact.birthday);
                const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

                if (thisYearBirthday < today) {
                    thisYearBirthday.setFullYear(today.getFullYear() + 1);
                }

                const daysUntil = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));

                return {
                    ...contact.toJSON(),
                    daysUntilBirthday: daysUntil,
                    upcomingBirthday: thisYearBirthday,
                };
            })
            .filter((c) => c.daysUntilBirthday <= parseInt(days))
            .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);

        return { success: true, data: upcomingBirthdays };
    } catch (error) {
        console.error('Error getting upcoming birthdays:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

module.exports = {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    toggleFavorite,
    updateContactNotes,
    updateContactReminder,
    getUpcomingBirthdays,
};
