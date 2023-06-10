import { userModel } from "../models/user.model.js";

export default class User {

    async create(user) {
        try {
            const newUser = new userModel(user);
            let result = await newUser.save();
            return result;
        } catch (err) {
            throw err;
        }
    }

    async searchById(id){
        try{
            let user = await userModel.findById(id);
            return user;
        } catch (err) {
            throw err;
        }
    }

    async searchByEmail(email) {
        try {
            let user = await userModel.findOne({ email: email }).populate('cart').lean();
            return user;
        } catch (err) {
            throw err;
        }
    }

    async update(id, newUser) {
        try {
            const user = await userModel.findByIdAndUpdate(
                id,
                newUser,
                { new: true }
            );
            return user;
        } catch (err) {
            throw err;
        }
    }

    async getAll() {
        try {
            let users = await userModel.paginate();
            return users;
        } catch (err) {
            throw err;
        }
    }

}