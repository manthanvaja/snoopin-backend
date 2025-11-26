export const successResponse = (res, data = null, message = "Success") => {
    return res.status(200).json({
        data,
        result: true,
        message,
    });
};

export const errorResponse = (
    res,
    message = "Something went wrong",
    statusCode = 500,
    data = null
) => {
    return res.status(statusCode).json({
        data,
        result: false,
        message,
    });
};
