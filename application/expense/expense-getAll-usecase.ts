import { Expense } from "../../entities/expense";
import { Workflow } from "../../entities/workflow";
import { IExpenseRepository } from "../../repository/expense/expense-repository.interface";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IGetAllExpenses } from "./interface/expense-getAll-usecase.interface";

export class GetAllExpenses implements IGetAllExpenses {
    constructor(
        private expenseRepo: IExpenseRepository,
        private workflowRepo: IWorkflowRepository
    ) {}

    async getAll(workflowId: number, userId: number, from?: string, to?: string): Promise<{ workflow: Workflow; expenses: Expense[] }> {

        const workflow = await this.workflowRepo.findById(workflowId, userId);

        if (!workflow) {
            throw new Error("Workflow not found");
        }

        const expenses = await this.expenseRepo.getAllByWorkflowId(workflowId, from, to);

        return { workflow, expenses };
    }
}
