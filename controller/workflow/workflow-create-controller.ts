import { Request, Response } from "express";
import { ICreateWorkflow } from "../../application/workflow/interface/workflow-create-usecase.interface";


export class CreateWorkflowController {
    constructor(private workflowUsecase: ICreateWorkflow) {}

    create = async (req: Request, res: Response) => {

        try {

            const userId = req.user!.userId;

            const { title, budget, description } = req.body;

            const workflow = await this.workflowUsecase.create(userId, title, budget, description);

            return res.status(201).json(workflow);

        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }
}