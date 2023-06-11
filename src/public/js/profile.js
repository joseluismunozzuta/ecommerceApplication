
function enableUpdateButton() {
    const fileInput = document.getElementById('profileImage');
    const updateButton = document.getElementById('updateButton');

    if (fileInput.files.length > 0) {
        if (fileInput.files[0].size > 1 * 1024 * 1024) {
            alert('File size exceeds the limit of 1MB.');
            input.value ="";
        } else {
            updateButton.classList.remove('disabled');
            updateButton.disabled = false;
        }

    } else {
        updateButton.classList.add('disabled');
        updateButton.disabled = true;
    }
}

function enableUpload(input){
    const docsUploadBtn = document.getElementById("docsUpload");
    if(input.files.length > 0 ){
        if (input.files[0].size > 10 * 1024 * 1024) {
            alert('File size exceeds the limit of 10MB.');
            input.value ="";
        } else {
            docsUploadBtn.classList.remove('disabled');
            docsUploadBtn.disabled = false;
        }
    }
}

async function changeRole() {

    let userid = document.getElementById("userId").value;

    await fetch(`/api/users/premium/${userid}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        }
    }).then((response) => response.json())
        .then((data) => {
            if (data.status == "success") {
                alert(data.payload);
                window.location.replace("/views/profile");
            } else {
                alert(data.error);
                console.log(data.error);
            }
        })
        .catch((error) => console.log(error));
}

// async function uploadDocs(){

//     let userid = document.getElementById("userId").value;

//     await fetch(`/api/users/${userid}/documents`, {
//         method: "POST",
//         headers: {
//             "Content-type": "application/json",
//         }
//     }).then((response) => response.json())
//         .then((data) => {
//             if (data.status == "success") {
//                 alert(data.payload);
//                 window.location.replace("http://localhost:3000/views/profile");
//             } else {
//                 alert(data.error);
//                 console.log(data.error);
//             }
//         })
//         .catch((error) => console.log(error));
// }