import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Login } from '../../../application/user/user-login-usecase'
import { User } from '../../../entities/user'
import { IUserRepository} from "../../../repository/user/user-repository.interface"

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
  compare: vi.fn(),
}))

import bcrypt from 'bcryptjs'

function makeUser() {
  return User.create(1, 'testuser', 'test@test.com', '09121234567', 'bcrypt$hashed$pass')
}

describe('Login usecase', () => {
  let mockRepo: { findByEmail: ReturnType<typeof vi.fn<IUserRepository['findByEmail']>>; register: ReturnType<typeof vi.fn<IUserRepository['register']>> }
  let usecase: Login

  beforeEach(() => {
    mockRepo = {
      findByEmail: vi.fn(),
      register: vi.fn(),
    }
    usecase = new Login(mockRepo)
    vi.mocked(bcrypt.compare).mockReset()
  })

  it('logs in successfully with correct credentials', async () => {
    const user = makeUser()
    mockRepo.findByEmail.mockResolvedValue(user)
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const result = await usecase.login('test@test.com', 'correctPassword')

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@test.com')
    expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'bcrypt$hashed$pass')
    expect(result).not.toHaveProperty('password')
    expect(result.email).toBe('test@test.com')
    expect(result.username).toBe('testuser')
  })

  it('throws when email not found', async () => {
    mockRepo.findByEmail.mockResolvedValue(null)

    await expect(usecase.login('unknown@test.com', 'anyPass'))
      .rejects.toThrow('Invalid credentials')

    expect(bcrypt.compare).not.toHaveBeenCalled()
  })

  it('throws when password is wrong', async () => {
    mockRepo.findByEmail.mockResolvedValue(makeUser())
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

    await expect(usecase.login('test@test.com', 'wrongPassword'))
      .rejects.toThrow('Invalid credentials')
  })

  it('returns SafeUser shape (no password, no private fields)', async () => {
    mockRepo.findByEmail.mockResolvedValue(makeUser())
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

    const result = await usecase.login('test@test.com', 'correctPassword')

    expect(Object.keys(result).sort()).toEqual(['email', 'id', 'phonenumber', 'username'])
    expect(result).not.toHaveProperty('password')
  })
})
