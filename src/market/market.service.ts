import { Prisma } from "@prisma/client";
import { ErrorMessages } from "../constants/error-messages.enum";
import { MarketRepository } from "../repositories/market.repository";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { NotFoundException } from "../utils/exceptions/not-found.exception";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { MarketCreateDto } from "./dtos/market-create.dto";
import { MarketUpdateDto } from "./dtos/market-update.dto";
import { BadRequestException } from "../utils/exceptions/bad-request.exception";
import { BaseException } from "../utils/exceptions/base.exception";

export class MarketService {
  constructor(
    private readonly marketRepository: MarketRepository,
    private readonly logger: WinstonLogger
  ) {}

  async createMarket(market: MarketCreateDto, file?: Express.Multer.File) {
    try {
      // Check if Market Exists
      const marketExists = await this.marketRepository.findByName(market.name);
      if (marketExists) {
        throw new BadRequestException(ErrorMessages.MARKET_ALREADY_EXISTS);
      }
      const MarketTransformed: Prisma.MarketCreateInput = {
        ...market,
        isMall: market.isMall === "true" ? true : false,
      };
      if (file) {
        MarketTransformed.displayImage = file.path;
      }
      const createdMarket =
        await this.marketRepository.createMarket(MarketTransformed);
      this.logger.debug(`Market created successfully: ${createdMarket.id}`);
      return createdMarket;
    } catch (e) {
      if (e instanceof BaseException) throw e;
      this.logger.error(`${ErrorMessages.CREATE_MARKET_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.CREATE_MARKET_FAILED);
    }
  }

  async findMarkets() {
    try {
      const markets = await this.marketRepository.findAllMarkets();
      return markets;
    } catch (e) {
      this.logger.error(`${ErrorMessages.GET_MARKETS_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.GET_MARKETS_FAILED);
    }
  }

  async findAllMalls() {
    try {
      const malls = await this.marketRepository.findAllMalls();
      return malls;
    } catch (e) {
      this.logger.error(`${ErrorMessages.GET_MALLS_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.GET_MALLS_FAILED);
    }
  }

  async findMarketNames() {
    try {
      const names = await this.marketRepository.findNames();
      return names;
    } catch (e) {
      this.logger.error(`${ErrorMessages.GET_MARKET_NAMES_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.GET_MARKET_NAMES_FAILED);
    }
  }

  async getMarketById(id: string) {
    try {
      const market = await this.marketRepository.findById(id);
      console.log("market", market);
      if (!market) {
        throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
      }
      return market;
    } catch (e) {
      this.logger.error(`${ErrorMessages.GET_MARKET_BY_ID_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.GET_MARKET_BY_ID_FAILED);
    }
  }

  async getMarketByName(name: string) {
    try {
      const market = await this.marketRepository.findByName(name);
      if (!market) {
        throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
      }
      return market;
    } catch (e) {
      this.logger.error(`${ErrorMessages.GET_MARKET_BY_NAME_FAILED}: ${e}`);
      throw new InternalServerException(
        ErrorMessages.GET_MARKET_BY_NAME_FAILED
      );
    }
  }

  async updateMarket(
    marketId: string,
    marketUpdateDto: MarketUpdateDto,
    file?: Express.Multer.File
  ) {
    try {
      if (file) {
        (marketUpdateDto as Prisma.MarketUpdateInput).displayImage = file.path;
      }
      const updatedMarket = await this.marketRepository.updateMarket(
        marketId,
        marketUpdateDto
      );
      return updatedMarket;
    } catch (e) {
      this.logger.error(`${ErrorMessages.UPDATE_MARKET_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.UPDATE_MARKET_FAILED);
    }
  }

  async deleteMarket(marketId: string) {
    try {
      await this.marketRepository.deleteMarket(marketId);
      return true;
    } catch (e) {
      this.logger.error(`${ErrorMessages.DELETE_MARKET_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.DELETE_MARKET_FAILED);
    }
  }

  async deleteAllMarkets() {
    try {
      await this.marketRepository.deleteAllMarkets();
      return true;
    } catch (e) {
      this.logger.error(`${ErrorMessages.DELETE_MARKET_FAILED}: ${e}`);
      throw new InternalServerException(ErrorMessages.DELETE_MARKET_FAILED);
    }
  }
}
