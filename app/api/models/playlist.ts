import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  coverArt: String,
  createdBy: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  songs: [{
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    position: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

export const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);