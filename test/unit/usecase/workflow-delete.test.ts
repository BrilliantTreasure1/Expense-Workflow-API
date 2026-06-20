import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteWorkflow } from '../../../application/workflow/workflow-delete-usecase'
import { Workflow } from '../../../entities/workflow'

describe('DeleteWorkflow usecase', () => {
  let mockRepo: { findById: ReturnType<typeof vi.fn>; deleteWorkflow: ReturnType<typeof vi.fn> }
  let usecase: DeleteWorkflow

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      deleteWorkflow: vi.fn(),
    }
    usecase = new DeleteWorkflow(mockRepo)
  })

  it('deletes a workflow successfully', async () => {
    const existing = Workflow.create(1, 1, 'Workflow to delete', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)
    mockRepo.deleteWorkflow.mockResolvedValue(existing)

    const result = await usecase.delete(1, 1)

    expect(result.getTitle()).toBe('Workflow to delete')
    expect(mockRepo.findById).toHaveBeenCalledWith(1)
    expect(mockRepo.deleteWorkflow).toHaveBeenCalledWith(1, 1)
  })

  it('throws when workflow is not found', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(usecase.delete(1, 999))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.deleteWorkflow).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    const existing = Workflow.create(1, 2, 'Other user workflow', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)

    await expect(usecase.delete(1, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.deleteWorkflow).not.toHaveBeenCalled()
  })

  it('throws when repository delete returns null', async () => {
    const existing = Workflow.create(1, 1, 'Workflow', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)
    mockRepo.deleteWorkflow.mockResolvedValue(null)

    await expect(usecase.delete(1, 1))
      .rejects.toThrow('Failed to delete workflow')
  })
})
