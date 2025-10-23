import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ required:false, default:1, minimum:1 })
  @Type(()=>Number) @IsInt() @Min(1) @IsOptional() page:number = 1;

  @ApiProperty({ required:false, default:10, minimum:1, maximum:100 })
  @Type(()=>Number) @IsInt() @Min(1) @Max(100) @IsOptional() size:number = 10;

  @ApiProperty({ required:false })
  @IsString() @IsOptional() search?: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty() items: T[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() size: number;
  @ApiProperty() totalPages: number;

  constructor(items:T[], total:number, page:number, size:number){
    this.items = items;
    this.total = total;
    this.page = page;
    this.size = size;
    this.totalPages = Math.ceil((total||0)/Math.max(size||1,1));
  }
}

