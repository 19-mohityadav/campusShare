import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const router = express.Router();

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to cloudinary from buffer
        let cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "campusShare" },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: 'Cloudinary Upload Error', error });
                }
                
                res.json({
                    message: 'Image uploaded successfully',
                    imageUrl: result.secure_url
                });
            }
        );

        Readable.from(req.file.buffer).pipe(cld_upload_stream);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
