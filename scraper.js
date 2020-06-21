const fetch = require("node-fetch");
const cheerio = require("cheerio");

const url = `https://www.imdb.com/find?&ref_=nv_sr_sm&q=`;

const searchMovies = (searchTerm) => {
  return fetch(`${url}${searchTerm}`)
    .then((response) => response.text())
    .then((body) => {
      const movies = [];
      const $ = cheerio.load(body);
      $(".findResult").each(function (i, element) {
        const $element = $(element);
        const $image = $element.find("td a img");
        const $title = $element.find("td.result_text a");
        const searchimdbID = $title.attr("href").match(/title\/(.*)\//);

        const movie = {
          image: $image.attr("src"),
          title: $title.text(),
          imdbID: null
        };
        if (searchimdbID !== null) movie.imdbID = searchimdbID[1];

        movies.push(movie);
      });
      return movies;
    });
};

module.exports = {
  searchMovies,
};

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
