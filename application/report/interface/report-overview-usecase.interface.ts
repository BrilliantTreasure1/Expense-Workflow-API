import { CategorySummary } from "../../../repository/expense/expense-repository.interface";

export interface OverviewReport {
    totalWorkflows: number;
    totalBudget: number;
    totalExpenses: number;
    remainingBudget: number;
    budgetUsagePercent: number;
    categoryBreakdown: CategorySummary[];
}

export interface IReportOverview {
    getOverview(userId: number): Promise<OverviewReport>;
}
