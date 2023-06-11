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
            console.log(data);
            if (data.status == "success") {
                alert("User succesfully created");
                window.location.replace("/api/sessions/login");
            } else {
                alert(data.error.name);
            }
        })
        .catch((error) => console.log(error));
});

