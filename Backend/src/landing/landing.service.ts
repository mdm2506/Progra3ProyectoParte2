/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { Landing } from './entities/landing.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LandingService {
  constructor(
    @InjectRepository(Landing)
    private landingRepository: Repository<Landing>,
  ) {}

  // Crear nuevo landing
  async createLanding(landing: Landing): Promise<Landing> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const foundLanding = await this.landingRepository.findOneBy({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      logoUrl: landing.logoUrl,
    });

    if (foundLanding) {
      throw new HttpException('Landing already exists', HttpStatus.CONFLICT);
    }

    const newLanding = this.landingRepository.create(landing);
    const landingCreated = await this.landingRepository.save(newLanding);
    return landingCreated;
  }

  // Obtener todos los landings
  async getAllLandings(): Promise<Landing[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const landings = await this.landingRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!landings || landings.length === 0) {
      throw new HttpException('No landings found', HttpStatus.NOT_FOUND);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return landings;
  }

  // Obtener un landing por ID
  async getLandingById(id: number): Promise<Landing | null> {
    const landing = await this.landingRepository.findOne({
      where: { id },
    });
    if (!landing) {
      throw new HttpException('Landing not found', HttpStatus.NOT_FOUND);
    }
    return landing;
  }

  // Eliminar un landing por ID
  deleteLanding(id: number): string {
    void this.landingRepository.delete(id);
    return `DELETE LANDING ${id}`;
  }

  // Actualizar un landing por ID
  async updateLanding(id: number, landing: Landing): Promise<UpdateResult> {
    const landingToUpdate = await this.landingRepository.findOneBy({ id });
    if (!landingToUpdate) {
      throw new HttpException('Landing not found', HttpStatus.NOT_FOUND);
    }

    const updateResult = await this.landingRepository.update(id, landing);
    return updateResult;
  }
}
