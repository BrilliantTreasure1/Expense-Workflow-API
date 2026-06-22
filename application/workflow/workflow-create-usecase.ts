import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { ICreateWorkflow } from "./interface/workflow-create-usecase.interface";
import { AppError } from "../../errors/app-error";

export class CreateWorkflow implements ICreateWorkflow {

    constructor(private workflowRepo: IWorkflowRepository) {}

    async create(userId: number, title: string, budget: string, description: string): Promise<Workflow> {

        const budgetvalue = Number(budget)

        const workflow = Workflow.create(null, userId, title, budgetvalue, description)

        const result = await this.workflowRepo.createWorkflow(workflow)
        if (!result) {
            throw new AppError(500, "Failed to create workflow");
        }

        return result
    }
}