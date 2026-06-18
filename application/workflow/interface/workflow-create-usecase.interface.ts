import { Workflow } from "../../../entities/workflow";

export interface ICreateWorkflow {
    create(userId: number, title: string, budget: string, description: string): Promise<Workflow>;
}