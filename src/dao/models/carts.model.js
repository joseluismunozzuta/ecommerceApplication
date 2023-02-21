import mongoose from "mongoose";ñ

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products:{
        type:Array,
        default:[]
    }
});

export const cartModel = mongoose.model(cartsCollection, cartSchema);