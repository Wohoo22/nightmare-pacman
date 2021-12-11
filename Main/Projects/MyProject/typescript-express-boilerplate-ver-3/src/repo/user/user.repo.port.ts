import User from '../../domains/user.domain';

export interface ListUserInput {
  limit: number
  skip: number
  sort: number
}

export interface ListUserOutput {
  total: number,
  data: User[]
}
