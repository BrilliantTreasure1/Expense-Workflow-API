import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IUnarchiveWorkflow } from "./interface/workflow-unarchive-usecase.interface";

export class UnarchiveWorkflow implements IUnarchiveWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async unarchive(userId: number, workflowId: number): Promise<Workflow> {

        const existing = await this.workflowRepo.findById(workflowId, userId);

        if (!existing) {
            throw new Error("Workflow not found");
        }

        const result = await this.workflowRepo.unarchiveWorkflow(workflowId, userId);

        if (!result) {
            throw new Error("Failed to unarchive workflow");
        }

        return result;
    }
}
