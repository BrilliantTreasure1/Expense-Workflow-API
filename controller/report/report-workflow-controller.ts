import { Request, Response } from "express";
import { IReportWorkflow } from "../../application/report/interface/report-workflow-usecase.interface";

export class ReportWorkflowController {
    constructor(private reportUsecase: IReportWorkflow) {}

    getReport = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const workflowId = Number(req.params.workflowId);

        if (!workflowId || isNaN(workflowId)) {
            return res.status(400).json({ error: "Invalid workflow id" });
        }

        const report = await this.reportUsecase.getReport(workflowId, userId);

        return res.status(200).json(report);
    }
}
