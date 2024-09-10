import { CartProduct, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { databaseService } from "../utils/database";

export class CartProductRepository {
    private readonly cartProductDelegate: Prisma.CartProductDelegate<DefaultArgs>;

    constructor() {
        this.cartProductDelegate = databaseService.cartProduct;
    }



    getCart(customerId: string): Promise<CartProduct[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const cart = await this.cartProductDelegate.findMany({ where: { customerId } });
                resolve(cart);
            } catch (e) {
                reject(e)
            }
        })
    }

    update(customerId: string, productId: string, data: Prisma.CartProductCreateInput): Promise<CartProduct[]> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.cartProductDelegate.update({ where: { productId_customerId: { customerId, productId } }, data });
                const cart = this.getCart(customerId);
                resolve(cart);
            } catch (e) {
                reject(e)
            }
        })
    }

    removefromCart(productId: string, customerId: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.cartProductDelegate.delete({ where: { productId_customerId: { productId, customerId } } });
                resolve(true);
            } catch (e) {
                reject(e);
            }
        })
    }
}