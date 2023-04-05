document.getElementById("signup").addEventListener('click', function () {
    const userForm = document.getElementById("signupForm");
    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData);
    console.log(data);
    fetch("/api/sessions/signup", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((data) => console.log(data))
        .then(
            () => {
                window.location.replace("http://localhost:3000/api/sessions/login");
            }
        )
        .catch((error) => console.log(error));
});

