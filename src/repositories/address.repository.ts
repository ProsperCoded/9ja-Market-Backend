import { Address, Prisma } from "@prisma/client";
import { IAddressRepository } from "./interfaces/address.repository.interface";
import { databaseService } from "../utils/database";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class AddressRepository implements IAddressRepository {
    private readonly addressDelegate: Prisma.AddressDelegate<DefaultArgs>;

    constructor() {
        this.addressDelegate = databaseService.address;
    }

    createCustomerAddress(customerId: string, address: Prisma.AddressCreateInput): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const createdAddress = await this.addressDelegate.create({
                    data: {
                        ...address,
                        customer: {
                            connect: {
                                id: customerId
                            }
                        }
                    }
                });
                resolve(createdAddress);
            } catch (e) {
                reject(e);
            }
        });
    }

    createMarketAddress(marketId: string, address: Prisma.AddressCreateInput): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const createdAddress = await this.addressDelegate.create({
                    data: {
                        ...address,
                        market: {
                            connect: {
                                id: marketId
                            }
                        }
                    }
                });
                resolve(createdAddress);
            } catch (e) {
                reject(e);
            }
        });
    }


    getUniqueByCustomerId(name: string, customerId: string): Promise<Address | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const address = await this.addressDelegate.findUnique({ where: { name_customerId: { name, customerId } } });
                resolve(address)
            } catch (e) {
                reject(e);
            }
        });
    }

    getUniqueByMarketId(name: string, marketId: string): Promise<Address | null> {
        return new Promise(async (resolve, reject) => {
            try {
                const address = await this.addressDelegate.findUnique({ where: { name_marketId: { name, marketId } } });
                resolve(address)
            } catch (e) {
                reject(e)
            }
        })
    }

    updateByCustomerId(name: string, customerId: string, data: Prisma.AddressUpdateInput): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const updatedAddress = await this.addressDelegate.update({ where: { name_customerId: { name, customerId } }, data });
                resolve(updatedAddress);
            } catch (e) {
                reject(e);
            }
        });
    }

    updateByMarketId(name: string, marketId: string, data: Prisma.AddressUpdateInput): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const updatedAddress = await this.addressDelegate.update({ where: { name_marketId: { name, marketId } }, data });
                resolve(updatedAddress);
            } catch (e) {
                reject(e)
            }
        })
    }

    deleteCustomerAddress(name: string, customerId: string): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const deletedAddress = await this.addressDelegate.delete({ where: { name_customerId: { name, customerId } } });
                resolve(deletedAddress);
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteMarketAddress(name: string, marketId: string): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const deletedAddress = await this.addressDelegate.delete({ where: { name_marketId: { name, marketId } } });
                resolve(deletedAddress);
            } catch (e) {
                reject(e);
            }
        });
    }

    getCustomerAddress(customerId: string): Promise<Address[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const addresses = await this.addressDelegate.findMany({ where: { customerId } });
                resolve(addresses);
            } catch (e) {
                reject(e);
            }
        });
    }

    getMarketAddress(marketId: string): Promise<Address[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const addresses = await this.addressDelegate.findMany({ where: { marketId } });
                resolve(addresses);
            } catch (e) {
                reject(e);
            }
        });
    }
}