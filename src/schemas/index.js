// Centralized schema exports

const common = require('./common');
const auth = require('./auth');
const user = require('./user');
const habit = require('./habit');
const project = require('./project');
const finance = require('./finance');
const health = require('./health');
const study = require('./study');
const home = require('./home');
const freezeMode = require('./freezeMode');

module.exports = {
    common,
    auth,
    user,
    habit,
    project,
    finance,
    health,
    study,
    home,
    freezeMode
};
