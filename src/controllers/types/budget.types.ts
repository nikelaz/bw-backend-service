import { Budget } from '../../models/budget';

export interface IBudgetBody {
  budget: {
    month: string,
  }
}

export interface IBudgetCreateBody {
  budget: {
    month: string,
  },
  copyFrom: {
    id: number,
  },
}

export interface IBudgetsReply {
  budgets: Partial<Budget>[];
}

export interface IBudgetReply {
  budget: Partial<Budget>;
}
