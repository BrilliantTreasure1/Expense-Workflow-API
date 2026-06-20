import { describe, it, expect } from 'vitest'
import { User } from '../../../entities/user'

describe('User entity', () => {
  it('creates a valid user', () => {
    const user = User.create(null, 'username123', 'user@test.com', '09121234567', 'password123')
    expect(user.getUsername()).toBe('username123')
    expect(user.getEmail()).toBe('user@test.com')
    expect(user.getPhoneNumber()).toBe('09121234567')
  })

  it('throws for undefined fields', () => {
    expect(() => User.create(null, undefined as any, 'u@t.com', '09121234567', 'pass1234'))
      .toThrow('Username is too short')
    expect(() => User.create(null, 'user123', undefined as any, '09121234567', 'pass1234'))
      .toThrow('Invalid email')
    expect(() => User.create(null, 'user123', 'u@t.com', undefined as any, 'pass1234'))
      .toThrow('Phone number is too short')
    expect(() => User.create(null, 'user123', 'u@t.com', '09121234567', undefined as any))
      .toThrow('Password too short')
  })

  it('throws for short username', () => {
    expect(() => User.create(null, 'abc', 'u@t.com', '09121234567', 'pass1234'))
      .toThrow('Username is too short')
  })

  it('throws for invalid email (no @)', () => {
    expect(() => User.create(null, 'username123', 'invalid', '09121234567', 'pass1234'))
      .toThrow('Invalid email')
  })

  it('throws for short phone number', () => {
    expect(() => User.create(null, 'username123', 'u@t.com', '0912', 'pass1234'))
      .toThrow('Phone number is too short')
  })

  it('throws for short password', () => {
    expect(() => User.create(null, 'username123', 'u@t.com', '09121234567', 'short'))
      .toThrow('Password too short')
  })

  it('excludes password from toJSON', () => {
    const user = User.create(null, 'username123', 'u@t.com', '09121234567', 'password123')
    const json = user.toJSON()
    expect(json).not.toHaveProperty('password')
    expect(json).toHaveProperty('username')
    expect(json).toHaveProperty('email')
    expect(json).toHaveProperty('phonenumber')
    expect(json).toHaveProperty('id')
  })

  it('returns correct id', () => {
    const user = User.create(5, 'username123', 'u@t.com', '09121234567', 'password123')
    expect(user.id).toBe(5)
  })

  it('returns null id for new user', () => {
    const user = User.create(null, 'username123', 'u@t.com', '09121234567', 'password123')
    expect(user.id).toBeNull()
  })
})
