import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    trim:true
  },
  images: [
    {
      public_id: {
        type: String
      },
      url: {
        type: String
      }
    }
  ],
},
  {
    timestamps: true
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;