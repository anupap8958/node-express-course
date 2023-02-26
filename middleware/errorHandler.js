module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            statusCode: statusCode,
            message: message,
            validation: err.validation,
        }
    });
};