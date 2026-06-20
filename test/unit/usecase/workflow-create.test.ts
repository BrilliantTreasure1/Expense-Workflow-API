import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateWorkflow } from '../../../application/workflow/workflow-create-usecase'
import { Workflow } from '../../../entities/workflow'

describe('CreateWorkflow usecase', () => {
  let mockRepo: { createWorkflow: ReturnType<typeof vi.fn> }
  let usecase: CreateWorkflow

  beforeEach(() => {
    mockRepo = { createWorkflow: vi.fn() }
    usecase = new CreateWorkflow(mockRepo)
  })

  it('creates a workflow successfully', async () => {
    const workflow = Workflow.create(1, 1, 'Test Workflow', 100000, 'description')
    mockRepo.createWorkflow.mockResolvedValue(workflow)

    const result = await usecase.create(1, 'Test Workflow', '100000', 'description')

    expect(result.getTitle()).toBe('Test Workflow')
    expect(result.getBudget()).toBe(100000)
    expect(mockRepo.createWorkflow).toHaveBeenCalledOnce()
  })

  it('converts string budget to number', async () => {
    const workflow = Workflow.create(1, 1, 'Test Workflow', 50000, 'desc')
    mockRepo.createWorkflow.mockResolvedValue(workflow)

    const result = await usecase.create(1, 'Test Workflow', '50000', 'desc')

    expect(result.getBudget()).toBe(50000)
  })

  it('throws when repository returns null', async () => {
    mockRepo.createWorkflow.mockResolvedValue(null)

    await expect(usecase.create(1, 'Test Workflow', '100000', 'desc'))
      .rejects.toThrow('Failed to create workflow')
  })

  it('throws when entity validation fails (short title)', async () => {
    await expect(usecase.create(1, 'abc', '100000', 'desc'))
      .rejects.toThrow('Title is too short')
  })

  it('passes userId and status to the entity', async () => {
    let captured: Workflow | undefined
    mockRepo.createWorkflow.mockImplementation((w: Workflow) => {
      captured = w
      return Promise.resolve(w)
    })

    await usecase.create(5, 'Test Workflow', '200000', 'my description')

    expect(captured).toBeDefined()
    expect(captured!.userId).toBe(5)
    expect(captured!.getStatus()).toBe('active')
  })
})
