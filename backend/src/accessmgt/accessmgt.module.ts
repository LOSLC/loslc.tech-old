import { Module } from "@nestjs/common";
import { AccessmgtService } from "./accessmgt.service";
import { AccessmgtController } from "./accessmgt.controller";
import { AccessGuard } from "./accessmgt.guard";

@Module({
	providers: [AccessmgtService, AccessGuard],
	controllers: [AccessmgtController],
	exports: [AccessmgtService, AccessGuard],
})
export class AccessmgtModule {}
