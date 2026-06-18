import { Expense } from "../../../entities/expense";
import { Workflow } from "../../../entities/workflow";

export interface IGetAllExpenses {
    getAll(workflowId: number, userId: number, from?: string, to?: string): Promise<{ workflow: Workflow; expenses: Expense[] }>;
}
