import { Workflow } from "../../../entities/workflow";

export interface IUpdateWorkflow {
    update(userId: number , workflowId:number , title:string , budget:number , description:string ): Promise<Workflow>
}