import request from 'supertest';
import app from '../src/app.js';
import { resetData } from '../src/data.js';

describe('Autenticação e cadastro de usuários', () => {
  beforeEach(() => {
    resetData();
  });

  it('deve registrar um usuário válido', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'João Silva',
      email: 'joao.silva@example.com',
      cpf: '11144477735',
      password: 'senha123',
    });
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.token).toBeDefined();
  });

  it('deve bloquear CPF inválido', async () => {
    const response = await request(app).post('/auth/register').send({
      name: 'Maria',
      email: 'maria@example.com',
      cpf: '123.456.789-00',
      password: 'senha123',
    });
    expect(response.status).toBe(400);
  });

  it('deve permitir login com credenciais corretas', async () => {
    await request(app).post('/auth/register').send({
      name: 'Carlos',
      email: 'carlos@example.com',
      cpf: '11144477735',
      password: 'senha123',
    });

    const loginRes = await request(app).post('/auth/login').send({
      email: 'carlos@example.com',
      password: 'senha123',
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});
