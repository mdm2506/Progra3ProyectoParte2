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
    return this.testimonyRepo.save(ent);
  }

  async findAll() {
    return this.testimonyRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const t = await this.testimonyRepo.findOneBy({ id });
    if (!t) throw new NotFoundException(`Testimony ${id} not found`);
    return t;
  }

  async update(id: number, updateTestimonyDto: UpdateTestimonyDto) {
    const t = await this.findOne(id);
    Object.assign(t, updateTestimonyDto);
    return this.testimonyRepo.save(t);
  }

  async remove(id: number) {
    const t = await this.findOne(id);
    await this.testimonyRepo.remove(t);
    return { deleted: true };
  }
}
