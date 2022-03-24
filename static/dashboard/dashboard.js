let blurredEle = document.getElementsByClassName('blur')

Array.from(blurredEle).forEach(ele => {
    ele.addEventListener('click',()=>{
        ele.classList.toggle('blur');
    })
});

$(document).ready(function(){
    document.querySelector("#b-display").firstElementChild.classList.add("active");
})