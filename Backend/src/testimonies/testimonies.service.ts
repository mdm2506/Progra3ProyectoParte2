import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import { UpdateTestimonyDto } from './dto/update-testimony.dto';
import { Testimony } from './entities/testimony.entity';

@Injectable()
export class TestimoniesService {
  constructor(
    @InjectRepository(Testimony)
    private readonly testimonyRepo: Repository<Testimony>,
  ) {}

  async create(createTestimonyDto: CreateTestimonyDto) {
    const ent = this.testimonyRepo.create(
      createTestimonyDto as Partial<Testimony>,
    );
    ent.landing = { id: 1 } as any; // Asigna Landing 1 por defecto
    return this.testimonyRepo.save(ent);
  }
  async findAllTestimonies() {
    return this.testimonyRepo.find();
  }

  async findTestimonyById(id: number) {
    const t = await this.testimonyRepo.findOneBy({ id });
    if (!t) throw new NotFoundException(`Testimony ${id} not found`);
    return t;
  }

  async updateTestimony(id: number, updateTestimonyDto: UpdateTestimonyDto) {
    const t = await this.findTestimonyById(id);
    Object.assign(t, updateTestimonyDto);
    return this.testimonyRepo.save(t);
  }

  async deleteTestimony(id: number) {
    const t = await this.findTestimonyById(id);
    await this.testimonyRepo.remove(t);
    return { deleted: true };
  }
}
