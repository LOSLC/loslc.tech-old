import { ApiProperty } from "@nestjs/swagger";

export class Message {
	@ApiProperty()
	message: string;
}
