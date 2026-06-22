import { Request, Response } from "express";
import { IArchiveWorkflow } from "../../application/workflow/interface/workflow-archive-usecase.interface";

export class ArchiveWorkflowController {
    constructor(private workflowUsecase: IArchiveWorkflow) {}

    archive = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const workflowId = Number(req.params.id);

        if (!workflowId || isNaN(workflowId)) {
            return res.status(400).json({ error: "Invalid workflow id" });
        }

        const workflow = await this.workflowUsecase.archive(userId, workflowId);

        return res.status(200).json(workflow);
    }
}