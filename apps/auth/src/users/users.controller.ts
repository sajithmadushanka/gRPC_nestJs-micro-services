import { Controller } from '@nestjs/common';

import { UsersService } from './users.service';
import {
  CreateUserDto,
  FineOneUserDto,
  UpdateUserDto,
  UserServiceController,
  UserServiceControllerMethods,
  User,
  PaginationDto,
} from '@app/common';
import { Observable } from 'rxjs';

@UserServiceControllerMethods()
@Controller()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAll();
  }

  findUserById(fineOneUserDto: FineOneUserDto): Promise<User> {
    const user = this.usersService.findOne(fineOneUserDto.id);
    if (!user) {
      throw new Error('User not found');
    }
    return Promise.resolve(user);
  }

  updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const user = this.usersService.update(updateUserDto.id, updateUserDto);
    if (!user) {
      throw new Error('User not found');
    }
    return Promise.resolve(user);
  }

  deleteUser(fineOneUserDto: FineOneUserDto) {
    const user = this.usersService.remove(fineOneUserDto.id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  queryUsers(paginationDtoStream: Observable<PaginationDto>) {
    return this.usersService.queryUsers(paginationDtoStream);
  }
}
