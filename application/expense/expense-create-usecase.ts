import { Expense } from "../../entities/expense";
import { IExpenseRepository } from "../../repository/expense/expense-repository.interface";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { ICreateExpense } from "./interface/expense-create-usecase.interface";

export class CreateExpense implements ICreateExpense {
    constructor(
        private expenseRepo: IExpenseRepository,
        private workflowRepo: IWorkflowRepository
    ) {}

    async create(workflowId: number, userId: number, title: string, description: string, amount: number, category: string | null, date: string): Promise<Expense> {

        const workflow = await this.workflowRepo.findById(workflowId, userId);

        if (!workflow) {
            throw new Error("Workflow not found");
        }

        const expense = Expense.create(null, workflowId, title, description, amount, category, new Date(date));

        const result = await this.expenseRepo.create(expense);

        if (!result) {
            throw new Error("Failed to create expense");
        }

        return result;
    }
}
