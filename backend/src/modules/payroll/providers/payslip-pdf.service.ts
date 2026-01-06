import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PDFDocument from 'pdfkit';
import { Payslip } from '@/entities/payslip.entity';
import { Company } from '@/entities/company.entity';
import { PayslipService } from './payslip.service';

@Injectable()
export class PayslipPdfService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly payslipService: PayslipService,
  ) {}

  async generatePdf(payslipId: number, companyId: number): Promise<Buffer> {
    // Fetch payslip with all relations
    const payslip = await this.payslipService.findOne(payslipId, companyId);

    if (!payslip) {
      throw new NotFoundException(`Payslip #${payslipId} not found`);
    }

    // Fetch company details
    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Company #${companyId} not found`);
    }

    return this.createPdfBuffer(payslip, company);
  }

  private createPdfBuffer(payslip: Payslip, company: Company): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      try {
        this.buildPdfContent(doc, payslip, company);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private buildPdfContent(
    doc: PDFKit.PDFDocument,
    payslip: Payslip,
    company: Company,
  ): void {
    // Header - Company Information
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text(company.name, { align: 'center' });

    doc.fontSize(10).font('Helvetica').text('PAYSLIP', { align: 'center' });

    doc.moveDown(2);

    // Employee Information Section
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Employee Information', { underline: true });

    doc.moveDown(0.5);

    doc.fontSize(10).font('Helvetica');
    doc.text(
      `Employee: ${payslip.employee.firstName} ${payslip.employee.lastName}`,
    );
    doc.text(`Employee Number: ${payslip.employee.employeeNumber}`);

    doc.moveDown(1);

    // Pay Period Information
    doc.fontSize(12).font('Helvetica-Bold').text('Pay Period', {
      underline: true,
    });

    doc.moveDown(0.5);

    doc.fontSize(10).font('Helvetica');
    doc.text(
      `Period: ${this.formatDate(payslip.payPeriod.startDate)} - ${this.formatDate(payslip.payPeriod.endDate)}`,
    );
    doc.text(`Status: ${payslip.status}`);
    doc.text(`Currency: ${payslip.currency || 'PHP'}`);

    doc.moveDown(1.5);

    // Earnings Section
    const earningsItems = payslip.items.filter((item) => item.type === 'EARNING');
    if (earningsItems.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Earnings', {
        underline: true,
      });

      doc.moveDown(0.5);

      this.drawTable(
        doc,
        ['Description', 'Amount'],
        earningsItems.map((item) => [
          item.label,
          this.formatCurrency(item.amount, payslip.currency),
        ]),
      );

      doc.moveDown(1);
    }

    // Deductions Section
    const deductionItems = payslip.items.filter(
      (item) => item.type === 'DEDUCTION',
    );
    if (deductionItems.length > 0) {
      doc.fontSize(12).font('Helvetica-Bold').text('Deductions', {
        underline: true,
      });

      doc.moveDown(0.5);

      this.drawTable(
        doc,
        ['Description', 'Amount'],
        deductionItems.map((item) => [
          item.label,
          this.formatCurrency(item.amount, payslip.currency),
        ]),
      );

      doc.moveDown(1);
    }

    // Summary Section
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Summary', { underline: true });

    doc.moveDown(0.5);

    const summaryY = doc.y;
    doc.fontSize(10).font('Helvetica');
    doc.text('Gross Pay:', 50);
    doc.text(this.formatCurrency(payslip.grossPay, payslip.currency), 400, summaryY, {
      align: 'right',
    });

    doc.text('Total Deductions:', 50);
    doc.text(
      this.formatCurrency(payslip.totalDeductions, payslip.currency),
      400,
      doc.y - 12,
      { align: 'right' },
    );

    doc.moveDown(0.5);
    doc.strokeColor('#000000').lineWidth(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.fontSize(12).font('Helvetica-Bold');
    const netPayY = doc.y;
    doc.text('Net Pay:', 50);
    doc.text(this.formatCurrency(payslip.netPay, payslip.currency), 400, netPayY, {
      align: 'right',
    });

    // Hours worked (if applicable)
    if (payslip.totalRegularMinutes > 0) {
      doc.moveDown(1.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(
        `Total Hours Worked: ${this.formatMinutesToHours(payslip.totalRegularMinutes)}`,
      );

      if (payslip.totalOvertimeMinutes > 0) {
        doc.text(
          `Overtime Hours: ${this.formatMinutesToHours(payslip.totalOvertimeMinutes)}`,
        );
      }
    }

    // Footer
    doc.moveDown(3);
    doc
      .fontSize(8)
      .font('Helvetica')
      .text(
        `Generated on ${this.formatDate(new Date())}`,
        50,
        doc.page.height - 50,
        { align: 'center' },
      );
  }

  private drawTable(
    doc: PDFKit.PDFDocument,
    headers: string[],
    rows: string[][],
  ): void {
    const startX = 50;
    const startY = doc.y;
    const columnWidth = 250;

    // Draw headers
    doc.fontSize(10).font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, startX + i * columnWidth, startY, {
        width: columnWidth,
        align: i === 0 ? 'left' : 'right',
      });
    });

    doc.moveDown(0.5);

    // Draw rows
    doc.font('Helvetica');
    rows.forEach((row) => {
      const y = doc.y;
      row.forEach((cell, colIndex) => {
        doc.text(cell, startX + colIndex * columnWidth, y, {
          width: columnWidth,
          align: colIndex === 0 ? 'left' : 'right',
        });
      });
      doc.moveDown(0.5);
    });
  }

  private formatCurrency(amount: number, currency?: string | null): string {
    const curr = currency || 'PHP';
    const symbol = curr === 'PHP' ? '₱' : curr;
    return `${symbol} ${Number(amount).toFixed(2)}`;
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private formatMinutesToHours(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}
