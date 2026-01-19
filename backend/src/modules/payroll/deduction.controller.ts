import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { DeductionService } from './providers/deduction.service';
import { CreateDeductionDto } from './dtos/create-deduction.dto';
import { UpdateDeductionDto } from './dtos/update-deduction.dto';

interface AuthenticatedRequest extends Request {
  user: { id: number; companyId: number };
}

@ApiTags('Deductions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('payroll/deductions')
export class DeductionController {
  constructor(private readonly deductionService: DeductionService) {}

  @Get()
  @ApiOperation({ summary: 'List deductions, optionally filtered by employee' })
  async getDeductions(
    @Req() req: AuthenticatedRequest,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.deductionService.findAll(
      req.user.companyId,
      employeeId ? parseInt(employeeId, 10) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deduction details' })
  async getDeduction(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.deductionService.findOne(id, req.user.companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new deduction' })
  async createDeduction(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateDeductionDto,
  ) {
    return this.deductionService.create(req.user.companyId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a deduction' })
  async updateDeduction(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeductionDto,
  ) {
    return this.deductionService.update(id, req.user.companyId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a deduction (soft delete)' })
  async deleteDeduction(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.deductionService.delete(id, req.user.companyId);
    return { message: 'Deduction deleted successfully' };
  }
}
