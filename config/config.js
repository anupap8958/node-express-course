require('dotenv').config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@user.thyh9qa.mongodb.net/online_node_api`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

/* jwt token */
// generate token secret to random alpha-numeric characters (a-z, A-Z, 0-9)
const generateTokenSecret = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let secret = '';
    for (let i = 0; i < 64; i++) {
        secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
};
const JWT_SECRET = process.env.JWT_SECRET || generateTokenSecret();

module.exports = {
    MONGO_URL,
    SERVER_PORT,
    DOMAIN: process.env.DOMAIN,
    JWT_SECRET,
};