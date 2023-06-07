import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
});

messagesSchema.plugin(mongoosePaginate);

export const messageModel = mongoose.model(messagesCollection, messagesSchema);