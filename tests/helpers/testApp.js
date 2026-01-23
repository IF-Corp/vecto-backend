const buildApp = require('../../src/app');

let app = null;

async function createTestApp() {
    if (app) {
        return app;
    }

    app = await buildApp({
        logger: false
    });

    await app.ready();
    return app;
}

async function closeTestApp() {
    if (app) {
        await app.close();
        app = null;
    }
}

function getTestApp() {
    return app;
}

module.exports = {
    createTestApp,
    closeTestApp,
    getTestApp
};
