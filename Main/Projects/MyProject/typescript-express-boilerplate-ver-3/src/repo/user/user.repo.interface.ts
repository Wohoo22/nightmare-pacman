import User from '../../domains/user.domain';
import { ListUserInput, ListUserOutput } from './user.repo.port';

export default interface UserRepoInterface {
  createUser: (userToCreate : User) => Promise<User>
  updateUser: (id : string, userToUpdate : User) => Promise<User>
  listUser: (input: ListUserInput) => Promise<ListUserOutput>
  getUserById: (id: string) => Promise<User>
}
