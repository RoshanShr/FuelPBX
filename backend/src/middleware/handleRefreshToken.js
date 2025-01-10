import jwt from "jsonwebtoken";
import 'dotenv/config';
import {
    generateAccessToken
} from '../utils/generateAccessToken.js'
import {
    generateRefreshToken
} from '../utils/generateRefreshToken.js'

export function handleRefreshToken(req, res) {
    const refreshToken = req.headers["x-refresh-token"]; // Expect refresh token in the request body

    if (!refreshToken) {
        return res.status(403).send({
            message: "Refresh token is missing. Please login again."
        });
    }
    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, refreshData) => {
            console.log(refreshData);
            if (err) {
                return res.status(403).send({
                    message: "Invalid or expired refresh token. Please login again."
                });
            }

            const newRefreshToken = generateRefreshToken({
                email: 'roshan.shrestha@voxcrow.team',
                id: refreshData.iat
            });


            const newAccessToken = generateAccessToken({
                email: 'roshan.shrestha@voxcrow.team',
                id: refreshData.iat

            });

            // Send the new tokens back to the client
            res.status(200).send({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });
    } catch (err) {
        console.log(err)
    }


}