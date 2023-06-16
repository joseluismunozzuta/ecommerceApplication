$("#confirm_password").on("keyup", checkPasswords);
$("#newPassword").on("keyup", checkPasswords);

function checkPasswords() {
    var password = $("#newPassword").val();
    var confirmPassword = $("#confirm_password").val();
    if (confirmPassword !== "" && password !== confirmPassword) {
        console.log("1");
        $("#validation").html("Password does not match!").show();
        $("#submit").prop('disabled', true);
    } else if (confirmPassword !== "" && password !== "") {
        console.log("2");
        $("#validation").hide();
        $("#submit").prop('disabled', false);
    } else {
        console.log("3");
        $("#validation").hide();
        $("#submit").prop('disabled', true);
    }
}

$("#showPw").click(function () {
    var passInput = $("#newPassword, #confirm_password");
    if (passInput.attr("type") === "password") {
        passInput.attr("type", "text");
        $("#showHide").html("Hide password");
    } else {
        passInput.attr("type", "password");
        $("#showHide").html("Show password");
    }
});