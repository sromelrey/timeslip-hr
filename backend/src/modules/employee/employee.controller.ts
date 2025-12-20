import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto, CreateCompensationDto } from './dtos';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { EmployeeCompensationService } from './employee-compensation.service';

@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly compensationService: EmployeeCompensationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a employee' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a employee' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.remove(id);
  }

  // Compensation Endpoints

  @Post(':id/compensation')
  @ApiOperation({ summary: 'Add compensation record' })
  addCompensation(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCompensationDto) {
    return this.compensationService.create(id, dto);
  }

  @Get(':id/compensation')
  @ApiOperation({ summary: 'Get compensation history' })
  getCompensationHistory(@Param('id', ParseIntPipe) id: number) {
    return this.compensationService.getHistory(id);
  }
}
