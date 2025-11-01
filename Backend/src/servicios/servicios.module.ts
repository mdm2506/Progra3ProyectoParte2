import { Module } from '@nestjs/common';
import { ServiciosController } from './servicios.controller';
import { ServiciosService } from './servicios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './servicios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio])],
  controllers: [ServiciosController],
  providers: [ServiciosService]
})
export class ServiciosModule {}
