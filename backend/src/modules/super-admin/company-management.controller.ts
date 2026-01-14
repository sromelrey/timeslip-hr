import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/guards/roles.decorator';
import { UserRole } from '@/types/enums';
import { CompanyManagementService } from './providers/company-management.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { CreateCompanyAdminDto } from './dtos/create-company-admin.dto';

@ApiTags('Super Admin - Company Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@Controller('super-admin/companies')
export class CompanyManagementController {
  constructor(private readonly companyManagementService: CompanyManagementService) {}

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  findAll() {
    return this.companyManagementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyManagementService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  create(@Body() dto: CreateCompanyDto) {
    return this.companyManagementService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateCompanyDto>) {
    return this.companyManagementService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a company' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyManagementService.remove(id);
  }

  @Post(':id/admins')
  @ApiOperation({ summary: 'Create an admin for a specific company' })
  createAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCompanyAdminDto,
  ) {
    return this.companyManagementService.createCompanyAdmin(id, dto);
  }
}
