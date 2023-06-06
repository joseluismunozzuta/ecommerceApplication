import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min: 1
    },
    category:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    code: {
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    status: {
        type:Boolean,
        required:true,
        default: true
    }
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productsCollection, productSchema);