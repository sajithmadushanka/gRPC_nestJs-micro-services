import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  PaginationDto,
  UpdateUserDto,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/common';
import { AUTH_SERVICE } from './constants';
import { ClientGrpc } from '@nestjs/microservices';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }
  create(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  findAll() {
    return this.userService.findAllUsers({});
  }

  findOne(id: string) {
    return this.userService.findUserById({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  remove(id: number) {
    return this.userService.deleteUser({ id: id.toString() });
  }

  emailUsers() {
    const users$ = new ReplaySubject<PaginationDto>();

    users$.next({ page: 0, limit: 10 });
    users$.next({ page: 1, limit: 10 });
    users$.next({ page: 2, limit: 10 });
    users$.next({ page: 3, limit: 10 });
    users$.next({ page: 4, limit: 10 });

    users$.complete();

    let chunkNumber = 1;

    this.userService.queryUsers(users$).subscribe((users) => {
      console.log(`Chunk ${chunkNumber++}:`, users);
    });
  }
}
