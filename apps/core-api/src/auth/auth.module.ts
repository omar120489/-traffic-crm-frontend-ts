import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtCfg from './jwt.config';

@Module({
  imports: [ConfigModule.forFeature(jwtCfg)],
  providers: [],
  exports: []
})
export class AuthModule {}

