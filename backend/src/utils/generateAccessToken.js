import jwt from 'jsonwebtoken';
import 'dotenv/config';


export function generateAccessToken(user) {
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1y'
        });

}