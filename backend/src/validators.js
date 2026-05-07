const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const safeStringRegex = /^[A-Za-zÀ-ÿ0-9 .,'-]{1,100}$/;
const accountTypeRegex = /^[A-Za-zÀ-ÿ0-9 ]{1,50}$/;
const branchRegex = /^[A-Za-zÀ-ÿ0-9\- ]{1,50}$/;
const numericStringRegex = /^[0-9]+$/;

export function validateEmail(email) {
  return typeof email === 'string' && emailRegex.test(email.trim().toLowerCase());
}

export function validateCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcCheckDigit = (base) => {
    let sum = 0;
    for (let i = 0; i < base.length; i += 1) {
      sum += Number(base[i]) * (base.length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calcCheckDigit(digits.slice(0, 9));
  const secondDigit = calcCheckDigit(digits.slice(0, 10));
  return firstDigit === Number(digits[9]) && secondDigit === Number(digits[10]);
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

export function validateAmount(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return false;
  return value >= 0.01 && value <= 1000000;
}

export function validateUserPayload({ name, email, cpf, password }) {
  if (!name || !email || !cpf || !password) return false;
  return (
    safeStringRegex.test(name.trim()) &&
    validateEmail(email) &&
    validateCPF(cpf) &&
    validatePassword(password)
  );
}

export function validateAccountPayload({ holderName, cpf, accountType, branch }) {
  if (!holderName || !cpf || !accountType || !branch) return false;
  return (
    safeStringRegex.test(holderName.trim()) &&
    validateCPF(cpf) &&
    accountTypeRegex.test(accountType.trim()) &&
    branchRegex.test(branch.trim())
  );
}

export function validateUpdateAccountPayload(payload) {
  const fields = ['holderName', 'accountType', 'branch'];
  return Object.keys(payload).every((key) => {
    if (!fields.includes(key)) return false;
    if (key === 'holderName') return safeStringRegex.test(String(payload[key]).trim());
    if (key === 'accountType') return accountTypeRegex.test(String(payload[key]).trim());
    if (key === 'branch') return branchRegex.test(String(payload[key]).trim());
    return false;
  });
}

export function validateTextField(value) {
  return typeof value === 'string' && safeStringRegex.test(value.trim());
}

export function validateAccountNumber(accountNumber) {
  return typeof accountNumber === 'string' && numericStringRegex.test(accountNumber) && accountNumber.length <= 20;
}
