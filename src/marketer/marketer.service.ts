import { Marketer, Prisma, Role } from "@prisma/client";
import { MarketerEnum } from "../constants/marketer.enum";
import { MarketerCreateDto } from "./dtos/marketer-create.dto";
import { MarketerUpdateDto } from "./dtos/marketer-update.dto";
import { MarketerRepository } from "../repositories/marketer.repository";
import { MarketerEarningsRepository } from "../repositories/marketer-earnings.repository";
import { BadRequestException } from "../utils/exceptions/bad-request.exception";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { NotFoundException } from "../utils/exceptions/not-found.exception";
import { BaseException } from "../utils/exceptions/base.exception";
import { ILogger } from "../utils/logger/logger.interface";
import { AdRepository } from "../repositories/ad.repository";
import { EmailService } from "../utils/email/email.service";
import { EmailSubjects, EmailPaths } from "../constants/email.enum";
import { CustomerRepository } from "../repositories/customer.repository";

export class MarketerService {
  private emailService: EmailService;

  constructor(
    private readonly marketerRepository: MarketerRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly marketerEarningsRepository: MarketerEarningsRepository,
    private readonly adRepository: AdRepository,
    private readonly logger: ILogger
  ) {
    this.emailService = new EmailService();
  }

  async createMarketer(
    marketerData: MarketerCreateDto,
    identityCredentialImage?: string
  ): Promise<Marketer> {
    try {
      // Check if email exists
      const emailExists = await this.marketerRepository.getMarketerByEmail(
        marketerData.email
      );
      if (emailExists) {
        throw new BadRequestException("Email already exists");
      }

      // Check if username exists
      const usernameExists =
        await this.marketerRepository.getMarketerByUsername(
          marketerData.username
        );
      if (usernameExists) {
        throw new BadRequestException("Username already exists");
      }

      // Check if email exists in Customer table and update role if it does
      const customerWithSameEmail =
        await this.customerRepository.getCustomerByEmail(marketerData.email);
      if (customerWithSameEmail) {
        // Update customer role to MARKETER
        await this.customerRepository.update(customerWithSameEmail.id, {
          role: Role.MARKETER,
        });
        this.logger.info(
          `Updated customer role to MARKETER for email: ${marketerData.email}`
        );
      }

      const marketerInput: Prisma.MarketerCreateInput = {
        ...marketerData,
        IdentityCredentialImage: identityCredentialImage || "",
      };

      const marketer =
        await this.marketerRepository.createMarketer(marketerInput);

      // Send registration confirmation email
      await this.sendRegistrationEmail(marketer);
      return marketer;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error("Failed to create marketer", error);
      throw new InternalServerException("Failed to create marketer");
    }
  }

  async getAllMarketers(): Promise<Marketer[]> {
    try {
      const marketers = await this.marketerRepository.getAllMarketers();
      return marketers;
    } catch (error) {
      this.logger.error("Failed to get marketers", error);
      throw new InternalServerException("Failed to get marketers");
    }
  }

  async getAllMarketersWithEarnings(): Promise<any[]> {
    try {
      // Get all marketers
      const marketers = await this.marketerRepository.getAllMarketers();

      // Get earnings for each marketer
      const marketersWithEarnings = await Promise.all(
        marketers.map(async (marketer) => {
          const totalPaidEarnings =
            await this.marketerEarningsRepository.getTotalPaidEarningsByMarketer(
              marketer.id
            );
          const totalUnpaidEarnings =
            await this.marketerEarningsRepository.getTotalUnpaidEarningsByMarketer(
              marketer.id
            );

          return {
            ...marketer,
            earnings: {
              paid: totalPaidEarnings,
              unpaid: totalUnpaidEarnings,
            },
          };
        })
      );

      return marketersWithEarnings;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error("Failed to get marketers with earnings", error);
      throw new InternalServerException(
        "Failed to get marketers with earnings"
      );
    }
  }

  async getMarketerById(id: string) {
    try {
      const marketer =
        await this.marketerRepository.getMarketerWithReferredMerchants(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }
      return marketer;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(`Failed to get marketer by ID: ${id}`, error);
      throw new InternalServerException("Failed to get marketer");
    }
  }

