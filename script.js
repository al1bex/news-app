// Variables
const http = generateHttp();
const apiUrl = `https://newsapi.org/v2`;
const apiKey = `8e12b81cebfa41bfb34ed2f427d2de52`

const form = document.forms['form-search-news'];
const selectCountry = form.elements['select-country'];
const selectCategory = form.elements['select-category'];
const inputQuery = form.elements['search-news'];

const newsContainer = document.querySelector('.news-container > .container > .row');

form.addEventListener('submit', onFormSubmitHandler)

const newsService = (function() {
  return {
    topHeadlines(country = 'us', category = '', cb) {
      http.get(`${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`, cb);
    },

    everything(query, cb) {
      http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    }
  }
})();


document.addEventListener('DOMContentLoaded', (e) => {
  loadNews();
})

// Functions
function onFormSubmitHandler(e) {
  e.preventDefault();
  newsContainer.innerHTML = ''
  loadNews();
}

function loadNews() {
  const countryValue = selectCountry.value;
  const categoryValue = selectCategory.value;
  const queryValue = inputQuery.value;

  if(!queryValue) {
    newsService.topHeadlines(countryValue, categoryValue, onGetResponse);
  }
  else {
    newsService.everything(queryValue, onGetResponse)
  }
}

function onGetResponse(err, response) {
  if(err) return;
  renderNews(response.articles)
}

function renderNews(articles) {
  let fragment = ``;
  articles.forEach(article => fragment += newsItemTemplate(article));
  newsContainer.insertAdjacentHTML('afterbegin', fragment);
}

function newsItemTemplate({url, urlToImage, title, content, author, publishedAt}) {
  return `
  <div class="col-4">
    <div class="card mt-3">
      <img src="${urlToImage}" class="card-img-top w-100" alt="...">
      <div class="card-body">
      <h5 class="card-title"><a href="${url}" class="header5">${title}</a></h5>
      <p class="card-text">${content}</p>
        <p class="card-text"><small class="text-muted">${author}</small></p>
        <p class="card-text"><small class="text-muted mb-3">${publishedAt}</small></p>
      </div>
    </div>
  </div>
  `
}

function generateHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}

