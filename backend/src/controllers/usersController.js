//users add edit delete is done here
import {
    AppDataSource
} from '../config/database.js';
import 'dotenv/config';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import {
    getCurrentDateTime
} from '../utils/timeUtils.js'
import Client from '../models/clientModel.js';

export const getUsers = async (req, res) => {
    try {
        const organization_id = parseInt(req.query.organization_id)
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
        const offset = (page - 1) * limit; // Calculate the offset for the query

        const userRepository = AppDataSource.getRepository('User'); // Get repository by entity name
        const [users, totalItems] = await userRepository.findAndCount({
            where: {
                organization_id: organization_id, // Filter users by client_id
            },
            skip: offset, // Skip the records before the current page
            take: limit, // Limit the number of records to fetch
        });

        // Return paginated response
        res.json({
            data: users, // The clients for the current page
            currentPage: page, // The current page number
            totalItems, // Total number of items
            totalPages: Math.ceil(totalItems / limit), // Total number of pages
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Database error');
    }
};


export const addUser = async (req, res) => {
    let {
        organization_id,
        organization_alias,
        fullname,
        username,
        email,
        password
    } = req.body; // Get user data from request body
    if (username && email && password) {
        try {
            const checkLimit = await AppDataSource
                .getRepository(Client)
                .findOne({
                    where: {
                        id: organization_id
                    },
                    select: ["user_limit"],
                });

            const countUser = await AppDataSource
                .getRepository(User)
                .count({
                    where: {
                        organization_id: organization_id // Add your condition here
                    }
                });


            if (countUser  >= checkLimit.user_limit) {
                return res.status(402).send({
                    message: "User limit exceeded"
                });
            }

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
                                        organization_id: organization_id,
                                        fullname: fullname,
                                        username: username,
                                        login_name: `${username}@${organization_alias}`,
                                        email: email,
                                        password: password,
                                        created_at: getCurrentDateTime
                                    }, ])
                                    .execute()
                                res.status(201).send({
                                    message: "User added"
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

export const updateUser = async (req, res) => {
    let {
        id, // Assuming you send the user's ID to update
        organization_id,
        organization_alias,
        fullname,
        username,
        email,
        password
    } = req.body; // Get user data from request body
    if (id) {
        try {
            const existingUser = await AppDataSource
                .getRepository(User)
                .findOne({
                    where: {
                        id: id
                    }
                });

            if (!existingUser) {
                return res.status(404).send({
                    message: "User not found"
                });
            }

            // Update fields
            existingUser.organization_id = organization_id || existingUser.organization_id;
            existingUser.organization_alias = organization_alias || existingUser.organization_alias;
            existingUser.fullname = fullname || existingUser.fullname;
            existingUser.username = username || existingUser.username;
            existingUser.email = email || existingUser.email;
            existingUser.login_name = `${username}@${existingUser.organization_alias}` || existingUser.login_name;

            // Only hash the password if it is provided
            if (password && 1 == 2) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) return res.status(500).send({
                        message: "Error generating salt"
                    });

                    bcrypt.hash(password, salt, async (err, hpass) => {
                        if (err) return res.status(500).send({
                            message: "Error hashing password"
                        });

                        existingUser.password = hpass;
                        // Save the updated user
                        try {
                            await AppDataSource.getRepository(User).save(existingUser);
                            res.status(200).send({
                                message: "User updated successfully"
                            });
                        } catch (err) {
                            console.error(err);
                            res.status(500).send({
                                message: "Some Problem"
                            });
                        }
                    });
                });
            } else {
                // If password is not provided, save without updating the password
                try {
                    await AppDataSource.getRepository(User).save(existingUser);
                    res.status(200).send({
                        message: "User updated successfully"
                    });
                } catch (err) {
                    console.error(err);
                    res.status(500).send({
                        message: "Some Problem"
                    });
                }
            }
        } catch (err) {
            console.error('Error in updateUser:', err);
            res.status(500).send('Database error');
        }
    } else {
        res.status(400).send('User ID is required');
    }
};

export const deleteUser = async (req, res) => {
    let {
        id
    } = req.body; // Get user data from request body
    if (id) {
        try {

            // Check if the user exists
            const user = await AppDataSource
                .createQueryBuilder()
                .select("user")
                .from(User, "user")
                .where("user.id = :id", {
                    id: id
                })
                .getOne();

            if (!user) {
                return res.status(404).send({
                    message: 'User not found'
                }); // Return 404 if user does not exist
            }

            await AppDataSource
                .createQueryBuilder()
                .delete()
                .from(User)
                .where("id = :id", {
                    id: id
                })
                .execute()
            res.status(200).send({
                message: "User deleted successfully"
            })
        } catch (err) {
            res.status(500).send({
                message: "Some Problem"
            })
        }
    } else {
        res.status(500).send('Id is missing'); // Handle errors appropriately

    }
}