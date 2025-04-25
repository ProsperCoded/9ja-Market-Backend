import Redis, { RedisOptions } from "ioredis";
import { configService } from "../config/config.service";
import { LoggerPath } from "../../constants/logger-paths.enum";
import { WinstonLogger as LoggerService } from "../logger/winston.logger";

export class RedisDatabaseService {
  private redisClient: Redis;
  private logger: LoggerService;

  constructor() {
    this.logger = new LoggerService(LoggerPath.DatabaseService);

    const redisOptions: RedisOptions = {
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 500, 2000);
        return delay;
      },
      maxRetriesPerRequest: 5,
      enableReadyCheck: true,
      connectTimeout: 10000,
      keepAlive: 30000,
      family: 4,
      reconnectOnError: (err) => {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    };
    let url = configService.get("REDIS_DATABASE_URL");
    console.log("-----------");
    console.log("redis options", url);
    console.log("-----------");
    this.redisClient = new Redis(url, redisOptions);

    this.redisClient.on("connect", () => {
      this.logger.info("Connected to Redis successfully!");
    });

    this.redisClient.on("error", (err) => {
      this.logger.error("Redis Error:", err);
    });

    this.redisClient.on("close", () => {
      this.logger.warn("Redis connection closed!");
    });

    this.redisClient.on("reconnecting", () => {
      this.logger.info("Attempting to reconnect to Redis...");
    });
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redisClient.ping();
      return result === "PONG";
    } catch (error) {
      this.logger.error("Redis Ping Error:", error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.redisClient.quit();
      this.logger.info("Disconnected from Redis!");
    } catch (error) {
      this.logger.error("Redis Disconnection Error:", error);
    }
  }

  getClient(): Redis {
    return this.redisClient;
  }
}
const redisDBService = new RedisDatabaseService();
// // Verify connection before exporting
// (async () => {
//   const isConnected = await databaseService.ping();
//   if (!isConnected) {
//     console.error("Failed to establish Redis connection");
//     process.exit(1);
//   }
//   console.log("Connected to redis DB successfully ");
// })();

export default redisDBService.getClient();
