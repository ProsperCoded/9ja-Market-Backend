import { Market, Prisma } from "@prisma/client";
import { IMarketRepository } from "./interfaces/market.repository.interface";
import { databaseService } from "../utils/database";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class MarketRepository implements IMarketRepository {
    private readonly marketDelegate: Prisma.MarketDelegate<DefaultArgs>;

    constructor() {
        this.marketDelegate = databaseService.market;
    }

    findAll(): Promise<Market[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const markets = await this.marketDelegate.findMany();
                resolve(markets)
            } catch (e) {
                reject(e)
            }
        })
    }

    getMarketById(id: string, options: { products: boolean } = { products: false }): Promise<Market | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const market = await this.marketDelegate.findUnique({
                    where: { id },
                    include: {
                        addresses: true,
                        phoneNumbers: true,
                        products: options.products
                    }
                });
                resolve(market)
            } catch (e) {
                reject(e);
            }
        })
    }

    getMarketByEmail(email: string, options: { products: boolean } = { products: false }): Promise<Market | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const market = await this.marketDelegate.findUnique({
                    where: { email },
                    include: {
                        addresses: true,
                        phoneNumbers: true,
                        products: options.products
                    }
                });
                resolve(market)
            } catch (e) {
                reject(e);
            }
        })
    }

    getMarketByBrandName(brandName: string, options: { products: boolean } = { products: false }): Promise<Market | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const market = await this.marketDelegate.findUnique({
                    where: { brandName },
                    include: {
                        addresses: true,
                        phoneNumbers: true,
                        products: options.products
                    }
                });
                resolve(market)
            } catch (e) {
                reject(e);
            }
        })
    }

    getMarketByGoogleId(googleId: string): Promise<Market | null>{
        return new Promise(async (resolve, reject) => {
            try {
                const market = await this.marketDelegate.findUnique({
                    where: { googleId },
                    include: {
                        addresses: true,
                        phoneNumbers: true,
                    }
                });
                resolve(market)
            } catch (e) {
                reject(e);
            }
        })
    }

    isEmailVerified(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const market = await this.marketDelegate.findUnique({ where: { id } });
                resolve(!!market?.emailVerifiedAt);
            } catch (e) {
                reject(e);
            }
        })
    }

    update(id: string, data: Prisma.MarketUpdateInput): Promise<Market> {
        return new Promise(async (resolve, reject) => {
            try {
                const market = await this.marketDelegate.update({
                    where: { id }, data,
                    include: {
                        addresses: true,
                        phoneNumbers: true
                    }
                });
                resolve(market)
            } catch (e) {
                reject(e);
            }
        })
    }

    create(data: Prisma.MarketCreateInput, addresses: Prisma.AddressCreateManyMarketInput[] = [], phoneNumbers: Prisma.PhoneNumberCreateManyMarketInput[] = []): Promise<Market> {
        return new Promise(async (resolve, reject) => {
            try {
                const market = await this.marketDelegate.create({
                    data: {
                        ...data,
                        addresses: {
                            createMany: {
                                data: addresses
                            }
                        },
                        phoneNumbers: {
                            createMany: {
                                data: phoneNumbers
                            }
                        }
                    },
                    include: {
                        addresses: true,
                        phoneNumbers: true
                    }
                });
                resolve(market)
            } catch (e) {
                reject(e);
            }
        })
    }


    delete(id: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.marketDelegate.delete({ where: { id } });
                resolve(true)
            } catch (e) {
                reject(e);
            }
        })
    }
}