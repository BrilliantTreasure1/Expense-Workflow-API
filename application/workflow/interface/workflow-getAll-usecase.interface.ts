import { Workflow } from "../../../entities/workflow";

export interface IGetAllWorkflow {
    getAll(userId: number, status?: string): Promise<Workflow[]>
}