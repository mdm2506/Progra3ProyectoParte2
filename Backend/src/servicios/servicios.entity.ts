
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Servicio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

   @Column()
   urlImagen: string;
}