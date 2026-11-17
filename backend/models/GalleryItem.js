const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  caption: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryCategory', required: true },
  /** Cloudflare R2 public URL of the image or video. */
  media: { type: String, required: true, trim: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
