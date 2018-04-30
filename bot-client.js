/**
 * Dependencies
 */
const twit = require("twit");
const fetch = require("node-fetch");
const request = require("request").defaults({ encoding: null });
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
  let mediaIdStr = "";
  let base64Gif = "";
  fetch(
    `http://api.giphy.com/v1/gifs/search?api_key=${
      config.giphy_key
    }&q=${q}&limit=25`
  )
    .then(res => res.json())
    .then(json => {
      const gifToPost = ranDom(json.data).images.fixed_height.url;

      request.get(gifToPost, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          base64Gif = new Buffer(body).toString("base64");
          twitter.post(
            "media/upload",
            { media_data: base64Gif },
            (err, data, response) => {
              mediaIdStr = data.media_id_string;
              twitter.get("search/tweets", params, (err, data) => {
                if (!err) {
                  const randomTweetId = ranDom(data.statuses).id_str;
                  post(mediaIdStr, randomTweetId);
                }
              });
            }
          );
        }
      });
    });
};

/**
 * Util function - returns random item from
 * array.
 */
const ranDom = arr => {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

/**
 * This function actually posts the tweet using the below params:
 * @param {*} mediaId the id of the gif uploaded to media/upload api endpoint
 * @param {*} tweetId the id of the tweet we are replying to
 */
const post = (mediaId, tweetId) => {
  console.log(mediaId);
  console.log(tweetId);
  twitter.post(
    "statuses/update",
    {
      status: "Well Done.",
      auto_populate_reply_metadata: true,
      in_reply_to_status_id: tweetId,
      media_ids: [mediaId]
    },
    (err, response) => {
      if (response) {
        console.log(`Tweeted Successfully. Go Check it out!`);
      }
      if (err) {
        console.log(`Error Occured: ${err}`);
      }
    }
  );
};

/**
 * Call the bot.
 */
retweet();
