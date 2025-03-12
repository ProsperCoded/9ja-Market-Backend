import { Prisma, Product, ProductCategory } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { databaseService } from "../utils/database";

interface ProductSearchResult extends Product {
  priority: boolean;
}

interface WeightedAd<T> {
  ad: T;
  weight: number;
}

interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class ProductRepository {
  private readonly productDelegate: Prisma.ProductDelegate<DefaultArgs>;
  private readonly adDelegate: Prisma.AdDelegate<DefaultArgs>;

  constructor() {
    this.productDelegate = databaseService.product;
    this.adDelegate = databaseService.ad;
  }

  findAll(): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await this.productDelegate.findMany({
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            ads: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(products);
      } catch (error) {
        reject(error);
      }
    });
  }

  getPaginatedProducts(
    page: number = 1,
    pageSize: number = 40,
    category?: ProductCategory,
    state?: string
  ): Promise<PaginationResult<Product>> {
    return new Promise(async (resolve, reject) => {
      try {
        const skip = (page - 1) * pageSize;

        // Build where condition based on whether category and/or state is provided
        const whereCondition: any = {};
        if (category) whereCondition.category = category;
        if (state) whereCondition.merchant = { addresses: { some: { state } } };

        // Get total count for pagination info
        const totalItems = await this.productDelegate.count({
          where: whereCondition,
        });

        const products = await this.productDelegate.findMany({
          where: whereCondition,
          skip,
          take: pageSize,
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc", // Most recent products first
          },
        });

        const totalPages = Math.ceil(totalItems / pageSize);

        resolve({
          items: products,
          totalItems,
          totalPages,
          currentPage: page,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getById(id: string): Promise<Product | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.productDelegate.findUnique({
          where: { id },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            ads: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  getMerchantProducts(merchantId: string): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await this.productDelegate.findMany({
          where: { merchantId },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            ads: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(products);
      } catch (error) {
        reject(error);
      }
    });
  }

  getMarketProducts(marketId: string): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await this.productDelegate.findMany({
          where: {
            merchant: {
              marketId,
            },
          },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        resolve(products);
      } catch (error) {
        reject(error);
      }
    });
  }

  update(id: string, product: Prisma.ProductUpdateInput): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedProduct = await this.productDelegate.update({
          where: { id },
          data: product,
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(updatedProduct);
      } catch (error) {
        reject(error);
      }
    });
  }

  create(
    merchantId: string,
    product: Prisma.ProductCreateWithoutMerchantInput,
    displayImage: string,
    productImages: string[]
  ): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const newProduct = await this.productDelegate.create({
          data: {
            ...product,
            merchant: {
              connect: {
                id: merchantId,
              },
            },
            images: {
              createMany: {
                data: productImages.map((image) => ({ url: image })),
              },
            },
            displayImage: {
              create: {
                url: displayImage,
              },
            },
          },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(newProduct);
      } catch (error) {
        reject(error);
      }
    });
  }

  delete(id: string): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const deletedProduct = await this.productDelegate.delete({
          where: { id },
        });
        resolve(deletedProduct);
      } catch (error) {
        reject(error);
      }
    });
  }

  makeDisplayImage(productId: string, imageId: string): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.productDelegate.update({
          where: { id: productId },
          data: {
            displayImage: {
              connect: {
                id: imageId,
              },
            },
          },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  addImages(productId: string, productImages: string[]): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.productDelegate.update({
          where: { id: productId },
          data: {
            images: {
              createMany: {
                data: productImages.map((image) => ({ url: image })),
              },
            },
          },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  removeImage(productId: string, imageId: string): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await this.productDelegate.update({
          where: { id: productId },
          data: {
            images: {
              delete: { id: imageId },
            },
          },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
          },
        });
        resolve(product);
      } catch (error) {
        reject(error);
      }
    });
  }

  searchProducts(searchTerm: string): Promise<ProductSearchResult[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const matchingProducts = await this.productDelegate.findMany({
          where: {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
              { category: searchTerm as ProductCategory },
            ],
          },
          include: {
            displayImage: true,
            images: true,
            ratings: true,
            merchant: {
              include: {
                market: true,
                addresses: true,
                phoneNumbers: true,
              },
            },
            ads: {
              where: {
                expiresAt: { gte: new Date() },
                paidFor: true,
              },
            },
          },
        });
        // Prioritize products with ads
        const sortedProducts = matchingProducts.sort((a, b) => {
          const levelA =
            a.ads.length > 0 ? Math.max(...a.ads.map((ad) => ad.level)) : 0;
          const levelB =
            b.ads.length > 0 ? Math.max(...b.ads.map((ad) => ad.level)) : 0;
          return levelB - levelA;
        });

        // Add extra "priority" field to products with ads and remove ads from the response
        const products = sortedProducts.map((product) => {
          if (product.ads.length > 0) {
            (product as unknown as ProductSearchResult).priority = true;
          }
          return product;
        });
        resolve(products as unknown as ProductSearchResult[]);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Featured Products
  getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const ads = await this.adDelegate.findMany({
          where: {
            expiresAt: { gte: new Date() },
            paidFor: true,
          },
          include: {
            product: {
              include: {
                displayImage: true,
                images: true,
                ratings: true,
                merchant: {
                  include: {
                    market: true,
                    addresses: true,
                    phoneNumbers: true,
                  },
                },
              },
            },
          },
        });

        // Apply weighted random selection to ads
        const weightedAds: WeightedAd<(typeof ads)[0]>[] = ads.map((ad) => ({
          ad,
          weight: ad.level,
        }));
        const selectedAds: typeof ads = [];
        for (let i = 0; i < Math.min(weightedAds.length, limit); i++) {
          const totalWeight = weightedAds.reduce(
            (acc, curr) => acc + curr.weight,
            0
          );
          const random = Math.random() * totalWeight;
          let sum = 0;
          for (let j = 0; j < weightedAds.length; j++) {
            sum += weightedAds[j].weight;
            if (random < sum) {
              selectedAds.push(weightedAds[j].ad);
              weightedAds.splice(j, 1);
              break;
            }
          }
        }

        // Extract products from ads
        const featuredProducts = selectedAds.map((ad) => ad.product);

        // Fill up with random products if necessary
        if (featuredProducts.length < limit) {
          const remainingProducts = await this.productDelegate.findMany({
            where: {
              NOT: {
                id: {
                  in: featuredProducts.map((product) => product.id),
                },
              },
            },
            include: {
              displayImage: true,
              images: true,
              ratings: true,
              merchant: {
                include: {
                  market: true,
                  addresses: true,
                  phoneNumbers: true,
                },
              },
            },
            take: limit - featuredProducts.length,
          });
          featuredProducts.push(...remainingProducts);
        }

        resolve(featuredProducts);
      } catch (error) {
        reject(error);
      }
    });
  }

  async incrementClicks(productId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.productDelegate.update({
          where: { id: productId },
          data: {
            clicks: {
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
