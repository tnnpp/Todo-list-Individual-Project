// models/Item.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref:'User' 
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  status: { 
    type: String, 
    enum: ["todo", "inProgress", "done"] 
  },
  createAt : {
    type: Date,
    default: Date.now
  },
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);