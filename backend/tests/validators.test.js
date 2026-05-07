import { validateCPF, validateEmail, validateAmount, validateAccountPayload } from '../src/validators.js';

describe('Validações', () => {
  it('deve validar CPF verdadeiro', () => {
    expect(validateCPF('11144477735')).toBe(true);
  });

  it('deve rejeitar CPF falso', () => {
    expect(validateCPF('12345678900')).toBe(false);
  });

  it('deve validar email correto', () => {
    expect(validateEmail('teste@example.com')).toBe(true);
  });

  it('deve rejeitar email inválido', () => {
    expect(validateEmail('teste@@example.com')).toBe(false);
  });

  it('deve validar valor mínimo e máximo', () => {
    expect(validateAmount(0.01)).toBe(true);
    expect(validateAmount(1000000)).toBe(true);
    expect(validateAmount(1000000.01)).toBe(false);
  });

  it('deve validar payload de conta', () => {
    expect(
      validateAccountPayload({
        holderName: 'Maria da Silva',
        cpf: '11144477735',
        accountType: 'corrente',
        branch: '001',
      }),
    ).toBe(true);
  });
});
