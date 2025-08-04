import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// load base .env first (no override)
dotenvConfig({ path: resolve(process.cwd(), ".env") });

// if running locally and .env.local exists, load it with override
if (existsSync(resolve(process.cwd(), ".env.local"))) {
  dotenvConfig({ path: resolve(process.cwd(), ".env.local"), override: true });
}

import { ConfigInterface } from "./config.interface";

class ConfigService implements ConfigInterface {
  private readonly config: any;
  private static instance: ConfigService;

  constructor() {
    this.config = process.env;
  }

  get<T = any>(propertyPath: string, defaultValue?: T): T | undefined {
    const value = this.config[propertyPath];
    return value ? (value as unknown as T) : defaultValue;
  }

  static getInstance(): ConfigService {
    if (!this.instance) {
      this.instance = new ConfigService();
    }
    return this.instance;
  }
}

export const configService = ConfigService.getInstance();
