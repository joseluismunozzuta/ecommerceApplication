const socket = io();
let user;
let chatBox = document.getElementById("chatbox");

chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            let user = document.getElementById("useremail").value;
            socket.emit("chatMessage", { user: user, message: chatBox.value });
            chatBox.value = "";
        }
    }
});

//Listen to socket
socket.on('messages', data => {
    let log = document.getElementById("messages");
    let messages = "";
    let user = document.getElementById("useremail").value;
    data.forEach(message => {
        if (message.user !== user) {
            messages = messages + `<div class="col-start-1 col-end-8 p-3 rounded-lg">
            <div class="flex flex-row items-center">
                <div
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                    ${message.first}
                </div>
                <div
                    class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                    <div>
                        <p class="text-gray-700">${message.user}</p>
                        <p>${message.message}</p>
                    </div>
                </div>
            </div>
        </div>`
        } else {
            messages = messages + `<div class="col-start-6 col-end-13 p-3 rounded-lg">
            <div
                class="flex items-center justify-start flex-row-reverse">
                <div
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                    ${message.first}
                </div>
                <div
                    class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                    <div>
                    <p class="text-gray-700">${message.user}</p>
                    <p>${message.message}</p>
                    </div>
                </div>
            </div>
        </div>`
        }
    })
    log.innerHTML = messages;
});