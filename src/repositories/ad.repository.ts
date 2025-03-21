import { Ad, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { PaymentFor, PaymentStatus } from "@prisma/client";
import moment from "moment-timezone";

export class AdRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Prisma.AdCreateInput): Promise<Ad> {
    return this.prisma.ad.create({
      data,
    });
  }

  async update(id: string, data: Prisma.AdUpdateInput): Promise<Ad> {
    return this.prisma.ad.update({
      where: {
        id,
      },
      data,
    });
  }

  async getAd(id: string): Promise<Ad | null> {
    return this.prisma.ad.findUnique({
      where: {
        id,
      },
    });
  }

  async getAdByProductId(productId: string): Promise<Ad | null> {
    return this.prisma.ad.findFirst({
      where: {
        productId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async getFreeAd(productId: string): Promise<Ad | null> {
    return this.prisma.ad.findFirst({
      where: {
        productId,
        level: 0,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  async getAds(): Promise<Ad[]> {
    return this.prisma.ad.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        product: {
          include: {
            merchant: {
              select: {
                id: true,
                brandName: true,
                email: true,
                marketId: true,
              },
            },
            displayImage: true,
          },
        },
      },
      orderBy: {
        level: "desc",
      },
    });
  }

  async getAdsByMerchantId(merchantId: string): Promise<Ad[]> {
    return this.prisma.ad.findMany({
      where: {
        product: {
          merchantId,
        },
      },
      include: {
        product: {
          include: {
            merchant: {
              select: {
                id: true,
                brandName: true,
                email: true,
                marketId: true,
              },
            },
            displayImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAllFilteredAds(filters: {
    marketId?: string;
    merchantId?: string;
  }): Promise<Ad[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const where: any = {};

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

        const ads = await this.prisma.ad.findMany({
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
  // * checks if validated and not expired
  getFilteredAds(filters: {
    marketId?: string;
    merchantId?: string;
  }): Promise<Ad[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const where: any = {
          paidFor: true,
          expiresAt: { gt: moment.tz("Africa/Lagos").toDate() },
        };

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

        const ads = await this.prisma.ad.findMany({
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

  async incrementViews(id: string): Promise<void> {
    await this.prisma.ad.update({
      where: { id },
      data: {
        adViews: {
          increment: 1,
        },
      },
    });
  }

  async incrementClicks(id: string): Promise<void> {
    await this.prisma.ad.update({
      where: { id },
      data: {
        adClicks: {
          increment: 1,
        },
      },
    });
  }

  async getProductForAd(adId: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id: adId },
      include: {
        product: {
          include: {
            merchant: {
              select: {
                id: true,
                email: true,
                referredById: true,
              },
            },
          },
        },
      },
    });

    return ad?.product;
  }

  async getAdTransactionAmount(adId: string): Promise<number | null> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        reference: adId,
        status: PaymentStatus.SUCCESS,
        for: PaymentFor.ADVERTISEMENT,
      },
    });

    return transaction?.amount || null;
  }
  async count(): Promise<number> {
    return this.prisma.ad.count({
      where: {
        paidFor: true,
      },
    });
  }
}
