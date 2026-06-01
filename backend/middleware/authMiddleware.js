const jwt = require('jsonwebtoken');

// Middleware to protect routes - checks if user is logged in
const protect = (req, res, next) => {
    let token;

    // Check if the request has an Authorization header with a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from: "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user info to the request so controllers can use it
            req.user = decoded;

            // Call next() to pass control to the next function (the controller)
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token is invalid' });
        }
    }

    // If no token was found at all, deny access
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
