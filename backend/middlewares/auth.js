import jwt from "jsonwebtoken";

export const jwtAuthMiddleware = (req , res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({message : "No authorization header provided"});
    const token = authorization.split(' ')[1]; 
    if(!token) return res.status(401).json({message : "No token provided"});

    try {
        // verify the JWT Token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

         req.user = {
            id: decoded.id,      
            role: decoded.role,
            // email: decoded.email
        };
        
        next();
    } catch (error) {
        console.log("JWT verification error:", error);
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
}