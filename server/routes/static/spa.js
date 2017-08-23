const Scraper = require(`images-scraper`);

module.exports = [

  {

    method: `GET`,
    path: `/{param*}`,

    handler: {
      file: `index.html`
    }

  }, {

    method: `GET`,
    path: `/api/{param*}`,

    handler: function (req, reply) {
      const scraper = new Scraper.Bing();

      console.log(req.params.param);
      const param = req.params.param;

      scraper.list({
        keyword: param,
        num: 1,
        detail: false
      }).then(function (response) {
        console.log(response[0].url);
        reply(response[0]);

      }).catch(function (err) {
        console.error(err);
      });
    }

  }, {

    method: `GET`,
    path: `/css/{param*}`,

    handler: {
      directory: {
        path: `./css`
      }
    }

  }, {

    method: `GET`,
    path: `/js/{param*}`,

    handler: {
      directory: {
        path: `./js`
      }
    }

  }, {

    method: `GET`,
    path: `/assets/{param*}`,

    handler: {
      directory: {
        path: `./assets`
      }
    }

  }, {

    method: `GET`,
    path: `/uploads/{param*}`,

    handler: {
      directory: {
        path: `../uploads`
      }
    }

  }

];
