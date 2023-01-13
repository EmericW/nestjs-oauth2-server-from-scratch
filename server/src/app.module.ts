import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { RegisterClientCommand } from './commands/register-client.command';
import { ClientService } from './services/client.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, ClientService, RegisterClientCommand],
})
export class AppModule {}
