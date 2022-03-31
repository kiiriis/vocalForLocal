let blurredEle = document.getElementsByClassName('blur')

Array.from(blurredEle).forEach(ele => {
    ele.addEventListener('click',()=>{
        ele.classList.toggle('blur');
    })
});

function distSelectorTrigger(){
    $('#distanceSelector').submit();
}

$(document).ready(function(){
    document.querySelector("#b-display").firstElementChild.classList.add("active");

    for(let i = 0;i<document.querySelectorAll('.search-results .card').length;i++){
        document.querySelectorAll('.search-results .card .carousel-inner')[i].firstElementChild.classList.add("active");
    }
})