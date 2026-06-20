import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Register } from '../../../application/user/user-register-usecase'
import { User } from '../../../entities/user'
import { IUserRepository} from "../../../repository/user/user-repository.interface"


vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
  },
  hash: vi.fn(),
}))

import bcrypt from 'bcryptjs'

function makeUser() {
  return User.create(1, 'testuser', 'test@test.com', '09121234567', 'hashedPass123')
}

describe('Register usecase', () => {
  let mockRepo: { findByEmail: ReturnType<typeof vi.fn<IUserRepository['findByEmail']>>; register: ReturnType<typeof vi.fn<IUserRepository['register']>> }
  let usecase: Register

  beforeEach(() => {
    mockRepo = {
      findByEmail: vi.fn(),
      register: vi.fn(),
    }
    usecase = new Register(mockRepo)
    vi.mocked(bcrypt.hash).mockReset()
  })

  it('registers a new user successfully', async () => {
    const user = makeUser()
    mockRepo.findByEmail.mockResolvedValue(null)
    vi.mocked(bcrypt.hash).mockResolvedValue('hashedPass123' as never)
    mockRepo.register.mockResolvedValue(user)

    const result = await usecase.register('testuser', 'test@test.com', '09121234567', 'plainPass123')

    expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@test.com')
    expect(bcrypt.hash).toHaveBeenCalledWith('plainPass123', 10)
    expect(mockRepo.register).toHaveBeenCalledOnce()
    expect(result.getEmail()).toBe('test@test.com')
  })

  it('throws when email already exists', async () => {
    mockRepo.findByEmail.mockResolvedValue(makeUser())

    await expect(usecase.register('testuser', 'test@test.com', '09121234567', 'plainPass123'))
      .rejects.toThrow('user registred before')

    expect(bcrypt.hash).not.toHaveBeenCalled()
    expect(mockRepo.register).not.toHaveBeenCalled()
  })

  it('throws when repository returns null', async () => {
    mockRepo.findByEmail.mockResolvedValue(null)
    vi.mocked(bcrypt.hash).mockResolvedValue('hashedPass123' as never)
    mockRepo.register.mockResolvedValue(null)

    await expect(usecase.register('testuser', 'test@test.com', '09121234567', 'plainPass123'))
      .rejects.toThrow('Failed to register user')
  })

  it('passes hashed password to user entity', async () => {
    mockRepo.findByEmail.mockResolvedValue(null)
    vi.mocked(bcrypt.hash).mockResolvedValue('bcrypt$hash$value' as never)

    let capturedUser: User | undefined
    mockRepo.register.mockImplementation((u: User) => {
      capturedUser = u
      return Promise.resolve(u)
    })

    await usecase.register('testuser', 'test@test.com', '09121234567', 'plainPass123')

    expect(capturedUser).toBeDefined()
    expect(capturedUser!.getPassword()).toBe('bcrypt$hash$value')
  })

  it('throws when user entity validation fails', async () => {
    mockRepo.findByEmail.mockResolvedValue(null)
    vi.mocked(bcrypt.hash).mockResolvedValue('hash' as never)

    await expect(usecase.register('ab', 'test@test.com', '09121234567', 'plainPass123'))
      .rejects.toThrow('Username is too short')
  })
})
