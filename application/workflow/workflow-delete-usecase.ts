import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IDeleteWorkflow } from "./interface/workflow-delete-usecase.interface";
import { NotFoundError, AppError } from "../../errors/app-error";

export class DeleteWorkflow implements IDeleteWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async delete(userId: number, workflowId: number): Promise<Workflow> {

        const existing = await this.workflowRepo.findById(workflowId, userId);

        if (!existing) {
            throw new NotFoundError("Workflow not found");
        }

        const result = await this.workflowRepo.deleteWorkflow(workflowId, userId);

        if (!result) {
            throw new AppError(500, "Failed to delete workflow");
        }

        return result;
    }
}