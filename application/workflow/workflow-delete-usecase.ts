import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IDeleteWorkflow } from "./interface/workflow-delete-usecase.interface";

export class DeleteWorkflow implements IDeleteWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async delete(userId: number, workflowId: number): Promise<Workflow> {

        const existing = await this.workflowRepo.findById(workflowId);

        if (!existing || existing.userId !== userId) {
            throw new Error("Workflow not found");
        }

        const result = await this.workflowRepo.deleteWorkflow(workflowId, userId);

        if (!result) {
            throw new Error("Failed to delete workflow");
        }

        return result;
    }
}