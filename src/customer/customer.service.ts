import { Customer, Prisma } from "@prisma/client";
import { CustomerRepository } from "../repositories/customer.repository";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { NotFoundException } from "../utils/exceptions/not-found.exception";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { CustomerUpdateDto } from "./dtos/customer-update.dto";
import { AddressRepository } from "../repositories/address.repository";
import { PhoneNumberRepository } from "../repositories/phone-number.repository";
import { DataFormatterHelper } from "../helpers/format.helper";
import { UnauthorizedException } from "../utils/exceptions/unauthorized.exception";
import { ErrorMessages } from "../constants/error-messages.enum";
import { MarketerRepository } from "../repositories/marketer.repository";
import { MerchantRepository } from "../repositories/merchant.repository";
import { MarketerEarningsRepository } from "../repositories/marketer-earnings.repository";

export class CustomerService {
  private readonly customerRepository: CustomerRepository;
  private readonly addressRepository: AddressRepository;
  private readonly phoneNumberRepository: PhoneNumberRepository;
  private readonly marketerRepository: MarketerRepository;
  private readonly merchantRepository: MerchantRepository;
  private readonly marketerEarningsRepository: MarketerEarningsRepository;
  private readonly logger: WinstonLogger;

  constructor(
    customerRepository: CustomerRepository,
    marketerRepository: MarketerRepository,
    merchantRepository: MerchantRepository,
    marketerEarningsRepository: MarketerEarningsRepository,
    addressRepository: AddressRepository,
    phoneNumberRepository: PhoneNumberRepository,
    logger: WinstonLogger
  ) {
    this.customerRepository = customerRepository;
    this.addressRepository = addressRepository;
    this.phoneNumberRepository = phoneNumberRepository;
    this.logger = logger;
    this.marketerRepository = marketerRepository;
    this.merchantRepository = merchantRepository;
    this.marketerEarningsRepository = marketerEarningsRepository;
  }

  async getCustomerById(id: string): Promise<Customer> {
    try {
      const customer = await this.customerRepository.getCustomerById(id);
      if (!customer) {
        throw new NotFoundException("Customer not found");
      }
      return customer;
    } catch (e) {
      this.logger.error(`Error getting customer by id: ${e}`);
      throw new InternalServerException("Error getting customer by id");
    }
  }

  async updateCustomer(
    customerId: string,
    customerUpdateDto: CustomerUpdateDto
  ): Promise<Customer> {
    try {
      const {
        phoneNumbers,
        addresses,
        dateOfBirth,
        lastName,
        firstName,
        email,
      } = customerUpdateDto;
      let customer: Prisma.CustomerUpdateInput = {};
      // Update Date of Birth
      if (dateOfBirth) {
        customer.dateOfBirth = DataFormatterHelper.formatDate(dateOfBirth);
      }
      if (email) {
        const emailInstance =
          await this.customerRepository.getCustomerByEmail(email);
        if (emailInstance && emailInstance.id !== customerId) {
          throw new UnauthorizedException(ErrorMessages.EMAIL_EXISTS);
        }
        customer.email = email;
        customer.emailVerifiedAt = null;
        customer.googleId = null;
      }
      // Set firstName and LastName
      customer.firstName = firstName;
      customer.lastName = lastName;

      // Update Phone Numbers
      if (phoneNumbers) {
        const mappedPhoneNumbers =
          DataFormatterHelper.formatPhoneNumbers(phoneNumbers);
        await this.phoneNumberRepository.deleteCustomerNumbers(customerId);
        await this.phoneNumberRepository.createCustomerPhoneNumbers(
          customerId,
          mappedPhoneNumbers
        );
      }

      // Update Addresses
      if (addresses) {
        await Promise.all(
          addresses.map(async (address) => {
            const addressInstance =
              await this.addressRepository.getUniqueByCustomerId(
                address.name,
                customerId
              );
            if (addressInstance) {
              await this.addressRepository.updateByCustomerId(
                address.name,
                customerId,
                address
              );
            } else {
              await this.addressRepository.createCustomerAddress(
                customerId,
                address
              );
            }
          })
        );
      }

      // Update The Customer
      const updatedCustomer = await this.customerRepository.update(
        customerId,
        customer
      );
      return updatedCustomer;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      this.logger.error(`Error updating customer: ${e}`);
      throw new InternalServerException("Error updating customer");
    }
  }

  async deleteCustomer(customerId: string): Promise<boolean> {
    try {
      await this.customerRepository.delete(customerId);
      return true;
    } catch (e) {
      this.logger.error(`Error deleting customer: ${e}`);
      throw new InternalServerException("Error deleting customer");
    }
  }

  async getMarketerByCustomerEmail(email: string) {
    try {
      const marketer = await this.marketerRepository.getMarketerByEmail(email);
      if (!marketer) {
        throw new NotFoundException(
          "No marketer profile found for this customer"
        );
      }
      return marketer;
    } catch (error) {
      this.logger.error(`Failed to get marketer by customer email: ${error}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerException("Failed to get marketer profile");
    }
  }

  async getMarketerReferrals(marketerId: string) {
    try {
      // Get all merchants referred by this marketer
      const referredMerchants =
        await this.merchantRepository.getMerchantsByReferrerId(marketerId);

      if (!referredMerchants || referredMerchants.length === 0) {
        return [];
      }

      // For each merchant, calculate the paid and unpaid earnings
      const merchantsWithProfits = await Promise.all(
        referredMerchants.map(async (merchant) => {
          // Get all earnings for this merchant referred by this marketer
          const earnings =
            await this.marketerEarningsRepository.getEarningsByMerchantAndMarketer(
              merchant.id,
              marketerId
            );

          // Calculate paid and unpaid amounts
          const profits = {
            paid: earnings
              .filter((earning) => earning.paid)
              .reduce((sum, earning) => sum + earning.amount, 0),
            unpaid: earnings
              .filter((earning) => !earning.paid)
              .reduce((sum, earning) => sum + earning.amount, 0),
          };

          // Return merchant with profits information
          return {
            ...this.filterMerchantPublicInfo(merchant),
            profits,
          };
        })
      );

      return merchantsWithProfits;
    } catch (error) {
      this.logger.error(`Failed to get marketer referrals: ${error}`);
      throw new InternalServerException("Failed to get marketer referrals");
    }
  }

  // Helper method to filter merchant public information
  private filterMerchantPublicInfo(merchant: any) {
    const {
      password,
      emailVerificationCode,
      passwordResetCode,
      refreshToken,
      ...publicInfo
    } = merchant;

    return publicInfo;
  }
}
