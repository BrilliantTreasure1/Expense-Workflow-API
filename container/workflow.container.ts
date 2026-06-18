import { CreateWorkflow } from "../application/workflow/workflow-create-usecase"
import { GetAllWorkflow } from "../application/workflow/workflow-getAll-usecase"
import { UpdateWorkflow } from "../application/workflow/workflow-update-usecase"
import { DeleteWorkflow } from "../application/workflow/workflow-delete-usecase"
import { ArchiveWorkflow } from "../application/workflow/workflow-archive-usecase"
import { UnarchiveWorkflow } from "../application/workflow/workflow-unarchive-usecase"
import { CreateWorkflowController } from "../controller/workflow/workflow-create-controller"
import { GetAllWorkflowController } from "../controller/workflow/workflow-getAll-controller"
import { UpdateWorkflowController } from "../controller/workflow/workflow-update-controller"
import { DeleteWorkflowController } from "../controller/workflow/workflow-delete-controller"
import { ArchiveWorkflowController } from "../controller/workflow/workflow-archive-controller"
import { UnarchiveWorkflowController } from "../controller/workflow/workflow-unarchive-controller"
import {WorkflowRepositoryPostgresql} from "../repository/workflow/workflow-repository.postgre"


//repository
const workflowRepo = new WorkflowRepositoryPostgresql()

//create workflow
const createWorkflowUsecase = new CreateWorkflow(workflowRepo)
export const createWorkflow = new CreateWorkflowController(createWorkflowUsecase)

//get all workflows
const getAllWorkflowUsecase = new GetAllWorkflow(workflowRepo)
export const getAllWorkflow = new GetAllWorkflowController(getAllWorkflowUsecase)

//update workflow
const updateWorkflowUsecase = new UpdateWorkflow(workflowRepo)
export const updateWorkflow = new UpdateWorkflowController(updateWorkflowUsecase)

//delete workflow
const deleteWorkflowUsecase = new DeleteWorkflow(workflowRepo)
export const deleteWorkflow = new DeleteWorkflowController(deleteWorkflowUsecase)

//archive workflow
const archiveWorkflowUsecase = new ArchiveWorkflow(workflowRepo)
export const archiveWorkflow = new ArchiveWorkflowController(archiveWorkflowUsecase)

//unarchive workflow
const unarchiveWorkflowUsecase = new UnarchiveWorkflow(workflowRepo)
export const unarchiveWorkflow = new UnarchiveWorkflowController(unarchiveWorkflowUsecase)