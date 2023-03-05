import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserEntity } from './model/user.entity';
import { UserService } from './service/user/user.service';
import { UserHelperService } from './service/user-helper/user-helper.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService]
})
export class UserModule { }