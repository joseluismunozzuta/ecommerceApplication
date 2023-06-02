let imageContainer = document.getElementById('imageCont');
let imageUrlInput = document.getElementById('thumbnail');

imageUrlInput.addEventListener('input', function () {
    // Get the entered image URL
    let imageUrl = imageUrlInput.value;

    // Update the background image of the div
    imageContainer.style.backgroundImage = "url('" + imageUrl + "')";
});

document.getElementById("createProd").addEventListener('click', function () {
    const userForm = document.getElementById("prodForm");
    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData);
    fetch("/api/products", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                console.log("success");
                alert("Product successfully created");
                window.location.replace("http://localhost:3000/views/products");
            } else {
                alert(data.error);
            }
        })
        .catch((error) => console.log(error));
});

//Check info
let myForm = document.getElementById('prodForm');
let formFields = myForm.querySelectorAll('input[required]');
let submitButton = document.getElementById('createProd');

function checkFormFields() {
    var allFieldsHaveValue = true;
    for (var i = 0; i < formFields.length; i++) {
        if (formFields[i].value === '') {
            allFieldsHaveValue = false;
            break;
        }
    }
    submitButton.disabled = !allFieldsHaveValue;
}

myForm.addEventListener('input', checkFormFields);