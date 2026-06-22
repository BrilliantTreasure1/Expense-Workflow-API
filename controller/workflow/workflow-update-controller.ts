import { Request, Response } from "express";
import { IUpdateWorkflow } from "../../application/workflow/interface/workflow-update-usecase-interface";

export class UpdateWorkflowController {
    constructor(private workflowUsecase: IUpdateWorkflow) {}

    update = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const workflowId = Number(req.params.id);

        if (!workflowId || isNaN(workflowId)) {
            return res.status(400).json({ error: "Invalid workflow id" });
        }

        const { title, budget, description } = req.body;

        const workflow = await this.workflowUsecase.update(userId, workflowId, title, Number(budget), description);

        return res.status(200).json(workflow);
    }
}