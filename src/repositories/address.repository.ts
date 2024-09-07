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

    update(id: string, data: Prisma.AddressUpdateInput): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const updatedAddress = await this.addressDelegate.update({ where: { id }, data });
                resolve(updatedAddress);
            } catch (e) {
                reject(e);
            }
        });
    }

    delete(id: string): Promise<Address> {
        return new Promise(async (resolve, reject) => {
            try {
                const deletedAddress = await this.addressDelegate.delete({ where: { id } });
                resolve(deletedAddress);
            } catch (e) {
                reject(e);
            }
        });
    }

    getByCustomerId(customerId: string): Promise<Address[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const addresses = await this.addressDelegate.findMany({ where: { customerId } });
                resolve(addresses);
            } catch (e) {
                reject(e);
            }
        });
    }

    getByMarketId(marketId: string): Promise<Address[]> {
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