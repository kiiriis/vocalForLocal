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
    if(document.querySelector('#adder-container').childElementCount>1 && document.querySelector("#b-display").childElementCount > 0) document.querySelector("#b-display").firstElementChild.classList.add("active");

    for(let i = 0;i<document.querySelectorAll('.search-results .card').length;i++){
        document.querySelectorAll('.search-results .card .carousel-inner')[i].firstElementChild.classList.add("active");
    }
})

// Krish Changes
const sendSearchData = (business) => {
  // $("#result-box").empty();
    $.ajax({
      type: "POST",
      url: 'search/',
      data: {
        csrfmiddlewaretoken: csrf,
        'business' : business,
      },
      success: (res) => {
        $("#result-box").empty();
        const data = res.data;
        result_box.innerHTML += "";
        if (Array.isArray(data)) {
          result_box.innerHTML;
          data.forEach((business) => {
            result_box.innerHTML += `
                      <a href="`+`/business/${business.name}`+`" class='link' style="text-decoration:none;">
                      <div class='row mt-2 mb-2' id="#sc">
                      <div class = 'col-2'>
                          <img src="${business.image}" class = 'business'>
                      </div>
                      <div class='col-10'>
                          <div style="font-size: 18px;font-weight: 500;">${business.name} <span style="font-size: 13px;">(${business.city}, ${business.state}, ${business.country})</span></div>
                      </div>
                  </div>
                      </a>`;
          });
        } else {
          // if (search_input.value.length > 0) {
          //   result_box.innerHTML = `<b>${data}</b>`;
          // } 
          if ($('#search').val().length > 0)
          {
            result_box.innerHTML = `<b>${data}</b>`;
          }
          else{
            result_box.classList.add("not-visible");
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  };
  
  // get-search-form
  const search_form = document.getElementById("search-form");
  //get-search input
  const search_input = document.getElementById("search");
  
  const result_box = document.getElementById("result-box");
  
  // csrf token
  const csrf = document.getElementsByName("csrfmiddlewaretoken")[0].value;
  search_input.addEventListener("keyup", (e) => {
    if($('#search').val().trim().length == 0){
      $('#result-box').empty();
      $('#result-box').css('display','none');
    }
    else{
      $('#result-box').css('display','block');
    }
    // console.log(e.target.value);
  
    //show result when key is up
    if (result_box.classList.contains("not-visible")) {
      result_box.classList.remove("not-visible");
    }
  
    //getting search results
    $("#result-box").empty();
    sendSearchData(e.target.value);
    // sendSearchData($('#search-input').val())
  });