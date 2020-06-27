import MockAdapter from 'axios-mock-adapter'
import { renderHook } from '@testing-library/react-hooks'

import { act } from 'react-dom/test-utils'
import { useAuth, AuthProvider } from '../../hooks/auth'
import api from '../../services/api'

const apiMock = new MockAdapter(api)

describe('Auth hook', () => {
  it('Should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-123',
        name: 'John Doe',
        email: 'johndoe@email.com',
      },
      token: 'token-123',
    }
    apiMock.onPost('sessions').replyOnce(200, apiResponse)

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    result.current.signIn({
      email: 'johndoe@email.com',
      password: '123456',
    })

    await waitForNextUpdate()

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    )
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    )
    expect(result.current.user.email).toEqual('johndoe@email.com')
  })

  it('Should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123'
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-123',
            name: 'John Doe',
            email: 'johndoe@email.com',
          })
        default:
          return null
      }
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user.email).toEqual('johndoe@email.com')
  })

  it('Should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123'
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-123',
            name: 'John Doe',
            email: 'johndoe@email.com',
          })
        default:
          return null
      }
    })

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    act(() => {
      result.current.signOut()
    })

    expect(removeItemSpy).toBeCalledTimes(2)
    expect(result.current.user).toBeUndefined()
  })

  it('Should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    const user = {
      id: 'user-123',
      name: 'John Doe',
      email: 'johndoe@email.com',
      avatar_url: 'image-test.jpg',
    }

    act(() => {
      result.current.updateUser(user)
    })

    expect(setItemSpy).toHaveBeenLastCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    )

    expect(result.current.user).toEqual(user)
  })
})
