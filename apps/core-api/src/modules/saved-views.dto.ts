import { IsString, IsNotEmpty, IsObject, IsBoolean, IsOptional } from 'class-validator';

export class CreateSavedViewDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsObject()
  @IsNotEmpty()
  filters!: Record<string, any>; // { from, to, users, types }

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean; // Admin only

  @IsBoolean()
  @IsOptional()
  isShared?: boolean;
}

export class UpdateSavedViewDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  filters?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsBoolean()
  @IsOptional()
  isShared?: boolean;
}

