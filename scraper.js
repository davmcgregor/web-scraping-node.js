const fetch = require("node-fetch");
const cheerio = require("cheerio");

const searchUrl = `https://www.imdb.com/find?&ref_=nv_sr_sm&q=`;
const movieUrl = `https://www.imdb.com/title/`;

const searchMovies = (searchTerm) => {
  return fetch(`${searchUrl}${searchTerm}`)
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
          imdbID: null,
        };
        if (searchimdbID !== null) movie.imdbID = searchimdbID[1];

        movies.push(movie);
      });
      return movies;
    });
};

const getMovie = (imdbID) => {
  return fetch(`${movieUrl}${imdbID}`)
    .then((response) => response.text())
    .then((body) => {
      const $ = cheerio.load(body);
      const $title = $(".title_wrapper h1");

      const title = $title
        .first()
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim();

      const runTime = $("time").first().text().trim();

      const genres = [];
      $(".subtext")
        .find("a")
        .each(function (i, element) {
          genres.push($(element).text());
        });
      genres.pop();

      const releaseDate = $('a[title = "See more release dates"]')
        .text()
        .trim();

      const imdbRating = $('span[itemprop="ratingValue"]').text();

      const poster = $("div.poster a img")
        .attr("src")
        .split(/(?<=\@)/)[0];

      const summary = $("div.summary_text").text().trim();

      function getItems(itemArray) {
        return function (i, element) {
          $(element)
            .find("a")
            .each(function (i, element) {
              itemArray.push($(element).text().trim());
            });
        };
      }

      const directors = [];
      $('div.credit_summary_item:contains("Director")').each(
        getItems(directors)
      );

      const writers = [];
      $('div.credit_summary_item:contains("Writer")').each(getItems(writers));

      const stars = [];
      $('div.credit_summary_item:contains("Stars")').each(getItems(stars));
      stars.pop();

      const storyline = $("#titleStoryLine div.inline.canwrap p span")
        .text()
        .trim();

      const trailer = $("div.slate a").attr("href");

      return {
        imdbID,
        title,
        runTime,
        genres,
        releaseDate,
        imdbRating,
        poster,
        summary,
        directors,
        writers,
        stars,
        storyline,
        trailer: `https://www.imdb.com${trailer}`,
      };
    });
};

module.exports = {
  searchMovies,
  getMovie,
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
