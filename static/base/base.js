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
    $('nav').toggleClass('bg-light');
    $('nav').toggleClass('navbar-light');
    $('nav').toggleClass('bg-dark');
    $('nav').toggleClass('navbar-dark');
    $('footer').toggleClass('footer-dark');
    $('footer').toggleClass('footer-light');
    $('#body').toggleClass('dark');
})

$(document).ready(function(){       
    navShadowHandler();
});