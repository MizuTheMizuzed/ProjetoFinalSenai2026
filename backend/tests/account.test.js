import request from 'supertest';
import app from '../src/app.js';
import { resetData } from '../src/data.js';

let token;
let accountId;

beforeEach(async () => {
  resetData();
  const register = await request(app).post('/auth/register').send({
    name: 'Rafael Teste',
    email: 'rafael@example.com',
    cpf: '11144477735',
    password: 'senha123',
  });
  token = register.body.token;
  const account = await request(app)
    .post('/accounts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      holderName: 'Rafael Teste',
      cpf: '11144477735',
      accountType: 'corrente',
      branch: '001',
    });
  accountId = account.body.id;
});

describe('Operações bancárias', () => {
  it('deve depositar valores válidos', async () => {
    const res = await request(app)
      .post(`/accounts/${accountId}/deposit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100.5 });
    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(100.5);
  });

  it('deve sacar valores válidos', async () => {
    await request(app)
      .post(`/accounts/${accountId}/deposit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 200 });

    const res = await request(app)
      .post(`/accounts/${accountId}/withdraw`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 50 });

    expect(res.status).toBe(200);
    expect(res.body.balance).toBe(150);
  });

  it('deve proibir saque maior que o saldo', async () => {
    const res = await request(app)
      .post(`/accounts/${accountId}/withdraw`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 500 });
    expect(res.status).toBe(400);
  });

  it('deve transferir entre contas', async () => {
    const account2 = await request(app)
      .post('/accounts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        holderName: 'Rafael Teste 2',
        cpf: '11144477735',
        accountType: 'poupança',
        branch: '002',
      });

    await request(app)
      .post(`/accounts/${accountId}/deposit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 350 });

    const transferRes = await request(app)
      .post('/accounts/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        fromAccountId: accountId,
        toAccountId: account2.body.id,
        amount: 150,
      });

    expect(transferRes.status).toBe(200);
    expect(transferRes.body.balance).toBe(200);
  });

  it('deve validar valores de transação', async () => {
    const badRes = await request(app)
      .post(`/accounts/${accountId}/deposit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 0 });
    expect(badRes.status).toBe(400);
  });
});
