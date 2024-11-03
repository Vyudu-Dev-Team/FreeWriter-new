import express from 'express'; // Import express
import multer from 'multer'; // For handling multipart/form-data
import { uploadImageToS3 } from '../services/awsService.js'; // Import uploadImageToS3 from awsService

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory as a buffer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (5MB)
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Accept only image files
        } else {
            cb(new Error('Invalid file type, only images are allowed!'), false);
        }
    }
});

/**
 * Route to upload an image to S3.
 * @route POST /api/uploads/image
 * @access Public
 */
router.post('/image', upload.single('image'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Upload the image to S3
        const imageUrl = await uploadImageToS3(file.buffer, file.mimetype);
        res.status(200).json({ imageUrl });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
