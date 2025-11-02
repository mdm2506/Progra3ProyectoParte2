import { Controller,Post,Get,Put,Delete,Param, Body,} from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { Servicio } from './servicios.entity';
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  create(@Body() servicio: Servicio): Promise<Servicio> {
    return this.serviciosService.createServicio(servicio);
  }

  @Get()
  GetAllServicios(): Promise<Servicio[]> {
    const servicios = this.serviciosService.getAllServicios();
    return servicios;
  }

  @Get(':id')
  GetServicioById(@Param('id') id: number): Promise<Servicio | null> {
    const servicio = this.serviciosService.getServicioById(id);
    return servicio;
  }

  @Delete(':id')
  DeleteServicio(@Param('id') id: number): string {
    const result = this.serviciosService.deleteServicio(id);
    return result;
  }

  @Put(':id')
  updateServicio(@Param('id') id: number, @Body() servicio: Servicio): Promise<any> {
    return this.serviciosService.updateServicio(id, servicio);
  }
}
