import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { createUserDto } from '../model/dto/create-user.dto';
import { UserInterface } from '../model/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user/user.service';
import { map, switchMap } from 'rxjs/operators'
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';
import { LoginResponseInterface } from '../model/login-response.interface';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
        private userHelperService: UserHelperService
    ) { }

    @Post()
    create(@Body() createUserDto: createUserDto): Observable<UserInterface> {
        return this.userHelperService.createUserDtoToEntity(createUserDto).pipe(
            switchMap((user: UserInterface) => this.userService.create(user))
        )
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Observable<Pagination<UserInterface>> {
        limit = limit > 1000 ? 100 : limit;
        return this.userService.findAll({ page, limit, route: 'http://localhost:3000/api/users' });
    }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto): Observable<LoginResponseInterface> {
        return this.userHelperService.loginUserDtoToEntity(loginUserDto).pipe(
            switchMap((user: UserInterface) => this.userService.login(user).pipe(
                map((jwt: string) => {
                    return {
                        access_token: jwt,
                        token_type: 'JWT',
                        expires_in: 10000
                    };
                })
            ))
        )
    }
}
