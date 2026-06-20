import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReportOverview } from '../../../application/report/report-overview-usecase'
import { Workflow } from '../../../entities/workflow'

describe('ReportOverview usecase', () => {
  let mockWorkflowRepo: { getAllByUserId: ReturnType<typeof vi.fn> }
  let mockExpenseRepo: {
    getTotalExpensesByUserId: ReturnType<typeof vi.fn>
    getCategorySummaryByUserId: ReturnType<typeof vi.fn>
  }
  let usecase: ReportOverview

  beforeEach(() => {
    mockWorkflowRepo = { getAllByUserId: vi.fn() }
    mockExpenseRepo = {
      getTotalExpensesByUserId: vi.fn(),
      getCategorySummaryByUserId: vi.fn(),
    }
    usecase = new ReportOverview(mockWorkflowRepo, mockExpenseRepo)
  })

  it('returns overview report with valid data', async () => {
    const workflows = [
      Workflow.create(1, 1, 'First Title', 100000, 'desc'),
      Workflow.create(2, 1, 'Second Title', 200000, 'desc'),
    ]
    mockWorkflowRepo.getAllByUserId.mockResolvedValue(workflows)
    mockExpenseRepo.getTotalExpensesByUserId.mockResolvedValue(50000)
    mockExpenseRepo.getCategorySummaryByUserId.mockResolvedValue([
      { category: 'food', count: 2, total: 30000 },
      { category: 'transport', count: 1, total: 20000 },
    ])

    const result = await usecase.getOverview(1)

    expect(result.totalWorkflows).toBe(2)
    expect(result.totalBudget).toBe(300000)
    expect(result.totalExpenses).toBe(50000)
    expect(result.remainingBudget).toBe(250000)
    expect(result.budgetUsagePercent).toBe(17)
    expect(result.categoryBreakdown).toHaveLength(2)
  })

  it('returns zero values when user has no workflows', async () => {
    mockWorkflowRepo.getAllByUserId.mockResolvedValue([])
    mockExpenseRepo.getTotalExpensesByUserId.mockResolvedValue(0)
    mockExpenseRepo.getCategorySummaryByUserId.mockResolvedValue([])

    const result = await usecase.getOverview(1)

    expect(result.totalWorkflows).toBe(0)
    expect(result.totalBudget).toBe(0)
    expect(result.totalExpenses).toBe(0)
    expect(result.remainingBudget).toBe(0)
    expect(result.budgetUsagePercent).toBe(0)
  })

  it('calculates budget usage percent correctly', async () => {
    const workflows = [Workflow.create(1, 1, 'Budget Title', 100000, 'desc')]
    mockWorkflowRepo.getAllByUserId.mockResolvedValue(workflows)
    mockExpenseRepo.getTotalExpensesByUserId.mockResolvedValue(25000)
    mockExpenseRepo.getCategorySummaryByUserId.mockResolvedValue([])

    const result = await usecase.getOverview(1)

    expect(result.budgetUsagePercent).toBe(25)
  })

  it('rounds budget usage percent', async () => {
    const workflows = [Workflow.create(1, 1, 'Title', 100000, 'desc')]
    mockWorkflowRepo.getAllByUserId.mockResolvedValue(workflows)
    mockExpenseRepo.getTotalExpensesByUserId.mockResolvedValue(33333)
    mockExpenseRepo.getCategorySummaryByUserId.mockResolvedValue([])

    const result = await usecase.getOverview(1)

    expect(result.budgetUsagePercent).toBe(33)
  })

  it('handles zero budget without division error', async () => {
    const workflows = [Workflow.create(1, 1, 'Free Title', 0, 'desc')]
    mockWorkflowRepo.getAllByUserId.mockResolvedValue(workflows)
    mockExpenseRepo.getTotalExpensesByUserId.mockResolvedValue(0)
    mockExpenseRepo.getCategorySummaryByUserId.mockResolvedValue([])

    const result = await usecase.getOverview(1)

    expect(result.budgetUsagePercent).toBe(0)
    expect(result.totalBudget).toBe(0)
    expect(result.remainingBudget).toBe(0)
  })

  it('returns data only for the given userId', async () => {
    mockWorkflowRepo.getAllByUserId.mockResolvedValue([])
    mockExpenseRepo.getTotalExpensesByUserId.mockResolvedValue(0)
    mockExpenseRepo.getCategorySummaryByUserId.mockResolvedValue([])

    await usecase.getOverview(5)

    expect(mockWorkflowRepo.getAllByUserId).toHaveBeenCalledWith(5)
    expect(mockExpenseRepo.getTotalExpensesByUserId).toHaveBeenCalledWith(5)
    expect(mockExpenseRepo.getCategorySummaryByUserId).toHaveBeenCalledWith(5)
  })
})
