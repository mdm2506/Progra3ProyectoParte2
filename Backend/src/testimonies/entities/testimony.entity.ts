import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
