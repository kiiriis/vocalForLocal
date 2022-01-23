const checkbox = document.getElementById('checkbox')
checkbox.addEventListener('change', ()=>{
    $('nav').toggleClass('bg-light');
    $('nav').toggleClass('navbar-light');
    $('nav').toggleClass('bg-dark');
    $('nav').toggleClass('navbar-dark');
})

$(document).ready(function(){       
    var scroll_start = 0;
    var startchange = $('.navbar');
    var offset = document.querySelector('.navbar').offsetHeight;
    if (startchange.length){
        $(document).scroll(function() { 
        scroll_start = $(this).scrollTop();
        if(scroll_start > offset) {
            $(".navbar").addClass("nav-shadow")
            } else {
                $(".navbar").removeClass("nav-shadow")
            }
        });
    }
 });