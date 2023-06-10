tippy('.link', {
    placement: 'bottom'
})

function enableUpdateButton() {
    const fileInput = document.getElementById('profileImage');
    const updateButton = document.getElementById('updateButton');

    if (fileInput.files.length > 0) {
        if (fileInput.files[0].size > 10 * 1024 * 1024) {
            alert('File size exceeds the limit of 10MB.');
        } else {
            updateButton.classList.remove('disabled');
            updateButton.disabled = false;
        }

    } else {
        updateButton.classList.add('disabled');
        updateButton.disabled = true;
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
                window.location.replace("http://localhost:3000/views/profile");
            } else {
                console.log(data.error);
            }
        })
        .catch((error) => console.log(error));
}