//Returning error for client with defined or default statusCode
function globalErrorHandler (err, req, res, next) {
    res.status(err.hasOwnProperty('statusCode') ? err.statusCode : 500).send(err.message);
    next(err);
}

//Preparing error for global handler
function error(message, statusCode)
{
    const error = new Error(message);
    if (!!statusCode)
    {
        error.statusCode = statusCode;
    }
    return error;
}

module.exports = {
    globalErrorHandler,
    error
};
