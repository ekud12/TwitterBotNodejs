require("dotenv").config();
const consumer_key = process.env.TWITTER_CONSUMER_KEY;
module.exports = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  giphy_key: process.env.GIPHY_KEY,
  gif_api: `http://api.giphy.com/v1/gifs/search?api_key=`
};
