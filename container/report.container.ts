import { ExpenseRepositoryPostgresql } from "../repository/expense/expense-repository.postgre";
import { WorkflowRepositoryPostgresql } from "../repository/workflow/workflow-repository.postgre";
import { ReportOverview } from "../application/report/report-overview-usecase";
import { ReportWorkflow } from "../application/report/report-workflow-usecase";
import { ReportOverviewController } from "../controller/report/report-overview-controller";
import { ReportWorkflowController } from "../controller/report/report-workflow-controller";

const expenseRepo = new ExpenseRepositoryPostgresql();
const workflowRepo = new WorkflowRepositoryPostgresql();

const reportOverviewUsecase = new ReportOverview(workflowRepo, expenseRepo);
const reportWorkflowUsecase = new ReportWorkflow(workflowRepo, expenseRepo);

export const reportOverview = new ReportOverviewController(reportOverviewUsecase);
export const reportWorkflow = new ReportWorkflowController(reportWorkflowUsecase);
