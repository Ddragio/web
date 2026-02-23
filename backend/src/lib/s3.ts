import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET = process.env.AWS_S3_BUCKET || 'gyan-sammaan-videos';

export const uploadToS3 = async (
    fileBuffer: Buffer,
    key: string,
    contentType: string
): Promise<string> => {
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
    });
    await s3Client.send(command);
    return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const getSignedVideoUrl = async (key: string): Promise<string> => {
    const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
    if (cloudfrontDomain) {
        // Use CloudFront for secure streaming
        return `https://${cloudfrontDomain}/${key}`;
    }
    // Fallback to S3 signed URL (expires in 2 hours)
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: 7200 });
};

export default s3Client;
