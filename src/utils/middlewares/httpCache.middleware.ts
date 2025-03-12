import { Request, Response } from "express";

export function httpCacheDuration(age: number) {
  return (_req: Request, res: Response, next: Function) => {
    res.setHeader("Cache-Control", "public, max-age=" + age.toString());
    next();
  };
}
export function httpCacheNoCache() {
  return (_req: Request, res: Response, next: Function) => {
    res.setHeader("Cache-Control", "no-cache");
    next();
  };
}
export function httpCacheNoStore() {
  return (_req: Request, res: Response, next: Function) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  };
}
