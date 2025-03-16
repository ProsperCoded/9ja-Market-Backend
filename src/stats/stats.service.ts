import { WinstonLogger } from "../utils/logger/winston.logger";
import { CustomerRepository } from "../repositories/customer.repository";
import { MerchantRepository } from "../repositories/merchant.repository";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { ErrorMessages } from "../constants/error-messages.enum";
import { PaymentStatus, PaymentFor } from "@prisma/client";
import moment from "moment-timezone";
import { TransactionRepository } from "../repositories/transaction.repository";

export class StatsService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly logger: WinstonLogger
  ) {}

  async getTotalCustomers(): Promise<number> {
    try {
      const total = await this.customerRepository.count();
      return total;
    } catch (error) {
      this.logger.error(`${ErrorMessages.INTERNAL_SERVER_ERROR}: ${error}`);
      throw new InternalServerException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async getTotalMerchants(): Promise<number> {
    try {
      const total = await this.merchantRepository.count();
      return total;
    } catch (error) {
      this.logger.error(`${ErrorMessages.INTERNAL_SERVER_ERROR}: ${error}`);
      throw new InternalServerException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async getPlatformStats() {
    try {
      const [totalCustomers, totalMerchants] = await Promise.all([
        this.getTotalCustomers(),
        this.getTotalMerchants(),
      ]);

      return {
        totalCustomers,
        totalMerchants,
      };
    } catch (error) {
      this.logger.error(`${ErrorMessages.INTERNAL_SERVER_ERROR}: ${error}`);
      throw new InternalServerException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async getAdRevenue() {
    try {
      const now = moment.tz("Africa/Lagos");
      const startOfMonth = now.clone().startOf("month");
      const startOfYear = now.clone().startOf("year");

      const transactions =
        await this.transactionRepository.getAdsTransactions();
      const paidTransactions = transactions.filter(
        (t) => t.status === PaymentStatus.SUCCESS
      );

      const monthRevenue = paidTransactions
        .filter((t) => moment(t.date).isSameOrAfter(startOfMonth))
        .reduce((sum, t) => sum + t.amount, 0);

      const yearRevenue = paidTransactions
        .filter((t) => moment(t.date).isSameOrAfter(startOfYear))
        .reduce((sum, t) => sum + t.amount, 0);

      const totalRevenue = paidTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      return {
        monthRevenue,
        yearRevenue,
        totalRevenue,
      };
    } catch (error) {
      this.logger.error(`${ErrorMessages.REVENUE_FETCH_FAILED}: ${error}`);
      throw new InternalServerException(ErrorMessages.REVENUE_FETCH_FAILED);
    }
  }

  async getAllStats() {
    try {
      const [platformStats, adRevenue] = await Promise.all([
        this.getPlatformStats(),
        this.getAdRevenue(),
      ]);

      return {
        ...platformStats,
        revenue: adRevenue,
      };
    } catch (error) {
      this.logger.error(`${ErrorMessages.STATS_FETCH_FAILED}: ${error}`);
      throw new InternalServerException(ErrorMessages.STATS_FETCH_FAILED);
    }
  }
}
