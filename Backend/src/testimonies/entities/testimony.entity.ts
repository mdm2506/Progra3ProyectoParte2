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

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ nullable: true })
  img: string;

  @Column({ nullable: true, length: 20 })
  rating: string;

  @ManyToOne(() => Landing, (landing) => landing.id, {
    eager: true,
  })
  landing: Landing;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
