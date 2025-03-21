import { WinstonLogger } from "../utils/logger/winston.logger";
import { CustomerRepository } from "../repositories/customer.repository";
import { MerchantRepository } from "../repositories/merchant.repository";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { ErrorMessages } from "../constants/error-messages.enum";
import { PaymentStatus, PaymentFor } from "@prisma/client";
import moment from "moment-timezone";
import { TransactionRepository } from "../repositories/transaction.repository";
import { ProductRepository } from "../repositories/product.repository";
import { AdRepository } from "../repositories/ad.repository";
import { MarketerRepository } from "../repositories/marketer.repository";

export class StatsService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly productRepository: ProductRepository,
    private readonly adRepository: AdRepository,
    private readonly marketerRepository: MarketerRepository,
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

  async getTotalProducts(): Promise<number> {
    try {
      const total = await this.productRepository.count();
      return total;
    } catch (error) {
      this.logger.error(`${ErrorMessages.INTERNAL_SERVER_ERROR}: ${error}`);
      throw new InternalServerException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async getTotalAds(): Promise<number> {
    try {
      const total = await this.adRepository.count();
      return total;
    } catch (error) {
      this.logger.error(`${ErrorMessages.INTERNAL_SERVER_ERROR}: ${error}`);
      throw new InternalServerException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }

  async getTotalMarketers(): Promise<number> {
    try {
      const total = await this.marketerRepository.count();
      return total;
    } catch (error) {
      this.logger.error(`${ErrorMessages.INTERNAL_SERVER_ERROR}: ${error}`);
      throw new InternalServerException(ErrorMessages.INTERNAL_SERVER_ERROR);
    }
  }
  async getPlatformStats() {
    try {
      const [
        totalCustomers,
        totalMerchants,
        totalProducts,
        totalAds,
        totalMarketers,
      ] = await Promise.all([
        this.getTotalCustomers(),
        this.getTotalMerchants(),
        this.getTotalProducts(),
        this.getTotalAds(),
        this.getTotalMarketers(),
      ]);
      const data = {
        totalCustomers,
        totalMerchants,
        totalProducts,
        totalAds,
        totalMarketers,
      };
      this.logger.info(`Platform Stats: ${JSON.stringify(data)}`);
      return data;
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
