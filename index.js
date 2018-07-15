const request = require("request");
const dotenv = require('dotenv').config();

const {
  API_KEY,
} = process.env;
const apiUrl = 'https://www.alphavantage.co';

class ForeignExchange {

  constructor(source) {
    this.source = source;
  }

  async getExchangeRate(from = 'GBP', to = 'EUR') {
    return await this.source.getExchangeRate(from, to);
  }
}

class AlphaVantage {
  constructor(config) {
    this.config = config;
  }

  async getExchangeRate(from = 'GBP', to = 'EUR') {
    try {
      const response = await new Promise((resolve, reject) => {
        request.get(`${this.config.apiUrl}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${this.config.apiKey}`, (error, response, body) => {
          if (error) {
            return reject(error);
          }
          return resolve(JSON.parse(body));
        })
      });
      /**
       *
          { 'Realtime Currency Exchange Rate':
            { '1. From_Currency Code': 'GBP',
              '2. From_Currency Name': 'British Pound Sterling',
              '3. To_Currency Code': 'EUR',
              '4. To_Currency Name': 'Euro',
              '5. Exchange Rate': '1.13090765',
              '6. Last Refreshed': '2018-07-15 18:56:38',
              '7. Time Zone': 'UTC'
            }
          }
       */
      return response['Realtime Currency Exchange Rate']['5. Exchange Rate'];
    } catch (err) {
      throw err;
    }
  }
}

const fx = new ForeignExchange(new AlphaVantage({
  apiUrl,
  apiKey: API_KEY,
}));

fx.getExchangeRate()
  .then((exchangeRate) => {
    console.log('\n\n exchange', exchangeRate);
  });

