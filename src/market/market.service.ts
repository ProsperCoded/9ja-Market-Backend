import { Prisma } from "@prisma/client";
import { ErrorMessages } from "../constants/error-messages.enum";
import { DataFormatterHelper } from "../helpers/format.helper";
import { AddressRepository } from "../repositories/address.repository";
import { MarketRepository } from "../repositories/market.repository";
import { PhoneNumberRepository } from "../repositories/phone-number.repository";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { NotFoundException } from "../utils/exceptions/not-found.exception";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { MarketUpdateDto } from "./dtos/market-update.dto";

export class MarketService {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly addressRepository: AddressRepository,
        private readonly phoneNumberRepository: PhoneNumberRepository,
        private readonly logger: WinstonLogger
    ) { }

    async getMarketById(id: string) {
        try {
            const market = await this.marketRepository.getMarketById(id);
            if (!market) {
                throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
            }
            return market;
        } catch (e) {
            this.logger.error(`${ErrorMessages.GET_MARKET_BY_ID_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.GET_MARKET_BY_ID_FAILED);
        }
    }

    async updateMarket(marketId: string, marketUpdateDto: MarketUpdateDto) {
        try {
            const { phoneNumbers, addresses, brandName } = marketUpdateDto;
            let market: Prisma.MarketUpdateInput = {};
            // Update Brand Name
            if (brandName) {
                market.brandName = brandName;
            }

            // Update Phone Numbers
            if (phoneNumbers) {
                const mappedPhoneNumbers = DataFormatterHelper.formatPhoneNumbers(phoneNumbers);
                await this.phoneNumberRepository.deleteMarketNumbers(marketId);
                await this.phoneNumberRepository.createPhoneNumbers(mappedPhoneNumbers);
            }

            // Update Addresses
            if (addresses) {
                addresses.map(async (address) => {
                    const addressInstance = await this.addressRepository.getUniqueByMarketId(address.name, marketId);
                    if (addressInstance) {
                        await this.addressRepository.updateByMarketId(address.name, marketId, address);
                    } else {
                        await this.addressRepository.createMarketAddress(marketId, address);
                    }
                })
            }

            const updatedMarket = await this.marketRepository.update(marketId, market);
            return updatedMarket;
        } catch (e) {
            this.logger.error(`${ErrorMessages.UPDATE_MARKET_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.UPDATE_MARKET_FAILED);
        }
    }

    async deleteMarket(marketId: string) {
        try {
            await this.marketRepository.delete(marketId);
            return true;
        } catch (e) {
            this.logger.error(`${ErrorMessages.DELETE_MARKET_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.DELETE_MARKET_FAILED);
        }
    }
}