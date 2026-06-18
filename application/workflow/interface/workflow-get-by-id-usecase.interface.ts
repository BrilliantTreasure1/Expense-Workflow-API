import { Workflow } from "../../../entities/workflow";

export interface IGetByIdWorkflow {
    getById(userId: number, workflowId: number): Promise<Workflow>
}