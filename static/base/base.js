function navShadowHandler(){
    var scroll_start = 0;
    var startchange = $('.navbar');
    var offset = document.querySelector('.navbar').offsetHeight;
    if (startchange.length){
        $(document).scroll(function() { 
        scroll_start = $(this).scrollTop();
            if(scroll_start > offset) {
                if($('#checkbox').prop('checked')){
                    $(".navbar").addClass("nav-shadow-dark")
                }
                else{
                    $('.navbar').addClass("nav-shadow-light")
                }
            }
            else {
                if($('#checkbox').prop('checked')){
                    $(".navbar").removeClass("nav-shadow-dark")
                    $('.navbar').removeClass("nav-shadow-light")
                }
                else{
                    $('.navbar').removeClass("nav-shadow-light")
                    $('.navbar').removeClass("nav-shadow-dark")
                }
            }
        });
    }
}

const checkbox = document.getElementById('checkbox')
checkbox.addEventListener('change', ()=>{
    if($(document).scrollTop()>document.querySelector('.navbar').offsetHeight){
        if($('#checkbox').prop('checked')){
            $(".navbar").addClass("nav-shadow-dark")
            $('.navbar').removeClass("nav-shadow-light")
        }
        else{
            $('.navbar').addClass("nav-shadow-light")
            $(".navbar").removeClass("nav-shadow-dark")
        }
    }
    else{
        if($('#checkbox').prop('checked')){
            $(".navbar").removeClass("nav-shadow-dark")
            $('.navbar').removeClass("nav-shadow-light")
        }
        else{
            $('.navbar').removeClass("nav-shadow-light")
            $('.navbar').removeClass("nav-shadow-dark")
        }
    }
    $('body').toggleClass('dark')
    $('body').toggleClass('light')
    $('#intro').toggleClass('dark')
    $('#intro').toggleClass('light')
    $('nav').toggleClass('bg-light');
    $('nav').toggleClass('navbar-light');
    $('nav').toggleClass('bg-dark');
    $('nav').toggleClass('navbar-dark');
    $('footer').toggleClass('footer-dark');
    $('footer').toggleClass('footer-light');
    $('#body').toggleClass('dark');
})

// Ripple

var addRippleEffect = function (e) {
    var target = e.target;
    if (target.tagName.toLowerCase() !== 'button') return false;
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}

$(document).ready(function(){
    navShadowHandler();
    let buts = document.getElementsByClassName("rippler");
    for (let i = 0; i < buts.length; i++) {
        buts[i].addEventListener('click', addRippleEffect, false);
    }
})