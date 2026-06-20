import { describe, it, expect } from 'vitest'
import { Expense } from '../../../entities/expense'

describe('Expense entity', () => {
  it('creates a valid expense', () => {
    const date = new Date('2026-06-20')
    const e = Expense.create(null, 1, 'Groceries', 'Food expenses', 150000, 'food', date)
    expect(e.getTitle()).toBe('Groceries')
    expect(e.getDescription()).toBe('Food expenses')
    expect(e.getAmount()).toBe(150000)
    expect(e.getCategory()).toBe('food')
    expect(e.getDate()).toBe(date)
    expect(e.workflowId).toBe(1)
    expect(e.id).toBeNull()
  })

  it('creates an expense with null category', () => {
    const date = new Date()
    const e = Expense.create(null, 1, 'General', 'No category', 50000, null, date)
    expect(e.getCategory()).toBeNull()
  })

  it('creates an expense with given id', () => {
    const date = new Date()
    const e = Expense.create(10, 1, 'Test', 'Test', 1000, null, date)
    expect(e.id).toBe(10)
  })

  it('throws for empty title', () => {
    const date = new Date()
    expect(() => Expense.create(null, 1, '', 'desc', 1000, null, date))
      .toThrow('Title is required')
  })

  it('throws for undefined title', () => {
    const date = new Date()
    expect(() => Expense.create(null, 1, undefined as any, 'desc', 1000, null, date))
      .toThrow('Title is required')
  })

  it('throws for amount of zero', () => {
    const date = new Date()
    expect(() => Expense.create(null, 1, 'Test', 'desc', 0, null, date))
      .toThrow('Amount must be greater than zero')
  })

  it('throws for negative amount', () => {
    const date = new Date()
    expect(() => Expense.create(null, 1, 'Test', 'desc', -5000, null, date))
      .toThrow('Amount must be greater than zero')
  })

  it('returns dates from getters', () => {
    const date = new Date('2026-06-20')
    const e = Expense.create(null, 1, 'Test', 'desc', 1000, null, date)
    expect(e.getDate()).toBe(date)
    expect(e.getCreatedAt()).toBeInstanceOf(Date)
    expect(e.getUpdatedAt()).toBeNull()
  })

  it('includes all fields in toJSON', () => {
    const date = new Date('2026-06-20')
    const e = Expense.create(5, 2, 'My Expense', 'Some desc', 75000, 'transport', date)
    const json = e.toJSON()
    expect(json).toHaveProperty('id', 5)
    expect(json).toHaveProperty('workflowId', 2)
    expect(json).toHaveProperty('title', 'My Expense')
    expect(json).toHaveProperty('description', 'Some desc')
    expect(json).toHaveProperty('amount', 75000)
    expect(json).toHaveProperty('category', 'transport')
    expect(json).toHaveProperty('date')
    expect(json).toHaveProperty('createdAt')
    expect(json).toHaveProperty('updatedAt')
  })
})
