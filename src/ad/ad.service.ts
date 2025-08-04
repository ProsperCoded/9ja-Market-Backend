import { Merchant, PaymentFor, PaymentStatus } from "@prisma/client";
import { AdPrices, AdTimeLine } from "../constants/ad-constants.enum";
import { ErrorMessages } from "../constants/error-messages.enum";
import { AdRepository } from "../repositories/ad.repository";
import { PaystackPaymentRepository } from "../repositories/payment.repository";
import { ProductRepository } from "../repositories/product.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BadRequestException } from "../utils/exceptions/bad-request.exception";
import { BaseException } from "../utils/exceptions/base.exception";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { ILogger } from "../utils/logger/logger.interface";
import { UnauthorizedException } from "../utils/exceptions/unauthorized.exception";
import moment from "moment-timezone";
import { MarketerService } from "../marketer/marketer.service";

export class AdService {
  constructor(
    private readonly adRepository: AdRepository,
    private readonly paymentService: PaystackPaymentRepository,
    private readonly productRepository: ProductRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly marketerService: MarketerService,
    private readonly logger: ILogger
  ) {}

  async activateFreeAd(productId: string, merchant: Merchant) {
    try {
      // Check if the product exists
      const product = await this.productRepository.getById(productId);
      if (!product)
        throw new BadRequestException(ErrorMessages.PRODUCT_NOT_FOUND);

      // Ensure Merchant Owns Product
      if (product.merchantId !== merchant.id)
        throw new UnauthorizedException(ErrorMessages.NOT_YOUR_PRODUCT);

      // Check if the merchant has a free ad
      const freeAd = await this.adRepository.getFreeAd(productId);
      if (freeAd) throw new BadRequestException(ErrorMessages.FREE_AD_EXISTS);

      const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      // Create a new Ad
      const ad = await this.adRepository.create({
        level: 0,
        expiresAt,
        product: { connect: { id: productId } },
      });
      return ad;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.FREE_AD_ACTIVATION_FAILED, error);
      throw new InternalServerException(
        ErrorMessages.FREE_AD_ACTIVATION_FAILED
      );
    }
  }

  async initializeAdPayment(
    level: keyof typeof AdPrices,
    productId: string,
    merchant: Merchant
  ) {
    try {
      // Check if the product exists
      const product = await this.productRepository.getById(productId);
      if (!product)
        throw new BadRequestException(ErrorMessages.PRODUCT_NOT_FOUND);

      // Create a new Ad
      const ad = await this.adRepository.create({
        level,
        product: { connect: { id: productId } },
      });
      // Create Transaction
      const transaction = await this.transactionRepository.create(
        {
          amount: AdPrices[level],
          for: PaymentFor.ADVERTISEMENT,
          status: PaymentStatus.INITIALIZED,
          reference: ad.id,
        },
        merchant.id
      );

      const paystackReference = `txn-${transaction.id}`;
      // ! Already intializing payment from frontend
      // const paymentInit = await this.paymentService.initializePayment(
      //   merchant.email,
      //   transaction.amount,
      //   `txn-${transaction.id}`
      // );

      // if (!paymentInit)
      //   throw new InternalServerException(
      //     ErrorMessages.AD_PAYMENT_INITIALIZATION_FAILED
      //   );

      return {
        // authorization_url: paymentInit.data.authorization_url,
        // access_code: paymentInit.data.access_code,
        reference: paystackReference,
        transactionId: transaction.id,
      };
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_PAYMENT_INITIALIZATION_FAILED, error);
      throw new InternalServerException(
        ErrorMessages.AD_PAYMENT_INITIALIZATION_FAILED
      );
    }
  }

  async verifyAdPayment(reference: string) {
    try {
      // Verify payment
      const transactionId = reference.replace("txn-", "");
      const transaction =
        await this.transactionRepository.getTransaction(transactionId);
      if (!transaction)
        throw new BadRequestException(ErrorMessages.TRANSACTION_NOT_FOUND);

      const verification = await this.paymentService.verifyPayment(reference);
      if (!verification || !verification.data)
        throw new BadRequestException(
          ErrorMessages.PAYMENT_VERIFICATION_FAILED
        );

      if (verification.data.status === "success") {
        const updatedTransaction = await this.transactionRepository.update(
          transactionId,
          {
            status: PaymentStatus.SUCCESS,
          }
        );

        if (transaction.for === PaymentFor.ADVERTISEMENT) {
          const ad = await this.adRepository.getAd(transaction.reference);
          if (!ad) throw new BadRequestException(ErrorMessages.AD_NOT_FOUND);

          // specify nigeria timezone
          const todayNigeria = moment.tz("Africa/Lagos");
          const expiresAt = todayNigeria
            .add(AdTimeLine[ad.level as keyof typeof AdTimeLine], "day")
            .toDate();
          await this.adRepository.update(transaction.reference, {
            expiresAt,
            paidFor: true,
          });

          // Get the product and merchant
          const product = await this.adRepository.getProductForAd(ad.id);
          if (product && product.merchant) {
            const merchant = product.merchant;

            // Check if merchant was registered less than 6 months ago
            const merchantCreatedAt = moment(merchant.createdAt).tz(
              "Africa/Lagos"
            );
            const sixMonthsAgo = todayNigeria.clone().subtract(6, "months");

            if (merchantCreatedAt.isAfter(sixMonthsAgo)) {
              // Only calculate earnings if merchant is less than 6 months old
              await this.marketerService.calculateAndRecordEarnings(ad.id);
              this.logger.info(`Calculated marketer earnings for ad: ${ad.id}`);
            } else {
              this.logger.info(
                `Skipped marketer earnings for ad: ${ad.id} - merchant registered more than 6 months ago`
              );
            }
          }
        }
        return updatedTransaction;
      }

      return transaction;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_PAYMENT_VERIFICATION_FAILED, error);
      throw new InternalServerException(
        ErrorMessages.AD_PAYMENT_VERIFICATION_FAILED
      );
    }
  }

  async getAllAds() {
    try {
      const ads = await this.adRepository.getAds();
      return ads;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_FETCH_FAILED, error);
      throw new InternalServerException(ErrorMessages.AD_FETCH_FAILED);
    }
  }
  async getAdsByMerchant(merchantId: string) {
    try {
      const ads = await this.adRepository.getAdsByMerchantId(merchantId);
      return ads;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_FETCH_FAILED, error);
      throw new InternalServerException(ErrorMessages.AD_FETCH_FAILED);
    }
  }

  async getAllFilteredAds(filters: { marketId?: string; merchantId?: string }) {
    try {
      const ads = await this.adRepository.getAllFilteredAds(filters);
      return ads;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_FETCH_FAILED, error);
      throw new InternalServerException(ErrorMessages.AD_FETCH_FAILED);
    }
  }

  async getFilteredAds(filters: { marketId?: string; merchantId?: string }) {
    try {
      const ads = await this.adRepository.getFilteredAds(filters);
      return ads;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_FETCH_FAILED, error);
      throw new InternalServerException(ErrorMessages.AD_FETCH_FAILED);
    }
  }

  async getAd(adId: string) {
    try {
      const ad = await this.adRepository.getAd(adId);
      return ad;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_FETCH_FAILED, error);
      throw new InternalServerException(ErrorMessages.AD_FETCH_FAILED);
    }
  }
  async getAdByProduct(productId: string) {
    try {
      const ad = await this.adRepository.getAdByProductId(productId);
      return ad;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(ErrorMessages.AD_FETCH_FAILED, error);
      throw new InternalServerException(ErrorMessages.AD_FETCH_FAILED);
    }
  }
  async incrementAdViews(adId: string): Promise<void> {
    try {
      await this.adRepository.incrementViews(adId);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error("Failed to increment ad views", error);
      throw new InternalServerException("Failed to increment ad views");
    }
  }

  async incrementAdClicks(adId: string): Promise<void> {
    try {
      await this.adRepository.incrementClicks(adId);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error("Failed to increment ad clicks", error);
      throw new InternalServerException("Failed to increment ad clicks");
    }
  }
}
