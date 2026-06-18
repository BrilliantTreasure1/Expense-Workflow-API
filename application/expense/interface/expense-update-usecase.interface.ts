import { Expense } from "../../../entities/expense";

export interface IUpdateExpense {
    update(workflowId: number, userId: number, expenseId: number, title: string, description: string, amount: number, category: string | null, date: string): Promise<Expense>;
}
