import {
  createAccount as createAccountRecord,
  deleteAccountById,
  findAccountById,
  findAccountByOwnerAndId,
  listAccountsByOwner,
  makeDeposit,
  makeTransfer,
  makeWithdrawal,
  updateAccount as updateAccountRecord,
} from '../data.js';
import { validateAccountPayload, validateAmount, validateUpdateAccountPayload } from '../validators.js';

export function listAccounts(req, res) {
  const accounts = listAccountsByOwner(req.user.id);
  res.json(accounts);
}

export function createAccount(req, res) {
  const payload = req.body;
  if (!validateAccountPayload(payload)) {
    return res.status(400).json({ error: 'Dados inválidos para criação de conta' });
  }
  const account = createAccountRecord({
    ownerId: req.user.id,
    holderName: payload.holderName.trim(),
    cpf: payload.cpf.replace(/\D/g, ''),
    accountType: payload.accountType.trim(),
    branch: payload.branch.trim(),
  });
  res.status(201).json(account);
}

export function updateAccount(req, res) {
  const account = findAccountByOwnerAndId(req.user.id, req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }
  if (!validateUpdateAccountPayload(req.body)) {
    return res.status(400).json({ error: 'Dados inválidos para atualização de conta' });
  }
  const updated = updateAccountRecord(account, req.body);
  res.json(updated);
}

export function deleteAccount(req, res) {
  const account = findAccountByOwnerAndId(req.user.id, req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }
  deleteAccountById(account.id);
  res.json({ message: 'Conta excluída com sucesso' });
}

export function deposit(req, res) {
  const account = findAccountByOwnerAndId(req.user.id, req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }
  const amount = Number(req.body.amount);
  if (!validateAmount(amount)) {
    return res.status(400).json({ error: 'Valor de depósito inválido' });
  }
  const transaction = makeDeposit(account, amount);
  res.json({ balance: account.balance, transaction });
}

export function withdraw(req, res) {
  const account = findAccountByOwnerAndId(req.user.id, req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }
  const amount = Number(req.body.amount);
  if (!validateAmount(amount)) {
    return res.status(400).json({ error: 'Valor de saque inválido' });
  }
  if (amount > account.balance) {
    return res.status(400).json({ error: 'Saldo insuficiente' });
  }
  const transaction = makeWithdrawal(account, amount);
  res.json({ balance: account.balance, transaction });
}

export function transfer(req, res) {
  const { fromAccountId, toAccountId, amount } = req.body;
  if (!fromAccountId || !toAccountId) {
    return res.status(400).json({ error: 'Contas de origem e destino são obrigatórias' });
  }
  if (fromAccountId === toAccountId) {
    return res.status(400).json({ error: 'Não é possível transferir para a mesma conta' });
  }
  const transferAmount = Number(amount);
  if (!validateAmount(transferAmount)) {
    return res.status(400).json({ error: 'Valor de transferência inválido' });
  }

  const fromAccount = findAccountByOwnerAndId(req.user.id, fromAccountId);
  if (!fromAccount) {
    return res.status(404).json({ error: 'Conta de origem não encontrada' });
  }
  if (transferAmount > fromAccount.balance) {
    return res.status(400).json({ error: 'Saldo insuficiente para transferência' });
  }
  const toAccount = findAccountById(toAccountId);
  if (!toAccount) {
    return res.status(404).json({ error: 'Conta de destino não encontrada' });
  }

  const result = makeTransfer(fromAccount, toAccount, transferAmount);
  res.json({ balance: fromAccount.balance, transaction: result.outTx });
}

export function getBalance(req, res) {
  const account = findAccountByOwnerAndId(req.user.id, req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }
  res.json({ balance: account.balance });
}

export function getStatement(req, res) {
  const account = findAccountByOwnerAndId(req.user.id, req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }
  res.json({ statement: account.transactions });
}
