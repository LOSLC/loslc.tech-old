import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsBoolean,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	Min,
} from "class-validator";
import { Allow } from "class-validator";
import { Type } from "class-transformer";

export class ForumPostDTO {
	@ApiProperty()
	@IsString()
	id: string;

	@ApiProperty()
	@IsString()
	title: string;

	@ApiProperty()
	@IsString()
	content: string;

	@ApiProperty()
	@IsString()
	authorId: string;

	@ApiProperty()
	@Allow()
	postedAt: Date;

	@ApiProperty()
	@Allow()
	updatedAt: Date;
}

export class CreateForumPostDTO {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	content: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}

export class UpdateForumPostDTO {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	content?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}

export class ForumCommentDTO {
	@ApiProperty()
	@IsString()
	id: string;

	@ApiProperty()
	@IsString()
	postId: string;

	@ApiProperty()
	@IsString()
	authorId: string;

	@ApiProperty()
	@IsString()
	content: string;

	@ApiProperty()
	@Allow()
	postedAt: Date;

	@ApiProperty()
	@Allow()
	updatedAt: Date;
}

export class CreateForumCommentDTO {
	@IsNotEmpty()
	@IsString()
	content: string;
}

export class UpdateForumCommentDTO {
	@IsNotEmpty()
	@IsString()
	content: string;
}

export class VoteDTO {
	@IsNotEmpty()
	@IsInt()
	@IsIn([1, -1])
	voteType: 1 | -1;
}

export class VoteCountDTO {
	@ApiProperty()
	@IsInt()
	up: number;

	@ApiProperty()
	@IsInt()
	down: number;

	@ApiProperty()
	@IsInt()
	score: number; // up - down
}

export class GetForumPostsQueryDTO {
	@IsOptional()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	offset?: number = 0;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit?: number = 20;

	@IsOptional()
	@IsString()
	authorId?: string;

	@IsOptional()
	@IsString()
	tag?: string;

	@IsOptional()
	@IsString()
	query?: string;
}

export class GetForumCommentsQueryDTO {
	@IsOptional()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	offset?: number = 0;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit?: number = 20;
}

export class ForumTagDTO {
	@ApiProperty()
	@IsString()
	id: string;

	@ApiProperty()
	@IsString()
	name: string;
}

export class CreateForumTagDTO {
	@IsNotEmpty()
	@IsString()
	name: string;
}
