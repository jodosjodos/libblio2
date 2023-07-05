import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  levelName: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  }
});

export const Level = mongoose.model('level', levelSchema);


