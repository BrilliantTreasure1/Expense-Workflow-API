import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateExpense } from '../../../application/expense/expense-create-usecase'
import { Workflow } from '../../../entities/workflow'
import { Expense } from '../../../entities/expense'
import { IExpenseRepository } from "../../../repository/expense/expense-repository.interface";


describe('CreateExpense usecase', () => {
  let mockWorkflowRepo: { findById: ReturnType<typeof vi.fn> }
  let mockExpenseRepo: { create: ReturnType<typeof vi.fn> }
  let usecase: CreateExpense

  beforeEach(() => {
    mockWorkflowRepo = { findById: vi.fn() }
    mockExpenseRepo = { create: vi.fn() }
    usecase = new CreateExpense(mockExpenseRepo, mockWorkflowRepo)
  })

  it('creates an expense successfully', async () => {
    const workflow = Workflow.create(1, 1, 'Valid Workflow', 100000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)

    const expense = Expense.create(null, 1, 'Test Expense', 'desc', 50000, 'food', new Date('2026-06-20'))
    mockExpenseRepo.create.mockResolvedValue(expense)

    const result = await usecase.create(1, 1, 'Test Expense', 'desc', 50000, 'food', '2026-06-20')

    expect(result.getTitle()).toBe('Test Expense')
    expect(result.getAmount()).toBe(50000)
    expect(mockExpenseRepo.create).toHaveBeenCalledOnce()
  })

  it('throws when workflow not found', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.create(999, 1, 'Expense', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.create).not.toHaveBeenCalled()
  })

  it('throws when workflow belongs to another user', async () => {
    mockWorkflowRepo.findById.mockResolvedValue(null)

    await expect(usecase.create(1, 1, 'Expense', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Workflow not found')

    expect(mockExpenseRepo.create).not.toHaveBeenCalled()
  })

  it('throws when repository returns null', async () => {
    const workflow = Workflow.create(1, 1, 'Valid', 50000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)
    mockExpenseRepo.create.mockResolvedValue(null)

    await expect(usecase.create(1, 1, 'Expense', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Failed to create expense')
  })

  it('throws when expense entity validation fails (empty title)', async () => {
    const workflow = Workflow.create(1, 1, 'Valid', 50000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)

    await expect(usecase.create(1, 1, '', 'desc', 1000, null, '2026-06-20'))
      .rejects.toThrow('Title is required')
  })

  it('converts date string to Date object', async () => {
    const workflow = Workflow.create(1, 1, 'Valid', 50000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)

    let captured: Expense | undefined
    mockExpenseRepo.create.mockImplementation((e: Expense) => {
      captured = e
      return Promise.resolve(e)
    })

    await usecase.create(1, 1, 'Expense', 'desc', 1000, null, '2026-06-20')

    expect(captured!.getDate()).toBeInstanceOf(Date)
    expect(captured!.getDate().toISOString().startsWith('2026-06-20')).toBe(true)
  })

  it('passes null category when not provided', async () => {
    const workflow = Workflow.create(1, 1, 'Valid', 50000, 'desc')
    mockWorkflowRepo.findById.mockResolvedValue(workflow)

    let captured: Expense | undefined
    mockExpenseRepo.create.mockImplementation((e: Expense) => {
      captured = e
      return Promise.resolve(e)
    })

    await usecase.create(1, 1, 'Expense', 'desc', 1000, null, '2026-06-20')

    expect(captured!.getCategory()).toBeNull()
  })
})
