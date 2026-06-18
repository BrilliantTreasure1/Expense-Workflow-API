import { Request, Response } from "express";
import { IDeleteWorkflow } from "../../application/workflow/interface/workflow-delete-usecase.interface";

export class DeleteWorkflowController {
    constructor(private workflowUsecase: IDeleteWorkflow) {}

    delete = async (req: Request, res: Response) => {

        try {

            const userId = req.user!.userId;
            const workflowId = Number(req.params.id);

            if (!workflowId || isNaN(workflowId)) {
                return res.status(400).json({ error: "Invalid workflow id" });
            }

            const workflow = await this.workflowUsecase.delete(userId, workflowId);

            return res.status(200).json(workflow);

        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}