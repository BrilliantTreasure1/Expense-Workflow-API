import { describe, it, expect } from 'vitest'
import { Workflow } from '../../../entities/workflow'

describe('Workflow entity', () => {
  it('creates a valid workflow with default status', () => {
    const w = Workflow.create(null, 1, 'Test Workflow Title', 100000, 'description')
    expect(w.getTitle()).toBe('Test Workflow Title')
    expect(w.getBudget()).toBe(100000)
    expect(w.getDescription()).toBe('description')
    expect(w.getStatus()).toBe('active')
    expect(w.userId).toBe(1)
    expect(w.id).toBeNull()
  })

  it('creates a workflow with given status', () => {
    const w = Workflow.create(null, 1, 'Test Workflow Title', 100000, 'description', 'archive')
    expect(w.getStatus()).toBe('archive')
  })

  it('creates a workflow with given id', () => {
    const w = Workflow.create(5, 1, 'Test Workflow Title', 100000, 'description')
    expect(w.id).toBe(5)
  })

  it('throws for short title', () => {
    expect(() => Workflow.create(null, 1, 'abc', 100000, 'desc'))
      .toThrow('Title is too short')
  })

  it('throws for title at exactly 4 chars', () => {
    expect(() => Workflow.create(null, 1, 'abcd', 100000, 'desc'))
      .toThrow('Title is too short')
  })

  it('accepts title at exactly 5 chars', () => {
    const w = Workflow.create(null, 1, 'abcde', 100000, 'desc')
    expect(w.getTitle()).toBe('abcde')
  })

  it('throws for negative budget', () => {
    expect(() => Workflow.create(null, 1, 'Valid Title', -1, 'desc'))
      .toThrow('Invalid budget')
  })

  it('throws for zero budget', () => {
    expect(() => Workflow.create(null, 1, 'Valid Title', 0, 'desc'))
      .not.toThrow()
  })

  it('returns correct values from getters', () => {
    const w = Workflow.create(10, 2, 'My Project Plan', 5000000, 'A long description here')
    expect(w.getTitle()).toBe('My Project Plan')
    expect(w.getBudget()).toBe(5000000)
    expect(w.getDescription()).toBe('A long description here')
    expect(w.getStatus()).toBe('active')
    expect(w.getCreatedAt()).toBeInstanceOf(Date)
    expect(w.getUpdatedAt()).toBeNull()
  })

  it('includes all fields in toJSON', () => {
    const w = Workflow.create(3, 1, 'Workflow Title', 200000, 'Some desc')
    const json = w.toJSON()
    expect(json).toHaveProperty('id', 3)
    expect(json).toHaveProperty('userId', 1)
    expect(json).toHaveProperty('title')
    expect(json).toHaveProperty('budget')
    expect(json).toHaveProperty('description')
    expect(json).toHaveProperty('createdAt')
    expect(json).toHaveProperty('updatedAt')
    expect(json).toHaveProperty('status', 'active')
  })
})
