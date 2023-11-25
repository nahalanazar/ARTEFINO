import mongoose from 'mongoose';

const otpSchema = mongoose.Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date
});

const OTPVerification = mongoose.model('OTPVerification', otpSchema);

export default OTPVerification;
