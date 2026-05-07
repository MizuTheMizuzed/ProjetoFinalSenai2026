const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

interface AuthResponse {
  token: string;
}

export async function getBackendStatus() {
  const res = await fetch(`${BACKEND_URL}/`);
  return res.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(response.statusText || 'Falha no login');
  }
  return response.json() as Promise<AuthResponse>;
}

export async function registerUser() {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Cliente Senai',
      email: 'cliente@senai.com',
      cpf: '11144477735',
      password: 'senha123',
    }),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || 'Falha no cadastro');
  }
  return response.json() as Promise<AuthResponse>;
}

export async function ensureAuthToken() {
  try {
    const loginResult = await login('cliente@senai.com', 'senha123');
    return loginResult.token;
  } catch (error) {
    const registerResult = await registerUser();
    return registerResult.token;
  }
}

export async function listAccounts(token: string) {
  const response = await fetch(`${BACKEND_URL}/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Erro ao buscar contas');
  }
  return response.json();
}

export async function createDefaultAccount(token: string) {
  const response = await fetch(`${BACKEND_URL}/accounts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      holderName: 'Cliente Senai',
      cpf: '11144477735',
      accountType: 'corrente',
      branch: '001',
    }),
  });
  if (!response.ok) {
    throw new Error('Falha ao criar conta');
  }
  return response.json();
}
