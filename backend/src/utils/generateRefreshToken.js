import jwt from 'jsonwebtoken';
import 'dotenv/config';


export function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}