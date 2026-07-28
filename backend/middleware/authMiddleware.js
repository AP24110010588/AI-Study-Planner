import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        console.log("Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided."
            });

        }

        const token = authHeader.split(" ")[1];

        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("Token:", token);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded Token:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });

    }

};

export default authMiddleware;