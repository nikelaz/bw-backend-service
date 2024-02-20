import { Transaction } from '../../models/transaction';

export interface IBudgetIdParams {
  budgetId: number;
}

export interface IBudgetIdSingleParams {
  budgetId: number;
  id: number;
}

export interface ITransactionBody {
  transaction: Partial<Transaction>;
}

export interface ITransactionsReply {
  transactions: Partial<Transaction>[];
}

export interface ITransactionReply {
  transaction: Partial<Transaction>;
}

