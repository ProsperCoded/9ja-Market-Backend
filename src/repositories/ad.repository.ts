import { Ad, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { databaseService } from "../utils/database";

export class AdRepository {
  private readonly adDelegate: Prisma.AdDelegate<DefaultArgs>;
  constructor() {
    this.adDelegate = databaseService.ad;
  }

  create(data: Prisma.AdCreateInput): Promise<Ad> {
    return new Promise(async (resolve, reject) => {
      try {
        const ad = await this.adDelegate.create({
          data,
        });
        resolve(ad);
      } catch (e) {
        reject(e);
      }
    });
  }

  getAd(adId: string): Promise<Ad | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const ad = await this.adDelegate.findUnique({
          where: { id: adId },
          include: { product: true },
        });
        resolve(ad);
      } catch (e) {
        reject(e);
      }
    });
  }

  getAdByProductId(productId: string): Promise<Ad | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const ad = await this.adDelegate.findFirst({
          where: { productId, paidFor: true },
        });
        resolve(ad);
      } catch (e) {
        reject(e);
      }
    });
  }

  getFreeAd(productId: string): Promise<Ad | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const ad = await this.adDelegate.findFirst({
          where: { level: 0, product: { id: productId } },
        });
        resolve(ad);
      } catch (e) {
        reject(e);
      }
    });
  }

  getAds(): Promise<Ad[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const ads = await this.adDelegate.findMany({
          include: {
            product: true,
          },
        });
        resolve(ads);
      } catch (e) {
        reject(e);
      }
    });
  }

  getAdsByProductId(productId: string): Promise<Ad[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const ads = await this.adDelegate.findMany({ where: { productId } });
        resolve(ads);
      } catch (e) {
        reject(e);
      }
    });
  }

  getAdsByMerchantId(merchantId: string): Promise<Ad[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const ads = await this.adDelegate.findMany({
          where: { product: { merchantId } },
        });
        resolve(ads);
      } catch (e) {
        reject(e);
      }
    });
  }

  update(adId: string, data: Prisma.AdUpdateInput): Promise<Ad> {
    return new Promise(async (resolve, reject) => {
      try {
        const ad = await this.adDelegate.update({ where: { id: adId }, data });
        resolve(ad);
      } catch (e) {
        reject(e);
      }
    });
  }

  getFilteredAds(filters: {
    marketId?: string;
    merchantId?: string;
  }): Promise<Ad[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const where: any = { paidFor: true };

        if (filters.merchantId) {
          where.product = {
            ...where.product,
            merchantId: filters.merchantId,
          };
        }

        if (filters.marketId) {
          where.product = {
            ...where.product,
            merchant: {
              marketId: filters.marketId,
            },
          };
        }

        const ads = await this.adDelegate.findMany({
          where,
          include: {
            product: {
              include: {
                displayImage: true,
                images: true,
              },
            },
          },
        });
        resolve(ads);
      } catch (e) {
        reject(e);
      }
    });
  }

  async incrementViews(adId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.adDelegate.update({
          where: { id: adId },
          data: {
            adViews: {
              increment: 1,
            },
          },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  async incrementClicks(adId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.adDelegate.update({
          where: { id: adId },
          data: {
            adClicks: {
              increment: 1,
            },
          },
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
