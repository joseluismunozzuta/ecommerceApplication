const socket = io();
let user;
let chatBox = document.getElementById("chatbox");
Swal.fire({
    title: "Hola, usuario. Identificate.",
    input: "text",
    text: "Ingresa tu correo para identificarte",
    inputValidator: (value) => {
        return !value && 'Debes escribir un correo.';
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    document.getElementById("identifier").innerHTML = `<h2>Hola ` + user+`</h2>`;
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("chatMessage", { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
});

//Listen to socket
socket.on('messages', data => {
    let log = document.getElementById("messages");
    let messages = "";
    data.forEach(message => {
        messages = messages + `<br>${message.user} dice: ${message.message}</br> `
    })
    console.log(messages);
    log.innerHTML = messages;
});