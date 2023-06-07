import { messageModel } from "../models/messages.model.js";

export default class Message {
    async create(message) {
        try {
            const newMessage = new messageModel(message);
            let result = await newMessage.save();
            return result;
        } catch (err) {
            throw err;
        }
    }

    async read() {
        try {
            const result = await messageModel.paginate();
            return result;
        } catch (err) {
            throw err;
        }
    }
}