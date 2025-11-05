import { Module } from '@nestjs/common';
import { LandingController } from './landing.controller';
import { LandingService } from './landing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landing } from './entities/landing.entity';
import { ServiciosModule } from 'src/servicios/servicios.module';
import { TestimoniesModule } from 'src/testimonies/testimonies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Landing]),
    ServiciosModule,
    TestimoniesModule,
  ],
  controllers: [LandingController],
  providers: [LandingService],
})
export class LandingModule {}
