import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateExpense } from '../../../application/expense/expense-update-usecase'
import { Workflow } from '../../../entities/workflow'
import { Expense } from '../../../entities/expense'

describe('UpdateExpense usecase', () => {
  let mockWorkflowRepo: { findById: ReturnType<typeof vi.fn> }
  let mockExpenseRepo: { findById: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> }
  let usecase: UpdateExpense

  function makeWorkflow() {
    return Workflow.create(1, 1, 'My Workflow', 100000, 'desc')
  }

  function makeExpense(id: number, workflowId: number) {
    return Expense.create(id, workflowId, 'Original', 'desc', 5000, 'food', new Date('2026-06-01'))
  }

  beforeEach(() => {
    mockWorkflowRepo = { findById: vi.fn() }
    mockExpenseRepo = { findById: vi.fn(), update: vi.fn() }
    usecase = new UpdateExpense(mockExpenseRepo, mockWorkflowRepo)
  })

  it('updates an expense successfully', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    mockExpenseRepo.findById.mockResolvedValue(makeExpense(1, 1))

    const updated = Expense.create(1, 1, 'Updated Title', 'new desc', 10000, 'transport', new Date('2026-07-01'))
    mockExpenseRepo.update.mockResolvedValue(updated)

    const result = await usecase.update(1, 1, 1, 'Updated Title', 'new desc', 10000, 'transport', '2026-07-01')

    expect(result.getTitle()).toBe('Updated Title')
    expect(result.getAmount()).toBe(10000)
    expect(result.getCategory()).toBe('transport')
    expect(mockExpenseRepo.update).toHaveBeenCalledOnce()
  })

  it('throws when workflow not found', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.update(999, 1, 1, 'Title', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.findById).not.toHaveBeenCalled()
    expect(mockExpenseRepo.update).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.update(1, 1, 1, 'Title', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.findById).not.toHaveBeenCalled()
  })

  it('throws when expense not found', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    mockExpenseRepo.findById.mockResolvedValue(null)

    await expect(usecase.update(1, 1, 999, 'Title', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Expense not found')

    expect(mockExpenseRepo.update).not.toHaveBeenCalled()
  })

  it('throws when expense belongs to a different workflow', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    const otherExpense = makeExpense(1, 2)
    mockExpenseRepo.findById.mockResolvedValue(otherExpense)

    await expect(usecase.update(1, 1, 1, 'Title', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Expense not found')

    expect(mockExpenseRepo.update).not.toHaveBeenCalled()
  })

  it('throws for empty title', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    mockExpenseRepo.findById.mockResolvedValue(makeExpense(1, 1))

    await expect(usecase.update(1, 1, 1, '', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Title is required')

    expect(mockExpenseRepo.update).not.toHaveBeenCalled()
  })

  it('throws for zero amount', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    mockExpenseRepo.findById.mockResolvedValue(makeExpense(1, 1))

    await expect(usecase.update(1, 1, 1, 'Title', 'desc', 0, null, '2026-06-20'))
      .rejects.toThrow('Amount must be greater than zero')

    expect(mockExpenseRepo.update).not.toHaveBeenCalled()
  })

  it('throws when repository update returns null', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    mockExpenseRepo.findById.mockResolvedValue(makeExpense(1, 1))
    mockExpenseRepo.update.mockResolvedValue(null)

    await expect(usecase.update(1, 1, 1, 'Title', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Failed to update expense')
  })
})
