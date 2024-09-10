import { Address, Prisma } from "@prisma/client";

export interface IAddressRepository {
    createCustomerAddress( customerId: string, address: Prisma.AddressCreateInput): Promise<Address>;
    createMarketAddress(marketId: string, address: Prisma.AddressCreateInput): Promise<Address>;
    updateByCustomerId(name: string, customerId: string, data: Prisma.AddressUpdateInput): Promise<Address>;
    updateByMarketId(name: string, marketId: string, data: Prisma.AddressUpdateInput): Promise<Address>;
    deleteCustomerAddress(name: string, customerId: string): Promise<Address>;
    deleteMarketAddress(name: string, marketId: string): Promise<Address>;
    getCustomerAddress(customerId: string): Promise<Address[]>;
    getMarketAddress(marketId: string): Promise<Address[]>;
}