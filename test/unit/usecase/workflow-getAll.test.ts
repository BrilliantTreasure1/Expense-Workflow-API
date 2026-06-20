import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetAllWorkflow } from '../../../application/workflow/workflow-getAll-usecase'
import { Workflow } from '../../../entities/workflow'

describe('GetAllWorkflow usecase', () => {
  let mockRepo: { getAllByUserId: ReturnType<typeof vi.fn> }
  let usecase: GetAllWorkflow

  beforeEach(() => {
    mockRepo = { getAllByUserId: vi.fn() }
    usecase = new GetAllWorkflow(mockRepo)
  })

  it('returns all workflows for a user', async () => {
    const workflows = [
      Workflow.create(1, 1, 'First Workflow', 100000, 'desc'),
      Workflow.create(2, 1, 'Second Workflow', 200000, 'desc'),
    ]
    mockRepo.getAllByUserId.mockResolvedValue(workflows)

    const result = await usecase.getAll(1)

    expect(result).toHaveLength(2)
    expect(mockRepo.getAllByUserId).toHaveBeenCalledWith(1, undefined)
  })

  it('filters by status when provided', async () => {
    mockRepo.getAllByUserId.mockResolvedValue([])

    await usecase.getAll(1, 'active')

    expect(mockRepo.getAllByUserId).toHaveBeenCalledWith(1, 'active')
  })

  it('returns empty array when user has no workflows', async () => {
    mockRepo.getAllByUserId.mockResolvedValue([])

    const result = await usecase.getAll(2)

    expect(result).toEqual([])
  })

  it('returns only workflows belonging to the given user (delegated to repo)', async () => {
    const userWorkflows = [
      Workflow.create(3, 2, 'User 2 Workflow', 50000, 'desc'),
    ]
    mockRepo.getAllByUserId.mockResolvedValue(userWorkflows)

    const result = await usecase.getAll(2)

    expect(result).toHaveLength(1)
    expect(result[0].userId).toBe(2)
  })
})
