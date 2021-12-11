import UserRepoInterface from '../../repo/user/user.repo.interface';
import User from '../../domains/user.domain';
import UserServiceInterface from './user.service.interface';
import * as ServicePort from './user.service.port';
import * as RepoPort from '../../repo/user/user.repo.port';

export default function buildUserServiceImpl(userRepo : UserRepoInterface) : UserServiceInterface {
  async function createUser(userToCreate : User) : Promise<User> {
    const res : User = await userRepo.createUser(userToCreate);
    return res;
  }

  async function updateUser(id : string, userToUpdate : User) : Promise<User> {
    const res : User = await userRepo.updateUser(id, userToUpdate);
    return res;
  }

  async function listUser(input: ServicePort.ListUserInput) : Promise<ServicePort.ListUserOutput> {
    const dbResult : RepoPort.ListUserOutput = await userRepo.listUser({
      limit: input.perPage,
      skip: input.perPage * (input.page - 1),
      sort: input.sort,
    });
    const res : ServicePort.ListUserOutput = {
      data: dbResult.data,
      page: input.page,
      perPage: input.perPage,
      sort: input.sort,
      total: dbResult.total,
    };
    return res;
  }

  async function changePassword(
    input : ServicePort.ChangePasswordInput,
  ) : Promise<ServicePort.ChangePasswordOutput> {
    const userDB : User = await userRepo.getUserById(input.id);
    if (userDB === undefined) {
      return {
        status: 'INVALID_USER_ID',
        success: false,
      };
    }
    if (userDB.password !== input.oldPassword) {
      return {
        status: 'OLD_PASSWORD_MISMATCH',
        success: false,
      };
    }
    await userRepo.updateUser(input.id, {
      password: input.newPassword,
    });
    return {
      status: 'OK',
      success: true,
    };
  }

  return {
    createUser,
    updateUser,
    listUser,
    changePassword,
  };
}
