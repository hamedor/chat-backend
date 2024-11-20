import { WebSocket, WebSocketServer } from 'ws';
import db from '@src/models/index';
import jwt from 'jsonwebtoken';
import jwtConfig from "@src/config/JwtConfig";

export default (server: any) => {
  const wss = new WebSocketServer({ server });

  const users = new Map<WebSocket, { username: string; role: string }>();

  const broadcastConnectionInfo = () => {
    const connectionCount = wss.clients.size;
    const usersList = Array.from(users.values()).map(user => ({
      username: user.username,
      role: user.role,
    }));

    const message = JSON.stringify({
      type: 'connectionInfo',
      data: { connectionCount, users: usersList },
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  wss.on('connection', (ws: WebSocket) => {
    users.set(ws, { username: 'Гость', role: 'user' });
    broadcastConnectionInfo();

    db.Message.findAll({
      order: [['createdAt', 'ASC']],
      limit: 50,
    })
      .then((messages) => {
        const historyData = messages.map((msg) => ({
          username: msg.username,
          role: msg.role,
          message: msg.message,
          createdAt: msg.createdAt,
        }));
        ws.send(JSON.stringify({ type: 'history', data: historyData }));
      })
      .catch((err) => {
        console.error('Ошибка получения сообщений:', err);
      });

    ws.on('message', (message: string) => {
      console.log("Пришло сообщение", message);
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.token) {
        try {
          const userData = jwt.verify(parsedMessage.token, jwtConfig.secret) as any;
          const username = userData.username || 'Гость';
          const role = userData.role || 'user';

          users.set(ws, { username, role });
          broadcastConnectionInfo();
        } catch (error) {
          ws.send(JSON.stringify({ type: 'error', message: 'Недействительный токен' }));
          ws.close();
        }
      } else if (parsedMessage.type === 'setUsername' && parsedMessage.username) {
        const user = users.get(ws);
        if (user) {
          user.username = parsedMessage.username;
        } else {
          users.set(ws, { username: parsedMessage.username, role: 'user' });
        }
        ws.send(JSON.stringify({ type: 'usernameSet', username: parsedMessage.username }));
        broadcastConnectionInfo();
      } else if (parsedMessage.text) {
        let user = users.get(ws);
        if (!user) {
          user = { username: 'Гость', role: 'user' };
          users.set(ws, user);
          broadcastConnectionInfo();
        }

        db.Message.create({
          username: user.username,
          role: user.role,
          message: parsedMessage.text,
        })
          .then((newMessage) => {
            const messageData = {
              type: 'message',
              data: {
                username: newMessage.username,
                role: newMessage.role,
                message: newMessage.message,
                createdAt: newMessage.createdAt,
              },
            };

            const messageString = JSON.stringify(messageData);

            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
              }
            });
          })
          .catch((err) => {
            console.error('Ошибка сохранения сообщения:', err);
          });
      } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Некорректные данные' }));
      }
    });

    ws.on('close', () => {
      console.log('Пользователь отключился');
      users.delete(ws);
      broadcastConnectionInfo();
    });
  });
};