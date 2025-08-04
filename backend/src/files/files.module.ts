import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AccessmgtModule } from '@/accessmgt/accessmgt.module';

@Module({
  imports: [AccessmgtModule],
  providers: [FilesService],
  controllers: [FilesController]
})
export class FilesModule {}
