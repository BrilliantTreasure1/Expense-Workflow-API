import { CategorySummary } from "../../../repository/expense/expense-repository.interface";
import { Workflow } from "../../../entities/workflow";

export interface WorkflowReport {
    workflow: Workflow;
    totalExpenses: number;
    expenseCount: number;
    remainingBudget: number;
    budgetUsagePercent: number;
    categoryBreakdown: CategorySummary[];
}

export interface IReportWorkflow {
    getReport(workflowId: number, userId: number): Promise<WorkflowReport>;
}
