let darkElements = $('.dark-form-handler').length
$('#checkbox').change(function(){
  for(let i = 0;i<darkElements;i++){
    document.getElementsByClassName('dark-form-handler')[i].classList.toggle('dark');
  }
})

let form = document.querySelector('.needs-validation')

function pass1Checker(){
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

function pass2Checker(){
    if($('#pass-2').val() == $('#pass-1').val() && $('#pass-2').val().trim().length>7){
        $('#pass-2').removeClass('is-invalid')
        $('#pass-2').addClass('is-valid')
        return true;
    }
    else{
        $('#pass-2').removeClass('is-valid')
        $('#pass-2').addClass('is-invalid')
        return false;
    }
}

$('#pass-1').keyup(function(){
    pass1Checker();
    if($('#pass-2').val().length > 0){
        pass2Checker()
    }
})
$('#pass-2').keyup(pass2Checker)

let otp,emailVerified=false,userEmail;

form.addEventListener('submit', function (event) {
    let proper = true;

    // Email
    if(!emailVerified){
        proper = false;
    }
    else{
        $('#email').prop('disabled',false)
        $('#email').val(userEmail)
    }

    // Pass 1
    if(!pass1Checker()){
        proper = false;
    }

    // Pass 2
    if(!pass2Checker()){
        proper = false;
    }

    if (!proper) {
      event.preventDefault()
      event.stopPropagation()
    }

    // form.classList.add('was-validated')
}, false)

function rename(ele){
    ele.html('Resend OTP');
}

function edit_email(){
    $('#email_editor').remove()
    $('#email').prop('disabled',false)
    $('#email').focus()
}

function setTimer(ele){
    ele.html('01:00')
    ele.prop('disabled',true)
    let i = 59;
    let timer = setInterval(()=>{
      ele.html('00:'+(i+'').padStart(2,'0'))
      i = i-1;
      if(i==-1){
        clearInterval(timer);
        ele.prop('disabled',false)
        rename(ele);
      }
    },1000);
}

function echecker(value) {
    return $.ajax({
        type : 'POST',
        url: 'emailChecker',
        data:{
          email : value,
          csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
        }
      })
}

function send_otp_email(){
    $('#email').removeClass('is-invalid');
    $('#email_verify').css('display','flex');
    setTimer($('#send_email_otp'))
    userEmail = $('#email').val()
    $.ajax({
      type: 'POST',
      url: 'sendEmailOtp',
      data: {
        email: userEmail,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
      },
      success: function(data){
        $('#email').val(userEmail)
        otp = data;
      }
    });
    $('#verify_email').click(()=>{
      if($('#otp_email').val() == otp){
        emailVerified = true;
        $('#email').val(userEmail)
        $('#email_verify').remove()
        $('#send_email_otp').remove()
        $('#email').removeClass('is-invalid')
        $('#email').addClass('is-valid')
        $('#email').prop('disabled',true)
        $('#email-section').append(`<button type="button" class="outline-btn" id="email_editor" onclick="edit_email()"><i class="fas fa-pen"></i></button>`)
        $('#email').keyup(()=>{
          let theme = "light";
          if($('#checkbox').prop('checked')){
            theme = "dark";
          }
          emailVerified = false
          $('#email').removeClass('is-valid');
          $('#email-section').append(`
          <button type="button" style="font-size:inherit;" class="outline-btn {{theme}} dark-form-handler" id="send_email_otp" onclick="validateEmail()">Send OTP</button>
        <div id="email_verify" style="display:none;font-size:inherit;">
        <input type="text" style="font-size:inherit;" class="form-control {{theme}} dark-form-handler" name="otp_email" id="otp_email" placeholder="Enter OTP">
        <div style="font-size:inherit;" class="invalid-tooltip">
            Please enter the OTP recieved in this email id.
        </div>
        <button type="button" style="font-size:inherit;" class="outline-btn {{theme}} dark-form-handler" id="verify_email">Verify</button>
        </div>`)
          $('#email').unbind('keyup');
        })
      }
      else{
        $('#otp_email').addClass('is-invalid')
      }
    })
}

function validateEmail() {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let value = document.getElementById('email').value;
    if(re.test(value)){
      $.when(echecker(value)).then(function successHandler(data){
        if(data!="0"){
          send_otp_email()
        }
        else{
          $('#email-tooltip').text("Email ID not registered.")
          $('#email').removeClass('is-valid')
          $('#email').addClass('is-invalid')
        }
      }, function errorHandler(er){
        console.log(er)
      })
    }
    else{
      $('#email-tooltip').text("Please provide a valid email id!")
      $('#email').removeClass('is-valid')
      $('#email').addClass('is-invalid')
    }
  }