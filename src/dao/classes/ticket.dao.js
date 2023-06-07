import { ticketModel } from "../models/tickets.model.js";

export default class Ticket {

    async create(ticket){
        try{
            const finalTicket = new ticketModel(ticket);
            let result = await finalTicket.save();
            return result;
        }catch(err){
            throw err;
        }
    }

    async getById(id){
        try{
            const ticket = await ticketModel.findById(id);
            return ticket;
        }catch(err){
            throw err;
        }
    }
}