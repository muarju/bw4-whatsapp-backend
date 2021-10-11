import pkg from 'cloudinary'
import multerStorageCloudinary from 'multer-storage-cloudinary'
const {v2:cloudinary} = pkg
const {CloudinaryStorage} = multerStorageCloudinary

export const saveToUser = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'whatsapp/user'
    }
})