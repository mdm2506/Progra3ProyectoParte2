
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Servicio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( { unique: true } )
    titulo: string;

    @Column()
    descripcion: string;

   @Column()
   urlImagen: string;
}