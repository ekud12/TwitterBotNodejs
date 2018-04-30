/**
 * Dependencies
 */
const twit = require("twit");
const fetch = require("node-fetch");
const config = require("./config.js");
const twitter = new twit(config);
const tweet_search_query = process.env.BOT_TARGET_HASHES;

const getGif = () => {
  const q = `clapping+sarcastic`;
  fetch(
    `http://api.giphy.com/v1/gifs/search?api_key=${
      config.giphy_key
    }&q=${q}&limit=25`
  )
    .then(res => res.json())
    .then(json => {
      console.log(ranDom(json.data).embed_url);
      return ranDom(json.data).embed_url;
    })
    .catch(err => console.error(err));
};

/**
 * This is a function that uses predefined object to
 * search Twitter's API.
 */
const retweet = getGif => {
  const params = {
    q: tweet_search_query,
    result_type: "recent",
    lang: "en",
    count: 20,
    result_type: "popular"
  };
  /**
   *  We call Giphy api to get an appropiate gif
   *  to Post with the link to the tweet, and after
   *  the promise is resolved we use that data to
   *  update the post + add retweet count.
   */
  const q = `clapping+sarcastic`;
  fetch(
    `http://api.giphy.com/v1/gifs/search?api_key=${
      config.giphy_key
    }&q=${q}&limit=25`
  )
    .then(res => res.json())
    .then(json => {
      const gifToPost = ranDom(json.data).embed_url;

      twitter.get("search/tweets", params, (err, data) => {
        if (!err) {
          const randomTweet = ranDom(data.statuses);
          twitter.post(
            "statuses/update",
            {
              status: gifToPost
              // id: randomTweet.id_str
            },
            (err, response) => {
              if (response) {
                // console.log("Retweeted Successfully.");
              }
              if (err) {
                // console.log("Tweeted Already.");
              }
            }
          );
        } else {
          console.log("Error Occured " + err);
        }
      });
    })
    .catch(err => console.error(err));
};

/**
 * Util function - returns random item from
 * array.
 */
const ranDom = arr => {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

retweet();
