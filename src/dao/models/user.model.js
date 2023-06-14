import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
    },
    role: {
        type: String,
        default: "user"
    },
    profileimage: {
        data: Buffer,
        contentType: String
    },
    documents: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                reference: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    },
    last_connection: {
        type: String,
        default: null
    }, status: {
        type: String,
        required: true,
        default: "Pending"
    }
});

userSchema.plugin(mongoosePaginate);

// userSchema.pre('find', function () {
//     this.populate('cart');
// });

export const userModel = mongoose.model(userCollection, userSchema);
