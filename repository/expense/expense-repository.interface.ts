import { Expense } from "../../entities/expense";

export interface CategorySummary {
    category: string | null;
    count: number;
    total: number;
}

export interface IExpenseRepository {
    create(expense: Expense): Promise<Expense | null>;
    getAllByWorkflowId(workflowId: number, from?: string, to?: string): Promise<Expense[]>;
    findById(id: number): Promise<Expense | null>;
    update(expense: Expense): Promise<Expense | null>;
    delete(id: number, workflowId: number): Promise<Expense | null>;
    getTotalExpensesByWorkflowId(workflowId: number): Promise<{ total: number; count: number }>;
    getCategorySummaryByWorkflowId(workflowId: number): Promise<CategorySummary[]>;
    getTotalExpensesByUserId(userId: number): Promise<number>;
    getCategorySummaryByUserId(userId: number): Promise<CategorySummary[]>;
}
