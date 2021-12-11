import User from '../../domains/user.domain';
import * as Port from './user.service.port';

export default interface UserServiceInterface {
  createUser: (userToCreate : User) => Promise<User>
  updateUser: (id : string, userToUpdate : User) => Promise<User>
  listUser: (input: Port.ListUserInput) => Promise<Port.ListUserOutput>
  changePassword: (input : Port.ChangePasswordInput) => Promise<Port.ChangePasswordOutput>
}
