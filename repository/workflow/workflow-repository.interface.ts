import { Workflow } from "../../entities/workflow";

export interface WorkflowStats {
    totalWorkflows: number;
    totalBudget: number;
}

export interface IWorkflowRepository {
    createWorkflow(workflow: Workflow): Promise<Workflow | null>;
    getAllByUserId(userId: number, status?: string): Promise<Workflow[]>;
    findById(id: number, userId: number): Promise<Workflow | null>;
    updateWorkflow(workflow: Workflow): Promise<Workflow | null>;
    deleteWorkflow(id: number, userId: number): Promise<Workflow | null>;
    archiveWorkflow(id: number, userId: number): Promise<Workflow | null>;
    unarchiveWorkflow(id: number, userId: number): Promise<Workflow | null>;
    getWorkflowStats(userId: number): Promise<WorkflowStats>;
}