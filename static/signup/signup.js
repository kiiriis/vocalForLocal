let otp,userEmail,emailVerified = false,unameVerified = false,phoneVerified = false,username;

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
        <button type="button" class="outline-btn {{theme}} dark-form-handler" id="send_email_otp" onclick="validateEmail()">Send OTP</button>
      <div id="email_verify" style="display:none;">
        <input type="text" class="form-control {{theme}} dark-form-handler" name="otp_email" id="otp_email" placeholder="Enter OTP">
        <div class="invalid-tooltip">
          Please enter the OTP recieved in this email id.
        </div>
        <button type="button" class="outline-btn {{theme}} dark-form-handler" id="verify_email">Verify</button>
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
      if(data==="0"){
        send_otp_email()
      }
      else{
        $('#email-tooltip').text("Email ID already in use.")
        $('#email').removeClass('is-valid')
        $('#email').addClass('is-invalid')
      }
    }, function errorHandler(er){
      console.log(er)
    })
  }
  else{
    $('#email-tooltip').text("Please provide a valid email id and get it verified. It won't be shared with any third party applications and you won't recieve any promotional messages, so feel free to verify yourselves!")
    $('#email').removeClass('is-valid')
    $('#email').addClass('is-invalid')
  }
}

function validatePhone(){
  let ele = $('#phno')
  let value = document.getElementById('phno').value
  var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
  if(filter.test(value)){
    $.ajax({
      type : 'POST',
      url: 'phoneChecker',
      data:{
        phno : value,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
      },
      success: function(data){
        if(data==="0"){
          phoneVerified = true;
          $(ele).removeClass('is-invalid')
          $(ele).addClass('is-valid')
        }
        else{
          phoneVerified = false;
          $('#phone-tooltip').text("Phone number already in use.");
          $(ele).removeClass('is-valid')
          $(ele).addClass('is-invalid')
        }
      }
    })
  }
  else{
      phoneVerified = false;
      $('#phone-tooltip').text("Please enter a valid phone number.");
      $(ele).removeClass('is-valid')
      $(ele).addClass('is-invalid')
  }
}

function getLocation(){
  if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(successfulLookup, denial, {enableHighAccuracy: true});
  }
}

function successfulLookup(position){
  const { latitude, longitude } = position.coords;
  $('#latitude').val(latitude)
  $('#longitude').val(longitude)
}

function denial(position){
  var myModal = new bootstrap.Modal(document.getElementById('grantLocation'), {
      keyboard: false
  })
  myModal.show()
  setInterval(() => {
      navigator.permissions.query({name:'geolocation'}).then(function(result) {
      if (result.state === 'granted') {
          myModal.hide()
          getLocation()
      }
      });
  }, 1000);
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

function rename(ele){
  ele.html('Resend OTP');
}

function edit_email(){
  $('#email_editor').remove()
  $('#email').prop('disabled',false)
  $('#email').focus()
}

$('#username').keyup(()=>{
  $('#username').removeClass("is-invalid")
  $('#username').removeClass("is-valid")
})

$('#username').change(()=>{
  let val = $('#username').val();
  let regex = /^[a-z0-9-\\_]{3,30}$/;
  let multiHyphens = /[-]{2,}/;
  let multiUnderScores = /[_]{2,}/;
  let allSpecials = /^[\\_\\-]+$/g;
  if(regex.test(val) && !multiHyphens.test(val) && !multiUnderScores.test(val) && !allSpecials.test(val)){
      $.ajax({
      type: 'POST',
      url: 'unameChecker',
      data:{
        username: val,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
      },
      success: function(data){
        if(data == "1"){
          $('#username-tooltip').text("Username already taken")
          unameVerified = false
          $('#username').removeClass('is-valid');
          $('#username').addClass('is-invalid');
        }
        else{
          unameVerified = true;
          username = val;
          $('#username').removeClass('is-invalid');
          $('#username').addClass('is-valid');
        }
      }
    })
  }
  else{
    if(!regex.test(val)){
      $('#username-tooltip').text("Valid username includes letters from a-z, 0-9, - and _ with minimum length = 3")
    }
    else{
      $('#username-tooltip').text("Multiple special characters not allowed")
    }
    unameVerified = false
    $('#username').removeClass('is-valid');
    $('#username').addClass('is-invalid');
  }
})

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

$('#country').change(inputValidator);
$('#state').change(inputValidator);
$('#city').change(inputValidator);

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
  if($('#pass-2').val().length > 0){
    pass2Checker()
  }
})

function pass2Checker(){
  if($('#pass-2').val() == $('#pass-1').val() && $('#pass-2').val().trim().length>7){
    $('#pass-2').removeClass('is-invalid')
    $('#pass-2').addClass('is-valid')
  }
  else{
    $('#pass-2').removeClass('is-valid')
    $('#pass-2').addClass('is-invalid')
  }
}

$('#pass-2').keyup(pass2Checker)

function numbersOnly(ele){
  if ($(ele).val().trim().length>0 && isNaN($(ele).val() / 1) == false) {
      $(ele).removeClass('is-invalid')
      $(ele).addClass('is-valid')
  }
  else{
      $(ele).removeClass('is-valid')
      $(ele).addClass('is-invalid')
  }
}

$('#zip').keyup(()=>{numbersOnly($('#zip'))});
$('#phno').change(()=>{validatePhone()});

