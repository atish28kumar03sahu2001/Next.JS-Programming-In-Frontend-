import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);