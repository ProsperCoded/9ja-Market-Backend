import { NextFunction, Request, Response } from "express";
import multer from 'multer';

const storage = multer.diskStorage({
    filename: (request, file, callback) => {
        callback(null, file.originalname + '-' + Date.now());
    }
})

const upload = multer({ storage: storage });
export class FileParser{
    constructor() { }
    single(fieldName: string) {
        return (request: Request, response: Response, next: NextFunction) => {
            upload.single(fieldName)(request, response, next);
        }
    }

    array(fieldName: string, maxCount: number) {
        return (request: Request, response: Response, next: NextFunction) => {
            upload.array(fieldName, maxCount)(request, response, next);
        }
    }
}