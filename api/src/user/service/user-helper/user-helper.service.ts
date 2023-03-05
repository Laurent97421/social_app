import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { createUserDto } from 'src/user/model/dto/create-user.dto';
import { LoginUserDto } from 'src/user/model/dto/login-user.dto';
import { UserInterface } from 'src/user/model/user.interface';

@Injectable()
export class UserHelperService {

    createUserDtoToEntity(createUserDto: createUserDto): Observable<UserInterface> {
        return of({
            email: createUserDto.email,
            username: createUserDto.username,
            password: createUserDto.password
        });
    };

    loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<UserInterface> {
        return of({
            email: loginUserDto.email,
            password: loginUserDto.password
        });
    }
}
