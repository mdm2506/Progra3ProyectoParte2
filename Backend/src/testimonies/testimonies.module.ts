import { Module } from '@nestjs/common';
import { TestimoniesService } from './testimonies.service';
import { TestimoniesController } from './testimonies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Testimony } from './entities/testimony.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Testimony])],
  controllers: [TestimoniesController],
  providers: [TestimoniesService],
  exports: [TypeOrmModule],
})
export class TestimoniesModule {}
