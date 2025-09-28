import { Module } from "@nestjs/common";
import { AccessmgtModule } from "@/accessmgt/accessmgt.module";
import { StoreController } from "./store.controller";
import { StoreService } from "./store.service";

@Module({
	imports: [AccessmgtModule],
	controllers: [StoreController],
	providers: [StoreService],
})
export class StoreModule {}
