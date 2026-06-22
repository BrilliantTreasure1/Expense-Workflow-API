import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IExpenseRepository } from "../../repository/expense/expense-repository.interface";
import { IReportOverview, OverviewReport } from "./interface/report-overview-usecase.interface";

export class ReportOverview implements IReportOverview {
    constructor(
        private workflowRepo: IWorkflowRepository,
        private expenseRepo: IExpenseRepository
    ) {}

    async getOverview(userId: number): Promise<OverviewReport> {
        const [stats, totalExpenses, categoryBreakdown] = await Promise.all([
            this.workflowRepo.getWorkflowStats(userId),
            this.expenseRepo.getTotalExpensesByUserId(userId),
            this.expenseRepo.getCategorySummaryByUserId(userId),
        ]);

        const { totalWorkflows, totalBudget } = stats;
        const remainingBudget = totalBudget - totalExpenses;
        const budgetUsagePercent = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;

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
