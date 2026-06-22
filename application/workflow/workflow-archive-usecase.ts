import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IArchiveWorkflow } from "./interface/workflow-archive-usecase.interface";
import { NotFoundError, AppError } from "../../errors/app-error";

export class ArchiveWorkflow implements IArchiveWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async archive(userId: number, workflowId: number): Promise<Workflow> {

        const existing = await this.workflowRepo.findById(workflowId, userId);

        if (!existing) {
            throw new NotFoundError("Workflow not found");
        }

        const result = await this.workflowRepo.archiveWorkflow(workflowId, userId);

        if (!result) {
            throw new AppError(500, "Failed to archive workflow");
        }

        return result;
    }
}