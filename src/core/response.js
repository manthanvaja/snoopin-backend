export const success = (res, data = null, message = "Success") =>
    res.status(200).json({ result: true, message, data });

export const error = (res, message = "Error", code = 500) =>
    res.status(code).json({ result: false, message, data: null });
