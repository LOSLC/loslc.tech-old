import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export interface FileDTOInterface {
  id: string;
  name: string;
  size: number;
}

export class UploadFileDTO {
  @ApiProperty({
    description: 'Custom name for the file (optional)',
    example: 'my-document.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class GetFilesDTO {
  @ApiProperty({
    description: 'Maximum number of files to return',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({
    description: 'Number of files to skip for pagination',
    example: 0,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}
