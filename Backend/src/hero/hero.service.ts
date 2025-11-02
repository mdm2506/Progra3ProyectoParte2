import { Injectable } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createHeroDto: CreateHeroDto) {
    return 'This action adds a new hero';
  }

  findAll() {
    return `This action returns all hero`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hero`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateHeroDto: UpdateHeroDto) {
    return `This action updates a #${id} hero`;
  }

  remove(id: number) {
    return `This action removes a #${id} hero`;
  }
}
