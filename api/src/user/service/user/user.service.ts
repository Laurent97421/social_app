import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserEntity } from 'src/user/model/user.entity';
import { UserInterface } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { map, mapTo, switchMap } from 'rxjs/operators'
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) { }

    create(newUser: UserInterface): Observable<UserInterface> {
        return this.mailExist(newUser.email).pipe(
            switchMap((exists: boolean) => {
                if (exists === false) {
                    return this.hashPassword(newUser.password).pipe(
                        switchMap((passwordHash: string) => {
                            // Overwrite the user password with the hash, to store the hash in the database
                            newUser.password = passwordHash
                            return from(this.userRepository.save(newUser)).pipe(
                                switchMap((user: UserInterface) => this.findOne(user.id))
                            );
                        })

                    )
                } else {
                    throw new HttpException('This email already exists', HttpStatus.CONFLICT)
                }
            })
        )
    }

    login(user: UserInterface): Observable<string> {
        return this.findByEmail(user.email).pipe(
            switchMap((foundUser: UserInterface) => {
                if(foundUser) {
                    return this.validatePassword(user.password, foundUser.password).pipe(
                        switchMap((matches: boolean) => {
                            if(matches) {
                                return this.findOne(foundUser.id).pipe(
                                    switchMap((payload: UserInterface) => this.authService.generateJwt(payload))
                                )
                            } else {
                                throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);
                            }
                        })
                    );
                } else {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }
            })
        )
    }

    findAll(options: IPaginationOptions): Observable<Pagination<UserInterface>> {
        return from(paginate<UserEntity>(this.userRepository, options));
    }

    // Also returns the password
    private findByEmail(email: string): Observable<UserInterface> {
        return from(this.userRepository.findOne({where: {email}, select: ['id', 'email', 'username', 'password']}));
    }

    private hashPassword(password: string): Observable<string> {
        return this.authService.hashPassword(password);
    }

    private validatePassword(password: string, storedPasswordHash: string): Observable<any> {
        return this.authService.comparePassword(password, storedPasswordHash);
    }


    private findOne(id: number): Observable<UserInterface> {
        return from(this.userRepository.findOne({where: {id}}));
    }

    public getOne(id: number): Promise<UserInterface> {
        return this.userRepository.findOneOrFail({where: {id}});
    }

    private mailExist(email: string): Observable<boolean> {
        return from(this.userRepository.findOne({ where: {email} })).pipe(
            map((user: UserInterface) => {
                if (user) {
                    return true;
                } else {
                    return false;
                }
            })
        )
    }
}
