import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { UserInterface } from 'src/user/model/user.interface';


const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {


    constructor(private readonly jwtService: JwtService) { }

    generateJwt(user: UserInterface): Observable<string> {
        return from(this.jwtService.signAsync({ user }));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12));
    };

    comparePassword(password: string, storedPasswordHash: string): Observable<any> {
        return from(bcrypt.compare(password, storedPasswordHash));
    };

    verifyJwt(jwt: string): Promise<any> {
        return this.jwtService.verifyAsync(jwt);
    }

}
