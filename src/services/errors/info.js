export const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of requires properties:
    *first_name: must be a String, received ${user.first_name},
    *last_name: must be a String, received ${user.last_name},
    *age: must be an Integer, received ${user.age},
    *email: must be a String, received ${user.email}`
}