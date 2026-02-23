import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createOrder = async (amount: number, courseId: string, userId: string) => {
    const options = {
        amount: amount * 100, // Razorpay expects paise
        currency: 'INR',
        receipt: `receipt_${courseId}_${userId}_${Date.now()}`,
        notes: { courseId, userId },
    };
    const order = await razorpay.orders.create(options);
    return order;
};

export const verifyPaymentSignature = (
    orderId: string,
    paymentId: string,
    signature: string
): boolean => {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    return expectedSignature === signature;
};

export const verifyWebhookSignature = (
    body: string,
    signature: string
): boolean => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    return expectedSignature === signature;
};

export default razorpay;
