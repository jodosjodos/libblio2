import mongoose from 'mongoose';

const imageSchema =new mongoose.Schema({
    imageURL: String,
    public_id: String
});

export const Image = mongoose.model('Image', imageSchema);
