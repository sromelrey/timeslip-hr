import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '@/guards/jwt-auth.guard';
import { PayPeriodService } from './providers/pay-period.service';
import { PayslipService } from './providers/payslip.service';
import { PayslipPdfService } from './providers/payslip-pdf.service';
import { PayslipExportService } from './providers/payslip-export.service';
import { CreatePayPeriodDto } from './dtos/create-pay-period.dto';
import { GeneratePayslipsDto } from './dtos/generate-payslips.dto';

interface AuthenticatedRequest extends Request {
  user: { id: number; companyId: number; employeeId?: number };
}

@ApiTags('Payroll')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('payroll')
export class PayrollController {
  constructor(
    private readonly payPeriodService: PayPeriodService,
    private readonly payslipService: PayslipService,
    private readonly payslipPdfService: PayslipPdfService,
    private readonly payslipExportService: PayslipExportService,
  ) {}

  // ==================== Pay Period Endpoints ====================

  @Get('pay-periods')
  @ApiOperation({ summary: 'List all pay periods for the company' })
  async getPayPeriods(@Req() req: AuthenticatedRequest) {
    return this.payPeriodService.findAll(req.user.companyId);
  }

  @Post('pay-periods')
  @ApiOperation({ summary: 'Create a new pay period' })
  async createPayPeriod(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePayPeriodDto,
  ) {
    return this.payPeriodService.create(req.user.companyId, dto);
  }

  @Patch('pay-periods/:id/close')
  @ApiOperation({ summary: 'Close a pay period' })
  async closePayPeriod(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.payPeriodService.close(id, req.user.id, req.user.companyId);
  }

  @Patch('pay-periods/:id/reopen')
  @ApiOperation({ summary: 'Reopen a closed pay period' })
  async reopenPayPeriod(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.payPeriodService.reopen(id, req.user.companyId);
  }

  // ==================== Payslip Endpoints ====================

  @Get('my-payslips')
  @ApiOperation({ summary: 'Get current employee payslips' })
  async getMyPayslips(@Req() req: AuthenticatedRequest) {
    if (!req.user.employeeId) {
      throw new BadRequestException('User is not linked to an employee record');
    }
    return this.payslipService.findAll(req.user.companyId, undefined, req.user.employeeId);
  }

  @Get('payslips')
  @ApiOperation({ summary: 'List all payslips, optionally filtered by pay period' })
  async getPayslips(
    @Req() req: AuthenticatedRequest,
    @Query('payPeriodId') payPeriodId?: string,
  ) {
    return this.payslipService.findAll(
      req.user.companyId,
      payPeriodId ? parseInt(payPeriodId, 10) : undefined,
    );
  }

  @Get('payslips/:id')
  @ApiOperation({ summary: 'Get payslip details including items' })
  async getPayslip(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.payslipService.findOne(id, req.user.companyId);
  }

  @Post('payslips/generate')
  @ApiOperation({ summary: 'Generate payslips for a pay period' })
  async generatePayslips(
    @Req() req: AuthenticatedRequest,
    @Body() dto: GeneratePayslipsDto,
  ) {
    return this.payslipService.generate(req.user.companyId, dto, req.user.id);
  }

  @Patch('payslips/:id/finalize')
  @ApiOperation({ summary: 'Finalize a payslip' })
  async finalizePayslip(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.payslipService.finalize(id, req.user.id, req.user.companyId);
  }

  @Patch('payslips/:id/void')
  @ApiOperation({ summary: 'Void a payslip' })
  async voidPayslip(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.payslipService.void(id, req.user.id, req.user.companyId);
  }

  @Get('payslips/:id/pdf')
  @ApiOperation({ summary: 'Download payslip as PDF' })
  async downloadPayslipPdf(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.payslipPdfService.generatePdf(
      id,
      req.user.companyId,
    );
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="payslip-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get('pay-periods/:id/export-zip')
  @ApiOperation({ summary: 'Export all payslips for a pay period as ZIP' })
  async exportPayslipsZip(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const zipStream = await this.payslipExportService.generatePayslipsZip(
      id,
      req.user.companyId,
    );

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="payslips-period-${id}.zip"`,
    });

    zipStream.pipe(res);
  }
}
