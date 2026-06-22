import { Expense } from "../../entities/expense";
import { IExpenseRepository } from "../../repository/expense/expense-repository.interface";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IUpdateExpense } from "./interface/expense-update-usecase.interface";

export class UpdateExpense implements IUpdateExpense {
    constructor(
        private expenseRepo: IExpenseRepository,
        private workflowRepo: IWorkflowRepository
    ) {}

    async update(workflowId: number, userId: number, expenseId: number, title: string, description: string, amount: number, category: string | null, date: string): Promise<Expense> {

        const workflow = await this.workflowRepo.findById(workflowId, userId);

        if (!workflow) {
            throw new Error("Workflow not found");
        }

        const existing = await this.expenseRepo.findById(expenseId);

        if (!existing || existing.workflowId !== workflowId) {
            throw new Error("Expense not found");
        }

        const updated = Expense.create(expenseId, workflowId, title, description, amount, category, new Date(date));

        const result = await this.expenseRepo.update(updated);

        if (!result) {
            throw new Error("Failed to update expense");
        }

        return result;
    }
}