  async getMarketerByReferrerCode(referrerCode: string) {
    try {
      const marketer =
        await this.marketerRepository.getMarketerByReferrerCode(referrerCode);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }
      return marketer;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(
        `Failed to get marketer by referrer code: ${referrerCode}`,
        error
      );
      throw new InternalServerException("Failed to get marketer");
    }
  }

  async getMarketerByUsername(username: string) {
    try {
      const marketer =
        await this.marketerRepository.getMarketerByUsername(username);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }
      return marketer;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(
        `Failed to get marketer by username: ${username}`,
        error
      );
      throw new InternalServerException("Failed to get marketer");
    }
  }

  async updateMarketer(
    id: string,
    marketerData: MarketerUpdateDto,
    identityCredentialImage?: string
  ): Promise<Marketer> {
    try {
      // Check if marketer exists
      const marketer = await this.marketerRepository.getMarketerById(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }

      // Check if email is unique if provided
      if (marketerData.email) {
        const emailExists = await this.marketerRepository.getMarketerByEmail(
          marketerData.email
        );
        if (emailExists && emailExists.id !== id) {
          throw new BadRequestException("Email already exists");
        }
      }

      // Check if username is unique if provided
      if (marketerData.username) {
        const usernameExists =
          await this.marketerRepository.getMarketerByUsername(
            marketerData.username
          );
        if (usernameExists && usernameExists.id !== id) {
          throw new BadRequestException("Username already exists");
        }
      }

      const updateData: Prisma.MarketerUpdateInput = {
        ...marketerData,
      };

      if (identityCredentialImage) {
        updateData.IdentityCredentialImage = identityCredentialImage;
      }

      const updatedMarketer = await this.marketerRepository.updateMarketer(
        id,
        updateData
      );
      return updatedMarketer;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(`Failed to update marketer: ${id}`, error);
      throw new InternalServerException("Failed to update marketer");
    }
  }

  async verifyMarketer(id: string): Promise<Marketer> {
    try {
      // Check if marketer exists
      const marketer = await this.marketerRepository.getMarketerById(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }

      const verifiedMarketer = await this.marketerRepository.verifyMarketer(id);

      // Send verification success email with referral code
      await this.sendVerificationSuccessEmail(verifiedMarketer);

      return verifiedMarketer;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(`Failed to verify marketer: ${id}`, error);
      throw new InternalServerException("Failed to verify marketer");
    }
  }

  async deleteMarketer(id: string): Promise<void> {
    try {
      // Check if marketer exists
      const marketer = await this.marketerRepository.getMarketerById(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }

      await this.marketerRepository.deleteMarketer(id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(`Failed to delete marketer: ${id}`, error);
      throw new InternalServerException("Failed to delete marketer");
    }
  }

  async getMarketerEarnings(id: string) {
    try {
      // Check if marketer exists
      const marketer = await this.marketerRepository.getMarketerById(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }

      const earnings =
        await this.marketerEarningsRepository.getEarningsByMarketer(id);
      const totalEarnings =
        await this.marketerEarningsRepository.getTotalEarningsByMarketer(id);

      return {
        earnings,
        totalEarnings,
      };
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(`Failed to get marketer earnings: ${id}`, error);
      throw new InternalServerException("Failed to get marketer earnings");
    }
  }

  async getMarketerPaidEarnings(id: string) {
    try {
      // Check if marketer exists
      const marketer = await this.marketerRepository.getMarketerById(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }

      const earnings =
        await this.marketerEarningsRepository.getPaidEarningsByMarketer(id);
      const totalPaidEarnings =
        await this.marketerEarningsRepository.getTotalPaidEarningsByMarketer(
          id
        );

      return {
        earnings,
        totalPaidEarnings,
      };
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(`Failed to get marketer paid earnings: ${id}`, error);
      throw new InternalServerException("Failed to get marketer paid earnings");
    }
  }

  async getMarketerUnpaidEarnings(id: string) {
    try {
      // Check if marketer exists
      const marketer = await this.marketerRepository.getMarketerById(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }

      const earnings =
        await this.marketerEarningsRepository.getUnpaidEarningsByMarketer(id);
      const totalUnpaidEarnings =
        await this.marketerEarningsRepository.getTotalUnpaidEarningsByMarketer(
          id
        );

      return {
        earnings,
        totalUnpaidEarnings,
      };
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(`Failed to get marketer unpaid earnings: ${id}`, error);
      throw new InternalServerException(
        "Failed to get marketer unpaid earnings"
      );
    }
  }

  async markEarningsAsPaid(id: string) {
    try {
      // Check if marketer exists
      const marketer = await this.marketerRepository.getMarketerById(id);
      if (!marketer) {
        throw new NotFoundException("Marketer not found");
      }

      // Get unpaid earnings
      const unpaidEarnings =
        await this.marketerEarningsRepository.getUnpaidEarningsByMarketer(id);

      if (unpaidEarnings.length === 0) {
        return {
          message: "No unpaid earnings found for this marketer",
          markedAsPaid: 0,
          totalPaid: 0,
        };
      }

      // Mark all unpaid earnings as paid
      const markEarningsPromises = unpaidEarnings.map((earning) =>
        this.marketerEarningsRepository.updateEarning(earning.id, {
          paid: true,
        })
      );

      await Promise.all(markEarningsPromises);

      const totalPaid = unpaidEarnings.reduce(
        (sum, earning) => sum + earning.amount,
        0
      );

      this.logger.info(
        `Marked ${unpaidEarnings.length} earnings as paid for marketer: ${id}`
      );

      return {
        message: "Successfully marked all unpaid earnings as paid",
        markedAsPaid: unpaidEarnings.length,
        totalPaid,
      };
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(
        `Failed to mark earnings as paid for marketer: ${id}`,
        error
      );
      throw new InternalServerException("Failed to mark earnings as paid");
    }
  }

  async calculateAndRecordEarnings(adId: string): Promise<void> {
    try {
      // Get the ad
      const ad = await this.adRepository.getAd(adId);
      if (!ad || !ad.paidFor) {
        throw new BadRequestException("Ad not found or not paid for");
      }

      // Check if earnings were already calculated for this ad
      const existingEarning =
        await this.marketerEarningsRepository.getEarningByAd(adId);
      if (existingEarning) {
        // Earnings already calculated
        return;
      }

      // Get the product, merchant, and transaction details
      const product = await this.adRepository.getProductForAd(adId);
      if (!product || !product.merchant) {
        throw new BadRequestException("Product or merchant not found for ad");
      }

      // Check if merchant was referred by a marketer
      if (!product.merchant.referredById) {
        // Merchant was not referred by any marketer
        return;
      }

      // Get the transaction amount for the ad
      const transactionAmount =
        await this.adRepository.getAdTransactionAmount(adId);
      if (!transactionAmount) {
        throw new BadRequestException("Transaction not found for ad");
      }

      // Calculate the earnings (percentage of the ad cost)
      const earningsAmount =
        transactionAmount * MarketerEnum.AdPercentagePerReferral;

      // Record the earnings
      await this.marketerEarningsRepository.createEarning({
        marketerId: product.merchant.referredById,
        merchantId: product.merchant.id,
        AdId: adId,
        amount: earningsAmount,
      });

      this.logger.info(
        `Recorded marketer earnings of ${earningsAmount} for ad ${adId}`
      );
    } catch (error) {
      if (error instanceof BaseException) throw error;
      this.logger.error(
        `Failed to calculate and record earnings for ad: ${adId}`,
        error
      );
      throw new InternalServerException(
        "Failed to calculate marketer earnings"
      );
    }
  }

  private async sendRegistrationEmail(marketer: Marketer): Promise<void> {
    try {
      await this.emailService.sendMail({
        to: marketer.email,
        subject: EmailSubjects.MARKETER_REGISTRATION,
        options: {
          template: EmailPaths.MARKETER_REGISTRATION,
          data: {
            firstName: marketer.firstName,
            lastName: marketer.lastName,
            username: marketer.username,
          },
        },
      });
      this.logger.info(
        `Registration email sent to marketer: ${marketer.email}`
      );
    } catch (error) {
      // Just log the error, don't fail the whole operation
      this.logger.error(
        `Failed to send registration email to ${marketer.email}`,
        error
      );
    }
  }

  private async sendVerificationSuccessEmail(
    marketer: Marketer
  ): Promise<void> {
    try {
      await this.emailService.sendMail({
        to: marketer.email,
        subject: EmailSubjects.MARKETER_VERIFICATION_SUCCESS,
        options: {
          template: EmailPaths.MARKETER_VERIFICATION_SUCCESS,
          data: {
            firstName: marketer.firstName,
            lastName: marketer.lastName,
            username: marketer.username,
            referrerCode: marketer.referrerCode,
          },
        },
      });
      this.logger.info(
        `Verification success email sent to marketer: ${marketer.email}`
      );
    } catch (error) {
      // Just log the error, don't fail the whole operation
      this.logger.error(
        `Failed to send verification success email to ${marketer.email}`,
        error
      );
    }
  }
}
