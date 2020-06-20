const fetch = require("node-fetch");

const url = `https://www.imdb.com/find?&ref_=nv_sr_sm&q=`;

const searchMovies = (searchTerm) => {
  return fetch(`${url}${searchTerm}`).then((response) => response.text());
};

searchMovies("star wars").then((body) => {
  console.log(body);
});
