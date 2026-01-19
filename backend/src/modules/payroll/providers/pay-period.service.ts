import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PayPeriod } from '@/entities/pay-period.entity';
import { CreatePayPeriodDto } from '../dtos/create-pay-period.dto';
import { PayPeriodStatus } from '@/types/enums';

@Injectable()
export class PayPeriodService {
  constructor(
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepo: Repository<PayPeriod>,
  ) {}

  async findAll(companyId: number): Promise<PayPeriod[]> {
    return this.payPeriodRepo.find({
      where: { companyId },
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: number, companyId: number): Promise<PayPeriod> {
    const payPeriod = await this.payPeriodRepo.findOne({
      where: { id, companyId },
    });

    if (!payPeriod) {
      throw new NotFoundException(`Pay period #${id} not found`);
    }

    return payPeriod;
  }

  async create(companyId: number, dto: CreatePayPeriodDto): Promise<PayPeriod> {
    // Validate dates
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Check for overlapping periods
    const overlapping = await this.payPeriodRepo
      .createQueryBuilder('pp')
      .where('pp.company_id = :companyId', { companyId })
      .andWhere(
        '(pp.start_date BETWEEN :startDate AND :endDate OR pp.end_date BETWEEN :startDate AND :endDate OR (:startDate BETWEEN pp.start_date AND pp.end_date))',
        { startDate: dto.startDate, endDate: dto.endDate }
      )
      .getOne();

    if (overlapping) {
      throw new BadRequestException(
        `Pay period overlaps with existing period: ${overlapping.startDate} to ${overlapping.endDate}`
      );
    }

    const payPeriod = this.payPeriodRepo.create({
      companyId,
      ...dto,
      status: PayPeriodStatus.OPEN,
    });

    return this.payPeriodRepo.save(payPeriod);
  }

  async close(id: number, userId: number, companyId: number): Promise<PayPeriod> {
    const payPeriod = await this.findOne(id, companyId);

    if (payPeriod.status === PayPeriodStatus.CLOSED) {
      throw new BadRequestException('Pay period is already closed');
    }

    payPeriod.status = PayPeriodStatus.CLOSED;
    payPeriod.closedAt = new Date();
    payPeriod.closedByUserId = userId;

    return this.payPeriodRepo.save(payPeriod);
  }

  async reopen(id: number, companyId: number): Promise<PayPeriod> {
    const payPeriod = await this.findOne(id, companyId);

    if (payPeriod.status === PayPeriodStatus.OPEN) {
      throw new BadRequestException('Pay period is already open');
    }

    payPeriod.status = PayPeriodStatus.OPEN;
    payPeriod.closedAt = null;
    payPeriod.closedByUserId = null;

    return this.payPeriodRepo.save(payPeriod);
  }
}
