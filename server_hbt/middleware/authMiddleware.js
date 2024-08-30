const authMiddleware = (role) => {
    return (req, res, next) => {
        // Temporarily skip authentication check for testing purposes
        req.user = { role: 'Creator' }; // You can hardcode the role here for testing
        next();
    };
};

module.exports = authMiddleware;
