import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: String,
  duration: { type: Number, required: true },
  coverArt: String,
  audioUrl: { type: String, required: true },
  genre: String,
  releaseYear: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Song = mongoose.models.Song || mongoose.model('Song', songSchema);