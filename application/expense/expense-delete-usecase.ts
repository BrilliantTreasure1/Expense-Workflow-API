import { Expense } from "../../entities/expense";
import { IExpenseRepository } from "../../repository/expense/expense-repository.interface";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IDeleteExpense } from "./interface/expense-delete-usecase.interface";

export class DeleteExpense implements IDeleteExpense {
    constructor(
        private expenseRepo: IExpenseRepository,
        private workflowRepo: IWorkflowRepository
    ) {}

    async delete(workflowId: number, userId: number, expenseId: number): Promise<Expense> {

        const workflow = await this.workflowRepo.findById(workflowId, userId);

        if (!workflow) {
            throw new Error("Workflow not found");
        }

        const existing = await this.expenseRepo.findById(expenseId);

        if (!existing || existing.workflowId !== workflowId) {
            throw new Error("Expense not found");
        }

        const result = await this.expenseRepo.delete(expenseId, workflowId);

        if (!result) {
            throw new Error("Failed to delete expense");
        }

        return result;
    }
}
