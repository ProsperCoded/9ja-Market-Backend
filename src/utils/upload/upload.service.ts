import { configService } from "../config/config.service";
import {v2 as cloudinary} from 'cloudinary';


cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>("CLOUDINARY_API_KEY"),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    secure: configService.get<string>("NODE_ENV") === "production"
})

type UploadType = 'image' | 'video' | 'raw' | 'auto';
export class UploadService {
    public async uploadFile(path: string, type: UploadType ): Promise<string> {
        const {secure_url} = await cloudinary.uploader.upload(path, {
            resource_type: type,
            folder: type,
            overwrite: true,
        });
        return secure_url;
    }
}