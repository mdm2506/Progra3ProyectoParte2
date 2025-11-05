import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Servicio } from './servicios.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
  ) {}

  async createServicio(servicio: Servicio): Promise<Servicio> {
    const foundServicio = await this.servicioRepository.findOneBy({ titulo: servicio.titulo });
    if (foundServicio) {
      throw new HttpException('Servicio already exists', HttpStatus.CONFLICT);
    }

    const newServicio = this.servicioRepository.create(servicio);
    const servicioCreated = await this.servicioRepository.save(newServicio);
    return servicioCreated;
  }

  async getAllServicios(): Promise<Servicio[]> {
    const servicios = await this.servicioRepository.find();
    if (!servicios || servicios.length === 0) {
      throw new HttpException('No servicios found', HttpStatus.NOT_FOUND);
    }
    return servicios;
  }

  async getServicioById(id: number): Promise<Servicio | null> {
    const servicio = await this.servicioRepository.findOne({
      where: { id },
    });

    if (!servicio) {
      throw new HttpException('Servicio not found', HttpStatus.NOT_FOUND);
    }

    return servicio;
  }

  deleteServicio(id: number): string {
    void this.servicioRepository.delete(id);
    return `DELETE SERVICIO ${id}`;
  }

  async updateServicio(id: number, servicio: Servicio): Promise<UpdateResult> {
    const servicioToUpdate = await this.servicioRepository.findOneBy({ id });
    if (!servicioToUpdate) {
      throw new HttpException('Servicio not found', HttpStatus.NOT_FOUND);
    }

    const updateResult = await this.servicioRepository.update(id, servicio);
    return updateResult;
  }
}
