const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-default-secret");
    
    // Check if 2FA is completed
    if (!decoded.is2FACompleted) {
      return res.status(401).send({ message: "2FA not completed. Please verify your OTP." });
    }

    req.user = decoded; // Attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: "Token expired." });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(400).send({ message: "Invalid token." });
    } else {
      return res.status(400).send({ message: "Authentication error." });
    }
  }
};

module.exports = auth;
