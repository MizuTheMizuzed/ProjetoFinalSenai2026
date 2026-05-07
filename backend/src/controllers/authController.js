import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createUser,
  findUserByCpf,
  findUserByEmail,
} from '../data.js';
import { validateUserPayload } from '../validators.js';

const JWT_SECRET = process.env.JWT_SECRET || 'senai_backend_secret';
const JWT_EXPIRES_IN = '2h';

function createToken(user) {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function register(req, res) {
  const { name, email, cpf, password } = req.body;
  if (!validateUserPayload({ name, email, cpf, password })) {
    return res.status(400).json({ error: 'Dados inválidos para cadastro de usuário' });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }
  if (findUserByCpf(cpf)) {
    return res.status(409).json({ error: 'CPF já cadastrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser({ name: name.trim(), email, cpf: cpf.replace(/\D/g, ''), passwordHash });
  const token = createToken(user);

  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, cpf: user.cpf }, token });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = createToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, cpf: user.cpf } });
}

export function me(req, res) {
  const { id, name, email, cpf, createdAt } = req.user;
  res.json({ id, name, email, cpf, createdAt });
}
