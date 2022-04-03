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
                      <a href='#' class='link'>
                      <div class='row mt-2 mb-2'>
                      <div class = 'col-2'>
                          <img src="/media/{{business.display_pic}}" class = 'business'>
                      </div>
                      <div class='col-10'>
                          <h5>${business.name}</h5>
                      </div>
                      <div class='col-10'>
                          <h5>${business.state}</h5>
                      </div>
                      <div class='col-10'>
                          <h5>${business.city}</h5>
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
    console.log(e.target.value);
  
    //show result when key is up
    if (result_box.classList.contains("not-visible")) {
      result_box.classList.remove("not-visible");
    }
  
    //getting search results
    $("#result-box").empty();
    sendSearchData(e.target.value);
    // sendSearchData($('#search-input').val())
  });