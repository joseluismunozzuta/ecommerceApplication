document.getElementById("signup").addEventListener('click', function () {
    const userForm = document.getElementById("signupForm");
    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData);
    fetch("/api/sessions/signup", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                window.location.replace("http://localhost:3000/api/sessions/login");
            } else {
                alert(data.error);
            }
        })
        .catch((error) => console.log(error));
});

