let imageContainer = document.getElementById('imageCont');
let imageUrlInput = document.getElementById('thumbnail');
let myForm = document.getElementById('prodForm');
let formFields = myForm.querySelectorAll('input[required]');
let submitButton = document.getElementById('actionProdBtn');

async function createProdMethod() {
        const userForm = document.getElementById("prodForm");
        const formData = new FormData(userForm);
        const data = Object.fromEntries(formData);
        
        await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((data) => {
                if (data.status == "success") {
                    alert("Product successfully created");
                    window.location.replace("http://localhost:3000/views/products");
                } else {
                    alert(data.error.name);
                    console.log(data.error.cause);
                }
            })
            .catch((error) => console.log(error));
    };

async function editProd() {
    const userForm = document.getElementById("prodForm");
    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData);
    let prodid = submitButton.getAttribute("data-value");
    await fetch(`/api/products/${prodid}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                alert("Product successfully edited");
                window.location.replace("http://localhost:3000/views/products");
            } else {
                alert(data.error.name);
                console.log(data.error.cause);
            }
        })
        .catch((error) => console.log(error));
}

async function deleteProd() {
    const userForm = document.getElementById("prodForm");
    const formData = new FormData(userForm);
    const data = Object.fromEntries(formData);
    let prodid = submitButton.getAttribute("data-value");
    await fetch(`/api/products/${prodid}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (data.status == "success") {
                alert("Product successfully edited");
                window.location.replace("http://localhost:3000/views/products");
            } else {
                alert(data.error.name);
                console.log(data.error.cause);
            }
        })
        .catch((error) => console.log(error));
}

function imageChange() {
    // Get the entered image URL
    let imageUrl = imageUrlInput.value;
    if (imageUrl !== '') {
        // Update the background image of the div
        imageContainer.style.backgroundImage = "url('" + imageUrl + "')";
    }
}

//Check info
// function checkFormFields() {
//     var allFieldsHaveValue = true;
//     for (var i = 0; i < formFields.length; i++) {
//         if (formFields[i].value === '') {
//             allFieldsHaveValue = false;
//             break;
//         }
//     }
//     submitButton.disabled = !allFieldsHaveValue;
// }

window.addEventListener('load', imageChange);
//window.addEventListener('load', checkFormFields);
imageUrlInput.addEventListener('input', imageChange);
//myForm.addEventListener('input', checkFormFields);