function inputValidator(){
  if($(this).val().trim().length){
    $(this).removeClass('is-invalid');
    $(this).addClass('is-valid');
  }
  else{
    $(this).removeClass('is-valid')
    $(this).addClass('is-invalid');
  }
}

$('#first_name').keyup(inputValidator);

$('#last_name').keyup(inputValidator);

function radioEvent(){
  if($('#account-b').prop('checked') || $('#account-p').prop('checked')){
    $('#account-b').removeClass('is-invalid');
    $('#account-p').removeClass('is-invalid');
    $('#account-b').addClass('is-valid');
    $('#account-p').addClass('is-valid');
  }
  else{
    $('#account-b').removeClass('is-valid');
    $('#account-p').removeClass('is-valid');
    $('#account-b').addClass('is-invalid');
    $('#account-p').addClass('is-invalid');
  }
}

$('#account-b').change(radioEvent)
$('#account-p').change(radioEvent)

$('#pass-1').keyup(function(){
  if($('#pass-1').val().trim().length > 7){
    $('#pass-1').removeClass('is-invalid')
    $('#pass-1').addClass('is-valid')
  }
  else{
    $('#pass-1').removeClass('is-valid')
    $('#pass-1').addClass('is-invalid')
  }
})

$('#pass-2').keyup(function(){
  if($('#pass-2').val() == $('#pass-1').val() && $('#pass-2').val().trim().length>7){
    $('#pass-2').removeClass('is-invalid')
    $('#pass-2').addClass('is-valid')
  }
  else{
    $('#pass-2').removeClass('is-valid')
    $('#pass-2').addClass('is-invalid')
  }
})

$('#zip').keyup(function(){
  if ($('#zip').val().trim().length>0 && isNaN($('#zip').val() / 1) == false) {
    $('#zip').removeClass('is-invalid')
    $('#zip').addClass('is-valid')
}
else{
    $('#zip').removeClass('is-valid')
    $('#zip').addClass('is-invalid')
}
})

$('#address').keyup(inputValidator)

$('#agree').change(function(){
  if($('#agree').prop('checked')){
    $('#agree').removeClass('is-invalid')
    $('#agree').addClass("is-valid")
  }
  else{
    $('#agree').removeClass('is-valid')
    $('#agree').addClass('is-invalid')
  }
})

let form = document.querySelector('.needs-validation')

form.addEventListener('submit', function (event) {
    let proper = true;

    // First Name
    if($('#first_name').val().trim().length){
        $('#first_name').removeClass('is-invalid');
        $('#first_name').val($('#first_name').val().trim())
        $('#first_name').addClass('is-valid');
    }
    else{
        proper = false
        $('#first_name').removeClass('is-valid')
        $('#first_name').val('')
        $('#first_name').addClass('is-invalid');
    }

    // Last Name
    if($('#last_name').val().trim().length){
        $('#last_name').removeClass('is-invalid')
        $('#last_name').val($('#last_name').val().trim())
        $('#last_name').addClass('is-valid');
    }
    else{
        proper = false
        $('#last_name').removeClass('is-valid')
        $('#last_name').val('')
        $('#last_name').addClass('is-invalid');
    }

    // Radios
    if($('#account-b').prop('checked') || $('#account-p').prop('checked')){
        $('#account-b').removeClass('is-invalid');
        $('#account-p').removeClass('is-invalid');
        $('#account-b').addClass('is-valid');
        $('#account-p').addClass('is-valid');
      }
      else{
        proper = false
        $('#account-b').removeClass('is-valid');
        $('#account-p').removeClass('is-valid');
        $('#account-b').addClass('is-invalid');
        $('#account-p').addClass('is-invalid');
    }

    // Passwords
    if($('#pass-1').val().trim().length > 7){
        $('#pass-1').removeClass('is-invalid')
        $('#pass-1').addClass('is-valid')
        if($('#pass-2').val() == $('#pass-1').val()){
          $('#pass-2').removeClass('is-invalid')
          $('#pass-2').addClass('is-valid')
        }
        else{
          proper = false
          $('#pass-2').removeClass('is-valid')
          $('#pass-2').addClass('is-invalid')
        }
    }
    else{
      proper = false
      $('#pass-1').removeClass('is-valid')
      $('#pass-1').addClass('is-invalid')
    }

    // Zip
    if ($('#zip').val().trim().length>0 && isNaN($('#zip').val() / 1) == false) {
        $('#zip').removeClass('is-invalid')
        $('#zip').addClass('is-valid')
    }
    else{
        proper = false
        $('#zip').removeClass('is-valid')
        $('#zip').addClass('is-invalid')
    }

    // Address
    if($('#address').val().trim().length > 0){
      $('#address').removeClass('is-invalid')
      $('#address').addClass('is-valid')
    }
    else{
      proper = false
      $('#address').removeClass('is-valid')
      $('#address').addClass('is-invalid')
    }

    // Agreement
    if($('#agree').prop('checked')){
      $('#agree').removeClass('is-invalid')
      $('#agree').addClass("is-valid")
    }
    else{
      proper = false
      $('#agree').removeClass('is-valid')
      $('#agree').addClass('is-invalid')
    }

    if (!proper) {
      window.scrollTo(0, 0);
      event.preventDefault()
      event.stopPropagation()
    }

  // form.classList.add('was-validated')
}, false)