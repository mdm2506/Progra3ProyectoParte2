import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiciosModule } from './servicios/servicios.module';

@Module({
  imports: [ServiciosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
