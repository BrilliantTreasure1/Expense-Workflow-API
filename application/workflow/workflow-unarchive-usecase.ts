import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IUnarchiveWorkflow } from "./interface/workflow-unarchive-usecase.interface";
import { NotFoundError, AppError } from "../../errors/app-error";

export class UnarchiveWorkflow implements IUnarchiveWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async unarchive(userId: number, workflowId: number): Promise<Workflow> {

        const existing = await this.workflowRepo.findById(workflowId, userId);

        if (!existing) {
            throw new NotFoundError("Workflow not found");
        }

        const result = await this.workflowRepo.unarchiveWorkflow(workflowId, userId);

        if (!result) {
            throw new AppError(500, "Failed to unarchive workflow");
        }

        return result;
    }
}
