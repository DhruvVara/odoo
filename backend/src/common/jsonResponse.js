exports.jsonResponse = (res, statusCode, status, message, data = []) => {
    return res.status(statusCode).json({ status, message, data });
}