import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketsCollection = 'tickets';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true
    },
    purchasedproducts: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                prodtotalamount:{
                    type: Number,
                    required:true
                }
            }
        ], default: []
    },
    outofstockprods: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true,
                },
                url: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ], default: []
    }
});

ticketSchema.plugin(mongoosePaginate);

export const ticketModel = mongoose.model(ticketsCollection, ticketSchema);