import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  actionName: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  }
});

export const History = mongoose.model('history', historySchema);
