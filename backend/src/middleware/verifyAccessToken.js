import 'dotenv/config';
import jwt from 'jsonwebtoken';
function verifyAccessToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).send({ message: "Please send a token" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send({ message: "Access token expired" });
            }
            return res.status(403).send({ message: "Invalid Token" });
        }

        req.user = data; // Attach decoded data to the request
        next();
    });
}


export default verifyAccessToken;
