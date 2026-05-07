import jwt from 'jsonwebtoken';
import { findUserById } from '../data.js';

const JWT_SECRET = process.env.JWT_SECRET || 'senai_backend_secret';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
