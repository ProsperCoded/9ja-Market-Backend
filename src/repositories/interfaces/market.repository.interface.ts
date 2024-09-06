import { Market } from "@prisma/client";


export interface IMarketRepository {
    getMarketById(id: string): Promise<Market | null>;
    getMarketByEmail(email: string): Promise<Market | null>;
    getMarketByBrandName(brandName: string): Promise<Market | null>;
    isEmailVerified(id: string): Promise<boolean>;
}