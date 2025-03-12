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

export class AdService {
  constructor(
    private readonly adRepository: AdRepository,
    private readonly paymentService: PaystackPaymentRepository,
    private readonly productRepository: ProductRepository,
    private readonly transactionRepository: TransactionRepository,
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

      const paymentInit = await this.paymentService.initializePayment(
        merchant.email,
        transaction.amount,
        `txn-${transaction.id}`
      );

      if (!paymentInit)
        throw new InternalServerException(
          ErrorMessages.AD_PAYMENT_INITIALIZATION_FAILED
        );

      return {
        authorization_url: paymentInit.data.authorization_url,
        reference: paymentInit.data.reference,
        access_code: paymentInit.data.access_code,
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

          const expiresAt = new Date(
            Date.now() + AdTimeLine[ad.level as keyof typeof AdTimeLine]
          );
          await this.adRepository.update(transaction.reference, {
            expiresAt,
            paidFor: true,
          });
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
}
