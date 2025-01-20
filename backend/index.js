import 'dotenv/config';


import express from 'express';
import cors from 'cors';

import loginRouter from './src/routes/login.js';
import usersRouter from './src/routes/users.js';
import clientRouter from './src/routes/clients.js';
import reportsRouter from './src/routes/reports.js';
import extensionsRouter from './src/routes/extensions.js';
import dialplanRouter from './src/routes/dialplan.js';
import authRouter from './src/routes/auth.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRouter);
app.use(loginRouter);
app.use(usersRouter);
app.use(clientRouter);
app.use(reportsRouter);
app.use(extensionsRouter);
app.use(dialplanRouter);

// const ACCESS_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
// const REFRESH_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

// Mock refresh token store (use a database in production)
// let refreshTokens = [];

const host = process.env.HOST
const port = process.env.PORT;
app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});