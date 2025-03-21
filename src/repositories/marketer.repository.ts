import { Marketer, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { generateReferrerCode } from "../utils/helpers/referrer-code.generator";

export class MarketerRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createMarketer(
    marketerData: Omit<Prisma.MarketerCreateInput, "referrerCode">
  ): Promise<Marketer> {
    // Generate a unique referrer code
    const referrerCode = await this.generateUniqueReferrerCode();

    return this.prisma.marketer.create({
      data: {
        ...marketerData,
        referrerCode,
      },
    });
  }

  async getAllMarketers(): Promise<Marketer[]> {
    return this.prisma.marketer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getMarketerById(id: string): Promise<Marketer | null> {
    return this.prisma.marketer.findUnique({
      where: { id },
    });
  }

  async getMarketerByEmail(email: string): Promise<Marketer | null> {
    return this.prisma.marketer.findUnique({
      where: { email },
    });
  }

  async getMarketerByUsername(username: string): Promise<Marketer | null> {
    return this.prisma.marketer.findUnique({
      where: { username },
    });
  }

  async getMarketerByReferrerCode(
    referrerCode: string
  ): Promise<Marketer | null> {
    return this.prisma.marketer.findUnique({
      where: { referrerCode },
    });
  }

  async updateMarketer(
    id: string,
    data: Prisma.MarketerUpdateInput
  ): Promise<Marketer> {
    return this.prisma.marketer.update({
      where: { id },
      data,
    });
  }

  async verifyMarketer(id: string): Promise<Marketer> {
    return this.prisma.marketer.update({
      where: { id },
      data: { verified: true },
    });
  }

  async deleteMarketer(id: string): Promise<void> {
    await this.prisma.marketer.delete({
      where: { id },
    });
  }

  async getMarketerWithReferredMerchants(id: string) {
    return this.prisma.marketer.findUnique({
      where: { id },
      include: {
        referredMerchants: true,
        earnings: {
          include: {
            merchant: true,
            Ad: true,
          },
        },
      },
    });
  }

  async getMarketerEarnings(id: string) {
    return this.prisma.marketerEarnings.findMany({
      where: {
        marketerId: id,
      },
      include: {
        merchant: true,
        Ad: true,
      },
    });
  }

  private async generateUniqueReferrerCode(): Promise<string> {
    let referrerCode = generateReferrerCode();
    let exists = await this.getMarketerByReferrerCode(referrerCode);

    // If the code already exists, regenerate it until we get a unique one
    while (exists) {
      referrerCode = generateReferrerCode();
      exists = await this.getMarketerByReferrerCode(referrerCode);
    }

    return referrerCode;
  }
  async count(): Promise<number> {
    const count = await this.prisma.marketer.count({
      where: { verified: true },
    });
    return count;
  }
}
