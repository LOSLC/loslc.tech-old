import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AccessmgtModule } from "./accessmgt/accessmgt.module";
import { BlogModule } from "./blog/blog.module";
import { ForumModule } from "./forum/forum.module";
import { FilesModule } from "./files/files.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccessmgtModule,
    BlogModule,
    ForumModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
