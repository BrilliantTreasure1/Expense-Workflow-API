import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IArchiveWorkflow } from "./interface/workflow-archive-usecase.interface";

export class ArchiveWorkflow implements IArchiveWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async archive(userId: number, workflowId: number): Promise<Workflow> {

        const existing = await this.workflowRepo.findById(workflowId);

        if (!existing || existing.userId !== userId) {
            throw new Error("Workflow not found");
        }

        const result = await this.workflowRepo.archiveWorkflow(workflowId, userId);

        if (!result) {
            throw new Error("Failed to archive workflow");
        }

        return result;
    }
}