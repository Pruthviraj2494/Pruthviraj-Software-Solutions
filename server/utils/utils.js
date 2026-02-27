exports.handleAPIResponse = {
    success: (res, data, status = 200, message = "Success") => {
        return res.status(status).send({
            status: { code: 0, message },
            data
        });
    },
    error: (res, message = "Error", status = 400) => {
        return res.status(status).send({
            status: { code: -1, message }
        });
    },
    unauthorized: (res, message = "Unauthorized") => {
        return res.status(401).send({
            status: { code: -1, message }
        });
    },
    forbidden: (res, message = "Forbidden") => {
        return res.status(403).send({
            status: { code: -1, message }
        });
    },
    notFound: (res, message = "Not found") => {
        return res.status(404).send({
            status: { code: -1, message }
        });
    },
    conflict: (res, message = "Conflict") => {
        return res.status(409).send({
            status: { code: -1, message }
        });
    }
};