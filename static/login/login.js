let form = document.querySelector('.needs-validation')

function unameChecker(){
    if($('#username').val().trim().length > 3){
        $('#username').removeClass('is-invalid')
        $('#username').addClass("is-valid")
        return true;
    }
    else{
        $('#username').removeClass('is-valid')
        $('#username').addClass('is-invalid')
        return false;
    }
}

function passChecker(){
    if($('#pass-1').val().trim().length > 7){
        $('#pass-1').removeClass('is-invalid')
        $('#pass-1').addClass('is-valid')
        return true;
    }
    else{
        $('#pass-1').removeClass('is-valid')
        $('#pass-1').addClass('is-invalid')
        return false;
    }
}

$('#username').keyup(unameChecker)
$('#pass-1').keyup(passChecker)

form.addEventListener('submit', function (event) {
    let proper = true;

    // Passwords
    if(!passChecker()){
        proper = false;
    }

    // Username
    if(!unameChecker()){
        proper = false;
    }

    if (!proper) {
      event.preventDefault()
      event.stopPropagation()
    }

    // form.classList.add('was-validated')
}, false)