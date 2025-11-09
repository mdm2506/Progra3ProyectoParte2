import { Landing } from 'src/landing/entities/landing.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  titulo: string;

  @Column()
  descripcion: string;

  @Column()
  urlImagen: string;

  @ManyToOne(() => Landing, (landing) => landing.servicios)
  landing: Landing;
}
