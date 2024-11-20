import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import db from '@src/models/index'
import jwtConfig from "@src/config/JwtConfig";
import {authenticateToken} from "@src/middleware/authenticateToken";

const router = express.Router()
const User = db.User;

router.post('/register', async (req:any, res:any) => {

  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
    }

    const newUser = await User.create({ username, password });
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
});

router.post('/login', async (req: any, res: any) => {
  const { username, password } = req.body as { username: string; password: string };

  if (!username || !password) {
    return res.status(400).json({ message: 'Имя пользователя и пароль обязательны для заполнения' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Неверные имя пользователя или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверные имя пользователя или пароль' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
});

router.get('/info', authenticateToken, (req: any, res: any) => {
  res.json({ message: 'Успешно', user: req.user });
});


export default router;