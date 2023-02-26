module.exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({
                error: {
                    message: 'You are not authorized to access this resource',
                }
            });
        }
    } catch (error) {
        throw error;
    }
};