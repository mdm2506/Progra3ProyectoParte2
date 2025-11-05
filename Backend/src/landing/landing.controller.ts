import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { LandingService } from './landing.service';
import { Landing } from './entities/landing.entity';

@Controller('landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Post()
  create(@Body() landing: Landing): Promise<Landing> {
    return this.landingService.createLanding(landing);
  }

  @Get()
  GetAllLandings(): Promise<Landing[]> {
    const landings = this.landingService.getAllLandings();
    return landings;
  }

  @Get(':id')
  GetLandingById(@Param('id') id: number): Promise<Landing | null> {
    const landing = this.landingService.getLandingById(id);
    return landing;
  }

  @Delete(':id')
  DeleteLanding(@Param('id') id: number): string {
    const result = this.landingService.deleteLanding(id);
    return result;
  }

  @Put(':id')
  updateLanding(@Param('id') id: number, @Body() landing: Landing): Promise<any> {
    return this.landingService.updateLanding(id, landing);
  }
}
