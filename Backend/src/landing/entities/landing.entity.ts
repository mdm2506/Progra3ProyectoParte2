import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Landing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  logoUrl: string;

  @Column()
  slogan: string;
}
