const form = document.querySelector("form");
const searchInput = document.querySelector("input");

form.addEventListener("submit", formSubmitted);

function formSubmitted(event) {
  event.preventDefault();

  const searchTerm = searchInput.value;
  getSearchResults(searchTerm);
}
