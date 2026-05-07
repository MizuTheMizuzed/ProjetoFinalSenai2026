import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  deposit,
  withdraw,
  transfer,
  getBalance,
  getStatement,
} from '../controllers/accountController.js';

const router = Router();
router.use(authMiddleware);
router.get('/', listAccounts);
router.post('/', createAccount);
router.patch('/:id', updateAccount);
router.delete('/:id', deleteAccount);
router.post('/:id/deposit', deposit);
router.post('/:id/withdraw', withdraw);
router.post('/transfer', transfer);
router.get('/:id/balance', getBalance);
router.get('/:id/statement', getStatement);

export default router;
