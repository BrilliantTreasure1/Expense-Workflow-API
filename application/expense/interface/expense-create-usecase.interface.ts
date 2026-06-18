import { Expense } from "../../../entities/expense";

export interface ICreateExpense {
    create(workflowId: number, userId: number, title: string, description: string, amount: number, category: string | null, date: string): Promise<Expense>;
}
