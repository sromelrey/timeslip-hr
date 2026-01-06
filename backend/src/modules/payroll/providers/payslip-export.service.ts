import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import archiver from 'archiver';
import { Company } from '@/entities/company.entity';
import { PayslipService } from './payslip.service';
import { PayslipPdfService } from './payslip-pdf.service';
import { PassThrough } from 'stream';

@Injectable()
export class PayslipExportService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly payslipService: PayslipService,
    private readonly payslipPdfService: PayslipPdfService,
  ) {}

  async generatePayslipsZip(payPeriodId: number, companyId: number): Promise<PassThrough> {
    // Verify company
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException(`Company #${companyId} not found`);
    }

    // Get all payslips for the period
    const payslips = await this.payslipService.findAll(companyId, payPeriodId);

    if (payslips.length === 0) {
      throw new NotFoundException(`No payslips found for pay period #${payPeriodId}`);
    }

    const stream = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      stream.emit('error', err);
    });

    archive.pipe(stream);

    // Process each payslip
    for (const payslip of payslips) {
      try {
        const buffer = await this.payslipPdfService.generatePdf(payslip.id, companyId);
        
        // Create a filename: LastName_FirstName_PeriodId.pdf
        const filename = `${payslip.employee.lastName}_${payslip.employee.firstName}_${payslip.payPeriodId}.pdf`;
        
        archive.append(buffer, { name: filename });
      } catch (error) {
        console.error(`Failed to add payslip #${payslip.id} to archive:`, error);
        // Continue with other files even if one fails
      }
    }

    await archive.finalize();

    return stream;
  }
}
