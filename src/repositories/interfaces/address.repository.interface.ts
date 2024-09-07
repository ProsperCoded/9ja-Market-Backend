import { Address, Prisma } from "@prisma/client";

export interface IAddressRepository {
    createCustomerAddress( customerId: string, address: Prisma.AddressCreateInput): Promise<Address>;
    createMarketAddress(marketId: string, address: Prisma.AddressCreateInput): Promise<Address>;
    update(id: string, data: Prisma.AddressUpdateInput): Promise<Address>;
    delete(id: string): Promise<Address>;
    getByCustomerId(customerId: string): Promise<Address[]>;
    getByMarketId(marketId: string): Promise<Address[]>;
}