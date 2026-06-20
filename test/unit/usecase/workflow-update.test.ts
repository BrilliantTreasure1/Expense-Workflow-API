import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateWorkflow } from '../../../application/workflow/workflow-update-usecase'
import { Workflow } from '../../../entities/workflow'

describe('UpdateWorkflow usecase', () => {
  let mockRepo: { findById: ReturnType<typeof vi.fn>; updateWorkflow: ReturnType<typeof vi.fn> }
  let usecase: UpdateWorkflow

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      updateWorkflow: vi.fn(),
    }
    usecase = new UpdateWorkflow(mockRepo)
  })

  it('updates a workflow successfully', async () => {
    const existing = Workflow.create(1, 1, 'Original Title', 50000, 'original desc')
    mockRepo.findById.mockResolvedValue(existing)

    const updated = Workflow.create(1, 1, 'Updated Title', 100000, 'updated desc')
    mockRepo.updateWorkflow.mockResolvedValue(updated)

    const result = await usecase.update(1, 1, 'Updated Title', 100000, 'updated desc')

    expect(result.getTitle()).toBe('Updated Title')
    expect(result.getBudget()).toBe(100000)
    expect(mockRepo.findById).toHaveBeenCalledWith(1)
    expect(mockRepo.updateWorkflow).toHaveBeenCalledOnce()
  })

  it('preserves the original status on update', async () => {
    const existing = Workflow.create(1, 1, 'Original', 50000, 'desc', 'archive')
    mockRepo.findById.mockResolvedValue(existing)

    let captured: Workflow | undefined
    mockRepo.updateWorkflow.mockImplementation((w: Workflow) => {
      captured = w
      return Promise.resolve(w)
    })

    await usecase.update(1, 1, 'Updated Title', 100000, 'desc')

    expect(captured!.getStatus()).toBe('archive')
  })

  it('throws when workflow is not found', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(usecase.update(1, 999, 'Title', 1000, 'desc'))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.updateWorkflow).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    const existing = Workflow.create(1, 2, 'Other user workflow', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)

    await expect(usecase.update(1, 1, 'Title', 1000, 'desc'))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.updateWorkflow).not.toHaveBeenCalled()
  })

  it('throws for short title', async () => {
    const existing = Workflow.create(1, 1, 'Original', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)

    await expect(usecase.update(1, 1, 'abc', 1000, 'desc'))
      .rejects.toThrow('Title is too short')

    expect(mockRepo.updateWorkflow).not.toHaveBeenCalled()
  })

  it('throws for negative budget', async () => {
    const existing = Workflow.create(1, 1, 'Original', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)

    await expect(usecase.update(1, 1, 'Valid Title', -1, 'desc'))
      .rejects.toThrow('Invalid budget')

    expect(mockRepo.updateWorkflow).not.toHaveBeenCalled()
  })

  it('throws when repository update returns null', async () => {
    const existing = Workflow.create(1, 1, 'Original', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)
    mockRepo.updateWorkflow.mockResolvedValue(null)

    await expect(usecase.update(1, 1, 'Valid Title', 1000, 'desc'))
      .rejects.toThrow('Failed to update workflow')
  })
})
