import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { EmployeeService } from './providers/employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto, CreateCompensationDto } from './dtos';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { EmployeeCompensationService } from './providers/employee-compensation.service';

interface AuthenticatedRequest extends Request {
  user: { id: number; companyId: number };
}

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
  findAll(@Req() req: AuthenticatedRequest) {
    return this.employeeService.findAll(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.employeeService.findOne(id, req.user.companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  create(@Body() dto: CreateEmployeeDto, @Req() req: AuthenticatedRequest) {
    // Enforce companyId from token
    if (req.user.companyId) {
      dto.companyId = req.user.companyId;
    }
    return this.employeeService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a employee' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateEmployeeDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.employeeService.update(id, dto, req.user.companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a employee' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.employeeService.remove(id, req.user.companyId);
  }

  // Compensation Endpoints

  @Post(':id/compensation')
  @ApiOperation({ summary: 'Add compensation record' })
  addCompensation(
    @Param('id', ParseIntPipe) id: number, 
    @Body() dto: CreateCompensationDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.compensationService.create(id, dto, req.user.companyId);
  }

  @Get(':id/compensation')
  @ApiOperation({ summary: 'Get compensation history' })
  getCompensationHistory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest
  ) {
    return this.compensationService.getHistory(id, req.user.companyId);
  }
}
