import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { RegisterClientCommand } from './commands/register-client.command';
import { ClientService } from './services/client.service';
import { AuthorizationController } from './controllers/authorization.controller';
import { APP_FILTER } from '@nestjs/core';
import { OAuthExceptionFilter } from './filters/oauth-exception.filter';
import { UserService } from './services/user.service';
import { AuthorizationCodeService } from './services/authorization-code.service';
import { CreateUserCommand } from './commands/create-user.command';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenService } from './services/access-token.service';
import { TokenController } from './controllers/token.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthorizationController, TokenController],
  providers: [
    PrismaService,
    ClientService,
    UserService,
    AuthorizationCodeService,
    AccessTokenService,

    RegisterClientCommand,
    CreateUserCommand,
    { provide: APP_FILTER, useClass: OAuthExceptionFilter },
  ],
})
export class AppModule {}
