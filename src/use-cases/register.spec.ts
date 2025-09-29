import { expect, test, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

test('check if it works', () => {
  expect(2 + 2).toBe(4)
})

// Uni

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUserCase = new RegisterUseCase({
      async findByEmail(email) {
        return null
      },

      async create(data) {
        return {
          id: 'user-01',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await registerUserCase.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
