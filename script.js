
// grab relevant elements from the html,
// <ul> when appending new li children (e.g. to do list)
// <div> when want to append new elements inside
// <input> and <form> when using user input data (to store or append or smth)
let searchInput = $("#search-input");
let searchForm = $("#search-form");

function submitSearchForm(event){
    // remember (event) needs to be in the function to allow the linked event listener to work 
    event.preventDefault();
    // ^prevents the glitching of the website whenever something happens
    alert(searchInput.val().trim());
    // ^simple to explain but dont forget whenever dealing with an input tag.
};

searchForm.on("submit", submitSearchForm);
// dont add in the () when doing an eventlistener, messes up for some reason.