const paginationMiddleware = async (req, res, next) => {
    req.pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5
    };
    next();
}

export default paginationMiddleware;