import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReportWorkflow } from '../../../application/report/report-workflow-usecase'
import { Workflow } from '../../../entities/workflow'

describe('ReportWorkflow usecase', () => {
  let mockWorkflowRepo: { findById: ReturnType<typeof vi.fn> }
  let mockExpenseRepo: {
    getTotalExpensesByWorkflowId: ReturnType<typeof vi.fn>
    getCategorySummaryByWorkflowId: ReturnType<typeof vi.fn>
  }
  let usecase: ReportWorkflow

  beforeEach(() => {
    mockWorkflowRepo = { findById: vi.fn() }
    mockExpenseRepo = {
      getTotalExpensesByWorkflowId: vi.fn(),
      getCategorySummaryByWorkflowId: vi.fn(),
    }
    usecase = new ReportWorkflow(mockWorkflowRepo, mockExpenseRepo)
  })

  it('returns workflow report with valid data', async () => {
    const workflow = Workflow.create(1, 1, 'My Workflow', 200000, 'project desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)
    mockExpenseRepo.getTotalExpensesByWorkflowId.mockResolvedValue({ total: 50000, count: 3 })
    mockExpenseRepo.getCategorySummaryByWorkflowId.mockResolvedValue([
      { category: 'food', count: 2, total: 30000 },
      { category: 'transport', count: 1, total: 20000 },
    ])

    const result = await usecase.getReport(1, 1)

    expect(result.workflow.getTitle()).toBe('My Workflow')
    expect(result.totalExpenses).toBe(50000)
    expect(result.expenseCount).toBe(3)
    expect(result.remainingBudget).toBe(150000)
    expect(result.budgetUsagePercent).toBe(25)
    expect(result.categoryBreakdown).toHaveLength(2)
  })

  it('throws when workflow not found', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.getReport(999, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.getTotalExpensesByWorkflowId).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.getReport(1, 1))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.getTotalExpensesByWorkflowId).not.toHaveBeenCalled()
  })

  it('returns zero expenses when workflow has none', async () => {
    const workflow = Workflow.create(1, 1, 'Empty', 100000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)
    mockExpenseRepo.getTotalExpensesByWorkflowId.mockResolvedValue({ total: 0, count: 0 })
    mockExpenseRepo.getCategorySummaryByWorkflowId.mockResolvedValue([])

    const result = await usecase.getReport(1, 1)

    expect(result.totalExpenses).toBe(0)
    expect(result.expenseCount).toBe(0)
    expect(result.remainingBudget).toBe(100000)
    expect(result.budgetUsagePercent).toBe(0)
  })

  it('handles zero budget without division error', async () => {
    const workflow = Workflow.create(1, 1, 'Freebie', 0, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)
    mockExpenseRepo.getTotalExpensesByWorkflowId.mockResolvedValue({ total: 0, count: 0 })
    mockExpenseRepo.getCategorySummaryByWorkflowId.mockResolvedValue([])

    const result = await usecase.getReport(1, 1)

    expect(result.budgetUsagePercent).toBe(0)
    expect(result.remainingBudget).toBe(0)
  })

  it('rounds budget usage percent', async () => {
    const workflow = Workflow.create(1, 1, 'Title', 100000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)
    mockExpenseRepo.getTotalExpensesByWorkflowId.mockResolvedValue({ total: 33333, count: 1 })
    mockExpenseRepo.getCategorySummaryByWorkflowId.mockResolvedValue([])

    const result = await usecase.getReport(1, 1)

    expect(result.budgetUsagePercent).toBe(33)
  })
})
