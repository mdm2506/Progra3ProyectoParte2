import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TestimoniesService } from './testimonies.service';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import { UpdateTestimonyDto } from './dto/update-testimony.dto';
import { Testimony } from './entities/testimony.entity';

@Controller('testimonies')
export class TestimoniesController {
  constructor(private readonly testimoniesService: TestimoniesService) {}

  @Post()
  createTestimony(
    @Body() createTestimonyDto: CreateTestimonyDto,
  ): Promise<Testimony> {
    return this.testimoniesService.create(createTestimonyDto);
  }

  @Get()
  findAllTestimonies(): Promise<Testimony[]> {
    return this.testimoniesService.findAllTestimonies();
  }

  @Get(':id')
  findTestimonyById(@Param('id') id: number): Promise<Testimony> {
    return this.testimoniesService.findTestimonyById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTestimonyDto: UpdateTestimonyDto,
  ): Promise<any> {
    return await this.testimoniesService.updateTestimony(id, updateTestimonyDto);
  }

  @Delete(':id')
  async deleteTestimony(@Param('id') id: number): Promise<any> {
    return await this.testimoniesService.deleteTestimony(id);
  }
}
