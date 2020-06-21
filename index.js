const fetch = require("node-fetch");
const cheerio = require("cheerio");

const url = `https://www.imdb.com/find?&ref_=nv_sr_sm&q=`;

const searchMovies = (searchTerm) => {
  return fetch(`${url}${searchTerm}`).then((response) => response.text());
};

searchMovies("star wars").then((body) => {
  const movies = [];
  const $ = cheerio.load(body);
  $(".findResult").each(function (i, element) {
    const $element = $(element);
    const $image = $element.find("td a img");
    const $title = $element.find("td.result_text a");
    const movie = {
      image: $image.attr("src"),
      title: $title.text(),
    };
    movies.push(movie);
  });
  console.log(movies);
});

// const top250 = () => {
//   return fetch(`https://www.imdb.com/chart/top/`).then((response) =>
//     response.text()
//   );
// };

// top250().then((body) => {
//   const $ = cheerio.load(body);
//   $(".titleColumn").each(function (i, element) {
//     const $element = $(element);
//     console.log($element.text());
//   });
// });
