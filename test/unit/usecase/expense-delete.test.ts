import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteExpense } from '../../../application/expense/expense-delete-usecase'
import { Workflow } from '../../../entities/workflow'
import { Expense } from '../../../entities/expense'

describe('DeleteExpense usecase', () => {
  let mockWorkflowRepo: { findById: ReturnType<typeof vi.fn> }
  let mockExpenseRepo: { findById: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> }
  let usecase: DeleteExpense

  function makeWorkflow() {
    return Workflow.create(1, 1, 'My Workflow', 100000, 'desc')
  }

  function makeExpense(id: number, workflowId: number) {
    return Expense.create(id, workflowId, 'Test Expense', 'desc', 5000, null, new Date('2026-06-01'))
  }

  beforeEach(() => {
    mockWorkflowRepo = { findById: vi.fn() }
    mockExpenseRepo = { findById: vi.fn(), delete: vi.fn() }
    usecase = new DeleteExpense(mockExpenseRepo, mockWorkflowRepo)
  })

  it('deletes an expense successfully', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    const expense = makeExpense(1, 1)
    mockExpenseRepo.findById.mockResolvedValue(expense)
    mockExpenseRepo.delete.mockResolvedValue(expense)

    const result = await usecase.delete(1, 1, 1)

    expect(result.getTitle()).toBe('Test Expense')
    expect(mockExpenseRepo.delete).toHaveBeenCalledWith(1, 1)
  })

  it('throws when workflow not found', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.delete(999, 1, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.findById).not.toHaveBeenCalled()
    expect(mockExpenseRepo.delete).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    const workflow = Workflow.create(1, 2, 'Other workflow', 50000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)

    await expect(usecase.delete(1, 1, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.findById).not.toHaveBeenCalled()
  })

  it('throws when expense not found', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    mockExpenseRepo.findById.mockResolvedValue(null)

    await expect(usecase.delete(1, 1, 999))
      .rejects.toThrow('Expense not found')

    expect(mockExpenseRepo.delete).not.toHaveBeenCalled()
  })

  it('throws when expense belongs to a different workflow', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    const otherExpense = makeExpense(1, 2)
    mockExpenseRepo.findById.mockResolvedValue(otherExpense)

    await expect(usecase.delete(1, 1, 1))
      .rejects.toThrow('Expense not found')

    expect(mockExpenseRepo.delete).not.toHaveBeenCalled()
  })

  it('throws when repository delete returns null', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(makeWorkflow())
    mockExpenseRepo.findById.mockResolvedValue(makeExpense(1, 1))
    mockExpenseRepo.delete.mockResolvedValue(null)

    await expect(usecase.delete(1, 1, 1))
      .rejects.toThrow('Failed to delete expense')
  })
})
