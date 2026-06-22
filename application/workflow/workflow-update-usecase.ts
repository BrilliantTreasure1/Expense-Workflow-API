import { Workflow } from "../../entities/workflow";
import { IWorkflowRepository } from "../../repository/workflow/workflow-repository.interface";
import { IUpdateWorkflow } from "./interface/workflow-update-usecase-interface";

export class UpdateWorkflow implements IUpdateWorkflow {
    constructor(private workflowRepo: IWorkflowRepository) {}

    async update(userId: number, workflowId: number, title: string, budget: number, description: string): Promise<Workflow> {

        const existing = await this.workflowRepo.findById(workflowId, userId);

        if (!existing) {
            throw new Error("Workflow not found");
        }

        if (title.length < 5) {
            throw new Error("Title is too short");
        }

        if (budget < 0) {
            throw new Error("Invalid budget");
        }

        const updated = Workflow.create(workflowId, userId, title, budget, description, existing.getStatus());

        const result = await this.workflowRepo.updateWorkflow(updated);

        if (!result) {
            throw new Error("Failed to update workflow");
        }

        return result;
    }
}