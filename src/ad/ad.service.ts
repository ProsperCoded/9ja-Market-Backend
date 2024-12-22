import { Merchant, PaymentFor, PaymentStatus } from '@prisma/client';
import { AdPrices } from '../constants/ad-constants.enum';
import { ErrorMessages } from "../constants/error-messages.enum";
import { AdRepository } from "../repositories/ad.repository";
import { QuickTellerPaymentRepository } from "../repositories/payment.repository";
import { ProductRepository } from "../repositories/product.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BadRequestException } from "../utils/exceptions/bad-request.exception";
import { BaseException } from "../utils/exceptions/base.exception";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { ILogger } from "../utils/logger/logger.interface";
import { QuickTellerRequest } from './dtos/quickTeller-request.dto';


export class AdService {
    constructor(
        private readonly adRepository: AdRepository,
        private readonly paymentService: QuickTellerPaymentRepository,
        private readonly productRepository: ProductRepository,
        private readonly transactionRepository: TransactionRepository,
        private readonly logger: ILogger,
    ) { }

    async initializeAdPayment(level: keyof typeof AdPrices, productId: string, merchant: Merchant): Promise<QuickTellerRequest> {
        try {
            // Check if the product exists
            const product = await this.productRepository.getById(productId);
            if (!product) throw new BadRequestException(ErrorMessages.PRODUCT_NOT_FOUND);

            // Create a new Ad
            const ad = await this.adRepository.create(level, productId);
            // Create Transaction
            const transaction = await this.transactionRepository.create({
                amount: AdPrices[level],
                for: PaymentFor.ADVERTISEMENT,
                status: PaymentStatus.INITIALIZED,
                reference: ad.id
            }, merchant.id);

            const paymentRequest = new QuickTellerRequest(`txn-${transaction.id}`, transaction.amount);
            return paymentRequest;

        } catch (error) {
            if (error instanceof BaseException) throw error;
            this.logger.error(ErrorMessages.AD_PAYMENT_INITIALIZATION_FAILED, error);
            throw new InternalServerException(ErrorMessages.AD_PAYMENT_INITIALIZATION_FAILED);
        }
    }

    async verifyAdPayment(reference: string) {
        try {
            // Verify payment
            const transactionId = reference.split('-')[1];
            const transaction = await this.transactionRepository.getTransaction(transactionId);
            if (!transaction) throw new BadRequestException(ErrorMessages.TRANSACTION_NOT_FOUND);

            const verification = await this.paymentService.verifyPayment(reference, transaction.amount);
            if (!verification) throw new BadRequestException(ErrorMessages.PAYMENT_VERIFICATION_FAILED);
                


        } catch (error) {
            if (error instanceof BaseException) throw error;
            this.logger.error(ErrorMessages.AD_PAYMENT_VERIFICATION_FAILED, error);
            throw new InternalServerException(ErrorMessages.AD_PAYMENT_VERIFICATION_FAILED);
        }
    }
}