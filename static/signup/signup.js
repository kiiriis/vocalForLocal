$('#first_name').keyup(function(){
  if($(this).val().trim().length){
    $(this).removeClass('is-invalid');
    $(this).addClass('is-valid');
  }
  else{
    $(this).removeClass('is-valid')
    $(this).addClass('is-invalid');
  }
});

$('#last_name').keyup(function(){
  if($(this).val().trim().length){
    $(this).removeClass('is-invalid');
    $(this).addClass('is-valid');
  }
  else{
    $(this).removeClass('is-valid')
    $(this).addClass('is-invalid');
  }
});

let form = document.querySelector('.needs-validation')

form.addEventListener('submit', function (event) {
  let proper = true;
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
  if (!proper) {
    window.scrollTo(0, 0);
    event.preventDefault()
    event.stopPropagation()
  }

  form.classList.add('was-validated')
}, false)