import { Test, TestingModule } from "@nestjs/testing";
import { AccessmgtController } from "./accessmgt.controller";

describe("AccessmgtController", () => {
	let controller: AccessmgtController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccessmgtController],
		}).compile();

		controller = module.get<AccessmgtController>(AccessmgtController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
