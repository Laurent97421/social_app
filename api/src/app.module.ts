import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserController } from './user/controller/user.controller';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // ConfigModule will load and parse the .env file from the root directory and store it 
    // in a private structure that we can access through the ConfigService
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    AuthModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/api/users', method: RequestMethod.POST },
        { path: '/api/users/login', method: RequestMethod.POST }
      )
      .forRoutes('')
  }
}
