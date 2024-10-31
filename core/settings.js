import express from 'express';

const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const server = express();
const PORT = 3000;

export {server, PORT, DATABASE_URL, JWT_SECRET};
