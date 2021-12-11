import User from '../../domains/user.domain';

export interface ListUserInput {
  page: number
  perPage: number
  sort: number
}

export interface ListUserOutput {
  page: number
  perPage: number
  sort: number
  total: number
  data: User[]
}

export interface ChangePasswordInput {
  newPassword: string
  oldPassword: string
  id: string
}

export interface ChangePasswordOutput {
  success: boolean
  status: 'INVALID_USER_ID' | 'OLD_PASSWORD_MISMATCH' | 'OK'
}
