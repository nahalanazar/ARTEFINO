import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema({
    imageURL: String,
    linkURL: String,
    title: String,
    description: String
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
