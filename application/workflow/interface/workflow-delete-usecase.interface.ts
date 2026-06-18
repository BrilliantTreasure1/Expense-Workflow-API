import { Workflow } from "../../../entities/workflow";

export interface IDeleteWorkflow {
    delete(userId: number, workflowId:number): Promise<Workflow>;
}