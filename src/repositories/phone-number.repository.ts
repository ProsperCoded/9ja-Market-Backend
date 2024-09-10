import { PhoneNumber, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { databaseService } from "../utils/database";


export class PhoneNumberRepository {
    private readonly phoneNumberDelegate: Prisma.PhoneNumberDelegate<DefaultArgs>;

    constructor() {
        this.phoneNumberDelegate = databaseService.phoneNumber;
    }

    findCustomerPhoneNumbers(customerId: string): Promise<PhoneNumber[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const numbers = await this.phoneNumberDelegate.findMany({ where: { customerId } });
                resolve(numbers)
            } catch (e) {
                reject(e)
            }
        })
    }

    findMarketPhoneNumbers(marketId: string): Promise<PhoneNumber[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const numbers = await this.phoneNumberDelegate.findMany({ where: { marketId } });
                resolve(numbers)
            } catch (e) {
                reject(e)
            }
        })
    }

    createPhoneNumbers(phoneNumbers: Prisma.PhoneNumberCreateInput[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.phoneNumberDelegate.createMany({ data: phoneNumbers });
                resolve(true);
            } catch (e) {
                reject(e);
            }
        })
    }

    deleteCustomerNumbers(customerId: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.phoneNumberDelegate.deleteMany({ where: { customerId } });
                resolve(true);
            } catch (e) {
                reject(e)
            }
        })
    }

    deleteMarketNumbers(marketId: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.phoneNumberDelegate.deleteMany({ where: { marketId } });
                resolve(true);
            } catch (e) {
                reject(e)
            }
        })
    }
}