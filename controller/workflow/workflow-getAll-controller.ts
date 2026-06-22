import { Request, Response } from "express";
import { IGetAllWorkflow } from "../../application/workflow/interface/workflow-getAll-usecase.interface";

export class GetAllWorkflowController {
    constructor(private workflowUsecase: IGetAllWorkflow) {}

    getAll = async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const status = req.query.status as string | undefined;

        const workflows = await this.workflowUsecase.getAll(userId, status);

        return res.status(200).json(workflows);
    }
}