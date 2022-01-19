const checkbox = document.getElementById('checkbox')
checkbox.addEventListener('change', ()=>{
    $('nav').toggleClass('bg-light');
    $('nav').toggleClass('navbar-light');
    $('nav').toggleClass('bg-dark');
    $('nav').toggleClass('navbar-dark');
})