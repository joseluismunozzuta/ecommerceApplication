import { v4 as uuidv4 } from 'uuid';

export default class TicketDTO{
    constructor(ticket){
        this.code = uuidv4(),
        this.purchase_datetime = new Date().toLocaleString(),
        this.amount = ticket.amount,
        this.purchaser = ticket.purchaser
    }
}