import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IGetAllWorkflow } from "./interface/workflow-getAll-usecase.interface";

export class GetAllWorkflow implements IGetAllWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async getAll(userId: number, status?: string): Promise<Workflow[]> {
        return this.workflowRepo.getAllByUserId(userId, status);
    }
}