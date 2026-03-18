export const handleResponse = (res, statusCode, message, data) => {
    if (data !== undefined) {
        res.status(statusCode).json({
            status: "success",
            message,
            data,
        });
        return;
    }
    res.status(statusCode).json({
        status: "success",
        message,
    });
};
