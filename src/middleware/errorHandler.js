async function errorHandler(error, request, reply) {
    // Log the error
    console.error(error);

    // Handle validation errors
    if (error.validation) {
        return reply.status(400).send({
            error: 'Validation Error',
            message: 'Request validation failed',
            details: error.validation
        });
    }

    // Handle Sequelize errors
    if (error.name === 'SequelizeValidationError') {
        return reply.status(400).send({
            error: 'Validation Error',
            message: error.message,
            details: error.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        return reply.status(409).send({
            error: 'Conflict',
            message: 'Resource already exists',
            details: error.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    // Default to 500 Internal Server Error
    const statusCode = error.statusCode || 500;

    reply.status(statusCode).send({
        error: error.name || 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
}

module.exports = errorHandler;
