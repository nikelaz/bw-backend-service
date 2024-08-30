import { Transaction } from '../../models/transaction';

export interface IBudgetIdParams {
  budgetId: number;
  
}

export interface IPaginationQuery {
  limit?: number;
  offset?: number;
  filter?: string;
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
  count: number,
}

export interface ITransactionReply {
  transaction: Partial<Transaction>;
}

