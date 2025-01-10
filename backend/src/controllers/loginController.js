import 'dotenv/config';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import {
    AppDataSource
} from '../config/database.js';
import {
    getCurrentDateTime
} from '../utils/timeUtils.js'
import Client from '../models/clientModel.js';
import {
    generateAccessToken
} from '../utils/generateAccessToken.js'
import {
    generateRefreshToken
} from '../utils/generateRefreshToken.js'

export const checkUser = async (req, res) => {
    try {
        let userDetails = req.body;
        const loginData = await AppDataSource
            .getRepository('User')
            .createQueryBuilder("user")
            .where("user.login_name = :login_name", {
                login_name: userDetails.username
            })
            .getOne()

        if (!loginData) {
            // if not user found
            res.status(404).send({
                message: "User not found"
            })

        } else {
            const organizationData = await getClientAccess(loginData.organization_id); // Wait for the Promise to resolve

            //create and send token if user found
            bcrypt.compare(userDetails.password, loginData.password, (err, success) => {
                if (success == true) {
                    const accessToken = generateAccessToken({
                        email: userDetails.email
                    });
                    const refreshToken = generateRefreshToken({
                        email: userDetails.email
                    });

                    res.send({
                        message: "Login Success",
                        accessToken : accessToken,
                        refreshToken : refreshToken,
                        userid: loginData.id,
                        name: loginData.username,
                        organization_id: loginData.organization_id,
                        fullname: loginData.fullname,
                        email: loginData.email,
                        isAdmin: organizationData.is_admin,
                        company: organizationData.name,
                        alias: organizationData.alias,


                    });

                } else {
                    res.status(403).send({
                        message: "Incorrect password"
                    })
                }
            })

        }

    } catch (err) {
        console.error('Error in getAllUsers:', err);
        res.status(500).send('Database error'); // Handle errors appropriately
    }
}


async function getClientAccess(organization_id) {
    const existingExtension = await AppDataSource
        .getRepository(Client)
        .findOne({
            where: {
                id: organization_id
            }
        })
    return existingExtension;
}



export const registerUser = async (req, res) => {
    let {
        organization_id,
        fullname,
        username,
        email,
        password
    } = req.body; // Get user data from request body
    if (username && email && password) {
        try {
            bcrypt.genSalt(10, (err, salt) => {
                if (!err) {
                    bcrypt.hash(password, salt, async (err, hpass) => {
                        if (!err) {
                            password = hpass;
                            try {
                                await AppDataSource
                                    .createQueryBuilder()
                                    .insert()
                                    .into(User)
                                    .values([{
                                        organization_id: 1,
                                        fullname: fullname,
                                        username: username,
                                        email: email,
                                        password: password,
                                        created_at: getCurrentDateTime
                                    }, ])
                                    .execute()
                                res.status(201).send({
                                    message: "User Registered"
                                })
                            } catch (err) {
                                console.log(err);
                                res.status(500).send({
                                    message: "Some Problem"
                                })
                            }
                        }
                    })
                }
            })
        } catch (err) {
            console.error('Error in getAllUsers:', err);
            res.status(500).send('Database error'); // Handle errors appropriately
        }
    } else {
        res.status(500).send('Fields are missing'); // Handle errors appropriately

    }
}