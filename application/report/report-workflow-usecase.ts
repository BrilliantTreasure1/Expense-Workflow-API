import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IExpenseRepository } from "../../repository/expense/expense-repository.interface";
import { IReportWorkflow, WorkflowReport } from "./interface/report-workflow-usecase.interface";

export class ReportWorkflow implements IReportWorkflow {
    constructor(
        private workflowRepo: IWorkflowRepository,
        private expenseRepo: IExpenseRepository
    ) {}

    async getReport(workflowId: number, userId: number): Promise<WorkflowReport> {
        const workflow = await this.workflowRepo.findById(workflowId, userId);

        if (!workflow) {
            throw new Error("Workflow not found");
        }

        const { total, count } = await this.expenseRepo.getTotalExpensesByWorkflowId(workflowId);
        const remainingBudget = workflow.getBudget() - total;
        const budgetUsagePercent = workflow.getBudget() > 0 ? Math.round((total / workflow.getBudget()) * 100) : 0;
        const categoryBreakdown = await this.expenseRepo.getCategorySummaryByWorkflowId(workflowId);

        return {
            workflow,
            totalExpenses: total,
            expenseCount: count,
            remainingBudget,
            budgetUsagePercent,
            categoryBreakdown,
        };
    }
}
