export default class CustomError{
    static createError({name="Error", cause, message, code=1}){
        const error = new Error(name, message, cause);
        error.name=name;
        error.code=code;
        error.message = message;
        error.cause=cause;
        throw error;
    }
}