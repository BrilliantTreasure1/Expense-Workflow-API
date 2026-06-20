import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ArchiveWorkflow } from '../../../application/workflow/workflow-archive-usecase'
import { UnarchiveWorkflow } from '../../../application/workflow/workflow-unarchive-usecase'
import { Workflow } from '../../../entities/workflow'

function makeMockRepo() {
  return {
    findById: vi.fn(),
    archiveWorkflow: vi.fn(),
    unarchiveWorkflow: vi.fn(),
  }
}

describe('ArchiveWorkflow usecase', () => {
  let mockRepo: ReturnType<typeof makeMockRepo>
  let usecase: ArchiveWorkflow

  beforeEach(() => {
    mockRepo = makeMockRepo()
    usecase = new ArchiveWorkflow(mockRepo)
  })

  it('archives a workflow successfully', async () => {
    const existing = Workflow.create(1, 1, 'Workflow', 50000, 'desc', 'active')
    mockRepo.findById.mockResolvedValue(existing)

    const archived = Workflow.create(1, 1, 'Workflow', 50000, 'desc', 'archive')
    mockRepo.archiveWorkflow.mockResolvedValue(archived)

    const result = await usecase.archive(1, 1)

    expect(result.getStatus()).toBe('archive')
    expect(mockRepo.findById).toHaveBeenCalledWith(1)
    expect(mockRepo.archiveWorkflow).toHaveBeenCalledWith(1, 1)
  })

  it('throws when workflow not found', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(usecase.archive(1, 999))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.archiveWorkflow).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    const existing = Workflow.create(1, 2, 'Other workflow', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)

    await expect(usecase.archive(1, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.archiveWorkflow).not.toHaveBeenCalled()
  })

  it('throws when repository returns null', async () => {
    const existing = Workflow.create(1, 1, 'Workflow', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)
    mockRepo.archiveWorkflow.mockResolvedValue(null)

    await expect(usecase.archive(1, 1))
      .rejects.toThrow('Failed to archive workflow')
  })
})

describe('UnarchiveWorkflow usecase', () => {
  let mockRepo: ReturnType<typeof makeMockRepo>
  let usecase: UnarchiveWorkflow

  beforeEach(() => {
    mockRepo = makeMockRepo()
    usecase = new UnarchiveWorkflow(mockRepo)
  })

  it('unarchives a workflow successfully', async () => {
    const existing = Workflow.create(1, 1, 'Workflow', 50000, 'desc', 'archive')
    mockRepo.findById.mockResolvedValue(existing)

    const unarchived = Workflow.create(1, 1, 'Workflow', 50000, 'desc', 'active')
    mockRepo.unarchiveWorkflow.mockResolvedValue(unarchived)

    const result = await usecase.unarchive(1, 1)

    expect(result.getStatus()).toBe('active')
    expect(mockRepo.findById).toHaveBeenCalledWith(1)
    expect(mockRepo.unarchiveWorkflow).toHaveBeenCalledWith(1, 1)
  })

  it('throws when workflow not found', async () => {
    mockRepo.findById.mockResolvedValue(null)

    await expect(usecase.unarchive(1, 999))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.unarchiveWorkflow).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    const existing = Workflow.create(1, 2, 'Other workflow', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)

    await expect(usecase.unarchive(1, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockRepo.unarchiveWorkflow).not.toHaveBeenCalled()
  })

  it('throws when repository returns null', async () => {
    const existing = Workflow.create(1, 1, 'Workflow', 50000, 'desc')
    mockRepo.findById.mockResolvedValue(existing)
    mockRepo.unarchiveWorkflow.mockResolvedValue(null)

    await expect(usecase.unarchive(1, 1))
      .rejects.toThrow('Failed to unarchive workflow')
  })
})
