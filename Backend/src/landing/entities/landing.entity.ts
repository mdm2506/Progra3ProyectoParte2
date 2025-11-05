import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Servicio } from 'src/servicios/servicios.entity';
import { Testimony } from 'src/testimonies/entities/testimony.entity';
@Entity()
export class Landing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  logoUrl: string;

  @Column()
  slogan: string;

  @OneToMany(() => Servicio, (servicio) => servicio.landing)
  servicios: Servicio[];

  @OneToMany(() => Testimony, (testimony) => testimony.landing)
  testimonies: Testimony[];
}
