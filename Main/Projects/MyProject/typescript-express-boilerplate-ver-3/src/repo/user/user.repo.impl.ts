/* eslint-disable @typescript-eslint/no-unused-vars */
import User from '../../domains/user.domain';
import UserRepoInterface from './user.repo.interface';
import { ListUserInput, ListUserOutput } from './user.repo.port';

export default function buildUserRepoImpl() : UserRepoInterface {
  async function createUser(userToCreate : User) : Promise<User> {
    return null;
  }
  async function updateUser(id : string, userToUpdate : User) : Promise<User> {
    return null;
  }

  async function listUser(input: ListUserInput) : Promise<ListUserOutput> {
    return null;
  }

  return {
    createUser,
    updateUser,
    listUser,
  };
}
