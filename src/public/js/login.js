document.getElementById("login").addEventListener('click', async function () {
    const userForm = document.getElementById("loginForm");
    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData);

    await fetch("/api/sessions/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                window.location.replace("/views/products");
            }
            else {
                alert(data.error);

            }
        })
        .catch((error) => console.log(error));

})