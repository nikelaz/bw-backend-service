import { Budget } from '../../models/budget';

export interface IBudgetBody {
  budget: {
    month: string,
  }
}

export interface IBudgetsReply {
  budgets: Partial<Budget>[];
}

export interface IBudgetReply {
  budget: Partial<Budget>;
}
