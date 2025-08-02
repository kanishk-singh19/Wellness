import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    json_file_url: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
