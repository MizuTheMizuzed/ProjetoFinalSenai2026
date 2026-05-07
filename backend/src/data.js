const users = [];
const accounts = [];
let userIdSeq = 1;
let accountIdSeq = 1;
let transactionIdSeq = 1;

export function resetData() {
  users.length = 0;
  accounts.length = 0;
  userIdSeq = 1;
  accountIdSeq = 1;
  transactionIdSeq = 1;
}

export function findUserByEmail(email) {
  return users.find((user) => user.email === email.toLowerCase());
}

export function findUserByCpf(cpf) {
  return users.find((user) => user.cpf === cpf);
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function createUser({ name, email, cpf, passwordHash }) {
  const user = {
    id: String(userIdSeq++),
    name,
    email: email.toLowerCase(),
    cpf,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function createAccount({ ownerId, holderName, cpf, accountType, branch }) {
  const accountNumber = String(100000 + accountIdSeq).padStart(6, '0');
  const account = {
    id: String(accountIdSeq++),
    ownerId,
    accountNumber,
    holderName,
    cpf,
    accountType,
    branch,
    balance: 0,
    transactions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  accounts.push(account);
  return account;
}

export function findAccountById(id) {
  return accounts.find((account) => account.id === String(id));
}

export function listAccountsByOwner(ownerId) {
  return accounts.filter((account) => account.ownerId === ownerId);
}

export function deleteAccountById(id) {
  const index = accounts.findIndex((account) => account.id === String(id));
  if (index === -1) return false;
  accounts.splice(index, 1);
  return true;
}

export function updateAccount(account, updates) {
  Object.assign(account, updates, { updatedAt: new Date().toISOString() });
  return account;
}

export function addTransaction(account, transaction) {
  const entry = {
    id: String(transactionIdSeq++),
    date: new Date().toISOString(),
    ...transaction,
  };
  account.transactions.push(entry);
  account.updatedAt = new Date().toISOString();
  return entry;
}

export function makeDeposit(account, amount) {
  account.balance += amount;
  return addTransaction(account, {
    type: 'deposit',
    amount,
    description: 'Depósito em conta',
  });
}

export function makeWithdrawal(account, amount) {
  account.balance -= amount;
  return addTransaction(account, {
    type: 'withdrawal',
    amount,
    description: 'Saque em conta',
  });
}

export function makeTransfer(fromAccount, toAccount, amount) {
  fromAccount.balance -= amount;
  toAccount.balance += amount;
  const outTx = addTransaction(fromAccount, {
    type: 'transfer-out',
    amount,
    description: `Transferência para conta ${toAccount.accountNumber}`,
    toAccountId: toAccount.id,
  });
  const inTx = addTransaction(toAccount, {
    type: 'transfer-in',
    amount,
    description: `Transferência recebida de conta ${fromAccount.accountNumber}`,
    fromAccountId: fromAccount.id,
  });
  return { outTx, inTx };
}

export function findAccountByOwnerAndId(ownerId, id) {
  return accounts.find((account) => account.ownerId === ownerId && account.id === String(id));
}

export function listAllAccounts() {
  return accounts;
}
