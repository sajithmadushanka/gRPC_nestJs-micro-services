import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserList,
  PaginationDto,
} from '@app/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];

  onModuleInit() {}

  create(createUserDto: CreateUserDto) {
    const user: User = {
      ...createUserDto,
      subscribed: false,
      socialMedia: {},
      id: randomUUID(),
    };
    this.users.push(user);
    return user;
  }

  findAll() {
    const userList: UserList = { users: this.users };
    return userList;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.users.find((user) => user.id === updateUserDto.id);
    if (user) {
      Object.assign(user, updateUserDto);
    }
    return user;
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex >= 0) {
      return this.users.splice(userIndex, 1)[0];
    }
  }

  queryUsers(
    paginationDtoStream: Observable<PaginationDto>,
  ): Observable<UserList> {
    const subject = new Subject<UserList>();

    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.limit;
      const end = start + paginationDto.limit;

      subject.next({ users: this.users.slice(start, end) });
    };

    const onComplete = () => {
      subject.complete();
    };

    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return subject.asObservable();
  }
}
