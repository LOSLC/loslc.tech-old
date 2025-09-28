import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { AccessmgtModule } from "@/accessmgt/accessmgt.module";

@Module({
	imports: [AccessmgtModule],
	providers: [BlogService],
	controllers: [BlogController],
})
export class BlogModule {}
