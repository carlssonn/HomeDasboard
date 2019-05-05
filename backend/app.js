const express = require('express');
const app = express();
var cors = require('cors');
const request = require('request');
const NewsAPI = require('newsapi');
const config = require('./config.json');

app.use(cors());

//HomeAssistant
//Usage: http://127.0.0.1:2999/homeassistant?state=on
app.get('/homeassistant', (req, resp) => {
  console.log('get->homeassistant');
  resp.statusCode = 200;
  resp.setHeader('Content-Type', 'application/json; charset=utf-8');

  const { host, port, script, longLovedToken } = config.homeAssistant;
  const { route, on, off } = script;
  let entity_id = null;
  if (req.query.state === 'on') {
    entity_id = on;
  } else if (req.query.state === 'off') {
    entity_id = off;
  }

  if (!entity_id) {
    const error = {
      error: 'Undefined query',
      body: 'Undefined query paramater',
    };
    resp.send(JSON.stringify(error));
    return;
  }

  request.post(
    {
      url: `${host}:${port}${route}`,
      form: JSON.stringify({ entity_id: entity_id }),
      auth: { bearer: longLovedToken },
      json: true,
    },
    (err, res, body) => {
      if (err) {
        const error = { error: err, body: body };
        resp.send(JSON.stringify(error));
      }

      resp.send(JSON.stringify(body));
    },
  );
});

//News from google news
app.get('/news', (req, resp) => {
  console.log('get->news');
  resp.statusCode = 200;
  resp.setHeader('Content-Type', 'application/json; charset=utf-8');

  const newsapi = new NewsAPI(config.news.key);
  newsapi.v2
    .topHeadlines({
      language: 'se',
      country: 'se',
    })
    .then(response => {
      resp.send(JSON.stringify(response));
    })
    .catch(err => {
      resp.send(JSON.stringify('news error', err));
    });
});

//Weather
app.get('/weather', (req, resp) => {
  console.log('get->weather');
  resp.statusCode = 200;
  resp.setHeader('Content-Type', 'application/json; charset=utf-8');
  resp.header('Access-Control-Allow-Origin: *');
  resp.header('Access-Control-Allow-Credentials: true');
  resp.header('Access-Control-Allow-Headers: Content-Length, Content-Range');
  resp.header('Access-Control-Expose-Headers: true');
  resp.header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

  request(
    `${config.openWeather.endpoint}${config.openWeather.key}`,
    { json: true },
    (err, res, body) => {
      if (err) {
        const error = { error: err, body: body };
        resp.send(JSON.stringify(error));
      }

      resp.send(JSON.stringify(body));
    },
  );
});

//Stockholms Lokaltrafik (SL)
app.get('/', (req, resp) => {
  console.log('get->SL');
  resp.statusCode = 200;
  resp.setHeader('Content-Type', 'application/json; charset=utf-8');

  request(
    `${config.sl.endpoint}${config.sl.key}`,
    { json: true },
    (err, res, body) => {
      if (err) {
        const error = { error: err, body: body };
        resp.send(JSON.stringify(error));
      }

      resp.send(JSON.stringify(body));
    },
  );
});

app.listen(config.backend.port, () =>
  console.log(
    `Server running at ${config.backend.host}:${config.backend.port}`,
  ),
);
