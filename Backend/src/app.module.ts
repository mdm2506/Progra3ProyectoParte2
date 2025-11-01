import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiciosModule } from './servicios/servicios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'ServiciosDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // sincroniza la base de datos con las entidades
    }),
    ServiciosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
