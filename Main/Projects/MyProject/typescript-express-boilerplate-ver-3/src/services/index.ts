/* eslint-disable import/prefer-default-export */
import UserServiceInterface from './user/user.service.interface';
import buildUserServiceImpl from './user/user.service.impl';

import * as repo from '../repo';

export const userService : UserServiceInterface = buildUserServiceImpl(repo.userRepo);
