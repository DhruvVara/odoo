const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function distributeExamPapers(examPapers, invigilators) {
    console.log('Distributing exam papers...');

    try {
        for (const paper of examPapers) {
            // Uploaded the paper to Cloudinary
            const result = await cloudinary.uploader.upload(paper.filePath, {
                resource_type: 'raw',
                public_id: `exam_papers/${paper.id}`,
                access_mode: 'authenticated',
                type: 'private'
            });

            // Generated a signed URL for each invigilator
            for (const invigilator of invigilators) {
                const signedUrl = cloudinary.utils.private_download_url(result.public_id, result.format, {
                    expiration: Math.floor(Date.now() / 1000) + 3600, // URL expires in 1 hour
                    sign_url: true
                });

                // Sending it to the invigilator
                console.log(`Exam paper ${paper.id} URL for invigilator ${invigilator.id}: ${signedUrl}`);

                // TODO: Send this URL to the invigilator (e.g., via email or your application's notification system)
            }
        }

        console.log('Exam papers distributed successfully.');
    } catch (error) {
        console.error('Error distributing exam papers:', error);
    }
}

module.exports = distributeExamPapers;