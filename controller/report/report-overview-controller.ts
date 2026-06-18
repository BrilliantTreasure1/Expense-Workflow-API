import { Request, Response } from "express";
import { IReportOverview } from "../../application/report/interface/report-overview-usecase.interface";

export class ReportOverviewController {
    constructor(private reportUsecase: IReportOverview) {}

    getOverview = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.userId;
            const report = await this.reportUsecase.getOverview(userId);

            return res.status(200).json(report);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}
