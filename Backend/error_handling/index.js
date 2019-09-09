function globalErrorHandler (err, req, res, next) {
    res.status(err.hasOwnProperty('statusCode') ? err.statusCode : 500).send(err.message);
    next(err);
}

function error(message, statusCode)
{
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

module.exports = {
    globalErrorHandler,
    error
};
