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
  async create(
    @Body() createTestimonyDto: CreateTestimonyDto,
  ): Promise<Testimony> {
    return await this.testimoniesService.create(createTestimonyDto);
  }

  @Get()
  async findAll(): Promise<Testimony[]> {
    return await this.testimoniesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Testimony> {
    return await this.testimoniesService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTestimonyDto: UpdateTestimonyDto,
  ): Promise<any> {
    return await this.testimoniesService.update(+id, updateTestimonyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return await this.testimoniesService.remove(+id);
  }
}
