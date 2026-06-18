import { Workflow } from "../../../entities/workflow";

export interface IArchiveWorkflow {
    archive(userId: number, workflowId: number): Promise<Workflow>;
}
