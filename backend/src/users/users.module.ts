import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccessmgtModule } from '@/accessmgt/accessmgt.module';

@Module({
  imports: [AccessmgtModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
