let logoutButton = document.getElementById("logout");

function goHome(){
    window.location.replace("http://localhost:3000/views/products");
}

function goChat() {
    window.location.href = "http://localhost:3000/views/chat";
}

function goProfile() {
    window.location.href = "http://localhost:3000/views/profile";
}

function goLogin() {
    window.location.href = "http://localhost:3000/api/sessions/login";
}

function goSignUp() {
    window.location.href = "http://localhost:3000/api/sessions/signup";
}

function goCreateProd() {
    window.location.href = "http://localhost:3000/views/createproduct";
}

async function goCart() {
    window.location.href = "http://localhost:3000/views/mycart";
}

if (logoutButton) {
    logoutButton.addEventListener('click', async function () {
        await fetch("/api/sessions/logout", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status == "success") {
                    window.location.replace("http://localhost:3000/views/products");
                }
                else {
                    alert("Logout failed");
                }
            })
            .catch((error) => console.log(error));
    })
}