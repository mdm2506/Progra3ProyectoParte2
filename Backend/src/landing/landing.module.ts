import { Module } from '@nestjs/common';
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landing } from './entities/landing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Landing])],
  controllers: [LandingController],
  providers: [LandingService],
})
export class LandingModule {}
