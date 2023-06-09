tippy('.link', {
    placement: 'bottom'
})

//Toggle mode
const toggle = document.querySelector('.js-change-theme');
const body = document.querySelector('body');
const profile = document.getElementById('profile');


toggle.addEventListener('click', () => {

    if (body.classList.contains('text-gray-900')) {
        toggle.innerHTML = "☀️";
        body.classList.remove('text-gray-900');
        body.classList.add('text-gray-100');
        profile.classList.remove('bg-white');
        profile.classList.add('bg-gray-900');
    } else {
        toggle.innerHTML = "🌙";
        body.classList.remove('text-gray-100');
        body.classList.add('text-gray-900');
        profile.classList.remove('bg-gray-900');
        profile.classList.add('bg-white');

    }
});

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