import { Workflow } from "../../../entities/workflow";

export interface IUnarchiveWorkflow {
    unarchive(userId: number, workflowId: number): Promise<Workflow>;
}
