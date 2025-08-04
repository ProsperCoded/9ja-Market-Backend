import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { ILogger } from '../logger/logger.interface';
import { ErrorMessages } from '../../constants/error-messages.enum';
import { BadRequestException } from '../exceptions/bad-request.exception';
import { InternalServerException } from '../exceptions/internal-server.exception';

export class MulterMiddleware {
  private upload: multer.Multer;

  constructor(private readonly logger: ILogger) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Set up Cloudinary storage
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        public_id: (req, file) => Date.now() + '-' + file.originalname,
      },
    });

    // Set up Multer with Cloudinary storage
    this.upload = multer({ storage });
  }

  public single(fieldName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await new Promise<void>((resolve, reject) => {
          this.upload.single(fieldName)(req, res, (err: any) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
        next();
      } catch (err) {
        this.logger.error(ErrorMessages.ERROR_UPLOADING_IMAGE, err);
        if (err instanceof multer.MulterError) {
          next(new BadRequestException(err.message));
        }
        next(new InternalServerException(ErrorMessages.ERROR_UPLOADING_IMAGE));
      }
    };
  }

  public multiple(fieldName: string, maxCount: number) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await new Promise<void>((resolve, reject) => {
          this.upload.array(fieldName, maxCount)(req, res, (err: any) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
        next();
      } catch (err) {
        this.logger.error(ErrorMessages.ERROR_UPLOADING_IMAGES, err);
        if (err instanceof multer.MulterError) {
          next(new BadRequestException(err.message));
        }
        next(new InternalServerException(ErrorMessages.ERROR_UPLOADING_IMAGES));
      }
    };
  }
}
