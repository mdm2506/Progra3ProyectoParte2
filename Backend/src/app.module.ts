import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiciosModule } from './servicios/servicios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroModule } from './hero/hero.module';
import { TestimoniesModule } from './testimonies/testimonies.module';
import { Testimony } from './testimonies/entities/testimony.entity';
import { LandingModule } from './landing/landing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'db_progra3_parte2',
      entities: [__dirname + '/**/*.entity{.ts,.js}', Testimony],
      synchronize: true, // Mantener en false para no sobrescribir la BD
      autoLoadEntities: true, // Carga automáticamente las entidades registradas en los módulos
    }),
    ServiciosModule,
    HeroModule,
    TestimoniesModule,
    LandingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
