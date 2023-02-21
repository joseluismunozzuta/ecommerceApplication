const socket = io();
let user;
let chatBox = document.getElementById("chatbox");
Swal.fire({
    title: "Hola, usuario. Identificate.",
    input: "text",
    text: "Ingresa tu correo para identificarte";
    inputValidator: (value) => {
        return !value && 'Debes escribir un correo.';
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
});