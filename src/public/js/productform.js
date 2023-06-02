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

// Function to check if all form fields have values
function checkFormFields() {
    var allFieldsHaveValue = true;

    // Iterate through the form fields and check their values
    for (var i = 0; i < formFields.length; i++) {
        if (formFields[i].value === '') {
            allFieldsHaveValue = false;
            break;
        }
    }

    // Enable or disable the submit button based on the check result
    submitButton.disabled = !allFieldsHaveValue;
}

// Listen for changes in the form fields
myForm.addEventListener('input', checkFormFields);