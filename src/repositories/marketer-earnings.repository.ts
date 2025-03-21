import { MarketerEarnings, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export class MarketerEarningsRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createEarning(
    data: Prisma.MarketerEarningsUncheckedCreateInput
  ): Promise<MarketerEarnings> {
    return this.prisma.marketerEarnings.create({
      data,
    });
  }

  async getEarningsByMarketer(marketerId: string): Promise<MarketerEarnings[]> {
    return this.prisma.marketerEarnings.findMany({
      where: { marketerId },
      include: {
        merchant: true,
        Ad: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getTotalEarningsByMarketer(marketerId: string): Promise<number> {
    const result = await this.prisma.marketerEarnings.aggregate({
      where: { marketerId },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }

  async getEarningByAd(adId: string): Promise<MarketerEarnings | null> {
    return this.prisma.marketerEarnings.findUnique({
      where: { AdId: adId },
    });
  }
}
