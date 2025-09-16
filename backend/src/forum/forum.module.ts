import { Module } from '@nestjs/common';
import { AccessmgtModule } from '@/accessmgt/accessmgt.module';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';

@Module({
  imports: [AccessmgtModule],
  providers: [ForumService],
  controllers: [ForumController]
})
export class ForumModule {}
