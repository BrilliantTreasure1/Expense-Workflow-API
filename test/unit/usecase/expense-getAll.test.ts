import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetAllExpenses } from '../../../application/expense/expense-getAll-usecase'
import { Workflow } from '../../../entities/workflow'
import { Expense } from '../../../entities/expense'

describe('GetAllExpenses usecase', () => {
  let mockWorkflowRepo: { findById: ReturnType<typeof vi.fn> }
  let mockExpenseRepo: { getAllByWorkflowId: ReturnType<typeof vi.fn> }
  let usecase: GetAllExpenses

  beforeEach(() => {
    mockWorkflowRepo = { findById: vi.fn() }
    mockExpenseRepo = { getAllByWorkflowId: vi.fn() }
    usecase = new GetAllExpenses(mockExpenseRepo, mockWorkflowRepo)
  })

  it('returns workflow and expenses', async () => {
    const workflow = Workflow.create(1, 1, 'My Workflow', 100000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)

    const expenses = [
      Expense.create(1, 1, 'Expense 1', 'desc', 10000, 'food', new Date('2026-06-01')),
      Expense.create(2, 1, 'Expense 2', 'desc', 20000, 'transport', new Date('2026-06-15')),
    ]
    mockExpenseRepo.getAllByWorkflowId.mockResolvedValue(expenses)

    const result = await usecase.getAll(1, 1)

    expect(result.workflow.getTitle()).toBe('My Workflow')
    expect(result.expenses).toHaveLength(2)
    expect(mockExpenseRepo.getAllByWorkflowId).toHaveBeenCalledWith(1, undefined, undefined)
  })

  it('throws when workflow not found', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.getAll(999, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.getAllByWorkflowId).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.getAll(1, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.getAllByWorkflowId).not.toHaveBeenCalled()
  })

  it('filters by date range when provided', async () => {
    const workflow = Workflow.create(1, 1, 'Workflow', 50000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)
    mockExpenseRepo.getAllByWorkflowId.mockResolvedValue([])

    await usecase.getAll(1, 1, '2026-01-01', '2026-12-31')

    expect(mockExpenseRepo.getAllByWorkflowId).toHaveBeenCalledWith(1, '2026-01-01', '2026-12-31')
  })

  it('returns empty expenses list when workflow has no expenses', async () => {
    const workflow = Workflow.create(1, 1, 'Empty workflow', 50000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)
    mockExpenseRepo.getAllByWorkflowId.mockResolvedValue([])

    const result = await usecase.getAll(1, 1)

    expect(result.expenses).toEqual([])
  })
})
