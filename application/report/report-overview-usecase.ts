import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IExpenseRepository } from "../../repository/expense/expense-repository.interface";
import { IReportOverview, OverviewReport } from "./interface/report-overview-usecase.interface";

export class ReportOverview implements IReportOverview {
    constructor(
        private workflowRepo: IWorkflowRepository,
        private expenseRepo: IExpenseRepository
    ) {}

    async getOverview(userId: number): Promise<OverviewReport> {
        const workflows = await this.workflowRepo.getAllByUserId(userId);

        const totalWorkflows = workflows.length;
        const totalBudget = workflows.reduce((sum, w) => sum + w.getBudget(), 0);
        const totalExpenses = await this.expenseRepo.getTotalExpensesByUserId(userId);
        const remainingBudget = totalBudget - totalExpenses;
        const budgetUsagePercent = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
        const categoryBreakdown = await this.expenseRepo.getCategorySummaryByUserId(userId);

        return {
            totalWorkflows,
            totalBudget,
            totalExpenses,
            remainingBudget,
            budgetUsagePercent,
            categoryBreakdown,
        };
    }
}
