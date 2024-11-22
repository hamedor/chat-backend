import '../setup-aliases';
import express from "express"
import http from "http"
import authRoutes from "@src/routes/auth";
import cors from 'cors';
import websocket from "@src/routes/websocket";
import dotenv from 'dotenv';
import * as process from "node:process";

dotenv.config();
const app = express()

app.use(cors())
app.options('*', cors());

app.use(express.json());
app.use('/auth', authRoutes);

const server = http.createServer(app)

websocket(server);

const PORT = process.env.APP_PORT;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
})