$('#address').keyup(inputValidator)

$('#agree').change(function(){
  if($('#agree').prop('checked')){
    getLocation();
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

    // Country, State, City
    if($('#country').val().length>0){
        $('#country').removeClass('is-invalid');
        $('#country').addClass('is-valid');
    }
    else{
        proper = false
        $('#country').removeClass('is-valid')
        $('#country').addClass('is-invalid');
    }
    if($('#state').val().length>0){
        $('#state').removeClass('is-invalid');
        $('#state').addClass('is-valid');
    }
    else{
        proper = false
        $('#state').removeClass('is-valid')
        $('#state').addClass('is-invalid');
    }
    if($('#city').val().length>0){
        $('#city').removeClass('is-invalid');
        $('#city').addClass('is-valid');
    }
    else{
        proper = false
        $('#city').removeClass('is-valid')
        $('#city').addClass('is-invalid');
    }

    // Email verified
    if(!emailVerified){
      $('#email').removeClass('is-valid')
      $('#email').addClass('is-invalid')
      proper = false
    }
    else{
      $('#email').val(userEmail)
    }

    // Phone
    if(!phoneVerified){
      proper = false;
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

    // Username
    if(unameVerified){
      $('#username').removeClass('is-invalid')
      $('#username').addClass("is-valid")
      $('#username').val(username)
    }
    else{
      proper = false
      $('#username-tooltip').text("Please enter a valid username.")
      $('#username').removeClass('is-valid')
      $('#username').addClass('is-invalid')
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
    else{
      event.preventDefault();
      event.stopPropagation();
      getLocation()
      navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state === 'granted') {
            $('#email').prop('disabled',false);
            $('#signup_form').submit()
        }
      });
    }

  // form.classList.add('was-validated')
}, false)


// Country, State and City

let auth_token,api_token,auth_email;

function getToken() {
  $.ajax({
    type: 'get',
    url: 'https://www.universal-tutorial.com/api/getaccesstoken',
    success: function (data) {
      api_token = data.auth_token;
    },
    error: function (error) {
      console.log(error);
    },
    headers: {
      "Accept": "application/json",
      "api-token": auth_token,
      "user-email": auth_email,
    }
  })
}
function setter(val,email){
  auth_token = val
  auth_email = email
  getToken()
}

$(document).ready(function(){
  $('#country').click(function () {
    getCountries();
    $('#country').unbind('click');
  })
  $('#country').change(getStates)
  $('#state').change(getCities)
})

function getCountries() {
  $.ajax({
    type: 'get',
    url: 'https://www.universal-tutorial.com/api/countries',
    success: function (data) {
      $('#country').empty();
      data.forEach((ele) => {
        $('#country').append(`<option value="${ele.country_name}">${ele.country_name}</option>`);
      })
      getStates();
    },
    error: function (error) {
      console.log(error);
    },
    headers: {
      "Authorization": "Bearer " + api_token,
      "Accept": "application/json",
    }
  })
}
function getStates() {
  $.ajax({
    type: 'get',
    url: 'https://www.universal-tutorial.com/api/states/' + $('#country').val(),
    success: function (data) {
      $('#state').empty();
      data.forEach((ele) => {
        $('#state').append(`<option value="${ele.state_name}">${ele.state_name}</option>`);
      })
      getCities();
    },
    error: function (error) {
      console.log(error);
    },
    headers: {
      "Authorization": "Bearer " + api_token,
      "Accept": "application/json"
    }
  })
}
function getCities() {
  $.ajax({
    type: 'get',
    url: 'https://www.universal-tutorial.com/api/cities/' + $('#state').val(),
    success: function (data) {
      $('#city').empty();
      data.forEach((ele) => {
        $('#city').append(`<option value="${ele.city_name}">${ele.city_name}</option>`);
      })
      if(data.length == 0){
        $('#city').append(`<option value="none">none</option>`);
      }
    },
    error: function (error) {
      console.log(error);
    },
    headers: {
      "Authorization": "Bearer " + api_token,
      "Accept": "application/json"
    }
  })
}

// Dark form handler --------------------------------------------------------------------------------------------------

let darkElements = $('.dark-form-handler').length
$('#checkbox').change(function(){
  for(let i = 0;i<darkElements;i++){
    document.getElementsByClassName('dark-form-handler')[i].classList.toggle('dark');
  }
})

// Private & Business names --------------------------------------------------------------------------------------------------

function name_handlers(){
  if($('#account-b').prop('checked')){
    $('#first_name_div label').text("Owner's first name")
    $('#last_name_div label').text("Owner's last name")
    $('#username-div label').text("Owner's username")
    $('#email-section label').text("Owner's email")
    $('#phno-div label').text("Owner's phone number")
    $('#zip-div label').text("Owner's zip code")
    $('#address-div span').text("Owner's address")
  }
  else{
    $('#first_name_div label').text("First name")
    $('#last_name_div label').text("Last name")
    $('#username-div label').text("Username")
    $('#email-section label').text("Email")
    $('#phno-div label').text("Phone number")
    $('#zip-div label').text("Zip code")
    $('#address-div span').text("Address")
  }
}

$('#account-p').change(()=>{name_handlers()})
$('#account-b').change(()=>{name_handlers()})