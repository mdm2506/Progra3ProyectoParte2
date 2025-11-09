import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Landing } from 'src/landing/entities/landing.entity';
@Entity('testimonies')
export class Testimony {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  text: string;

  @Column({ nullable: true })
  img: string;

  @Column({ nullable: true })
  rating: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Landing, (landing) => landing.testimonies)
  landing: Landing;
}
