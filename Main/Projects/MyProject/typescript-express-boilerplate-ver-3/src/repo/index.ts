/* eslint-disable import/prefer-default-export */
import UserRepoInterface from './user/user.repo.interface';
import buildUserRepoImpl from './user/user.repo.impl';

export const userRepo : UserRepoInterface = buildUserRepoImpl();
