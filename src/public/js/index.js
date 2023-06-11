let logoutButton = document.getElementById("logout");

function goHome(){
    window.location.replace("/views/products");
}

function goChat() {
    window.location.href = "/views/chat";
}

function goProfile() {
    window.location.href = "/views/profile";
}

function goLogin() {
    window.location.href = "/api/sessions/login";
}

function goSignUp() {
    window.location.href = "/api/sessions/signup";
}

function goCreateProd() {
    window.location.href = "/views/createproduct";
}

async function goCart() {
    window.location.href = "/views/mycart";
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
                    window.location.replace("/views/products");
                }
                else {
                    alert("Logout failed");
                }
            })
            .catch((error) => console.log(error));
    })
}