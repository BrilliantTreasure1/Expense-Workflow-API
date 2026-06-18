import { Expense } from "../../../entities/expense";

export interface IDeleteExpense {
    delete(workflowId: number, userId: number, expenseId: number): Promise<Expense>;
}
