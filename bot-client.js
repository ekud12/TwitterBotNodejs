/**
 * Dependencies
 */
const twit = require("twit");
const fetch = require("node-fetch");
const request = require("request").defaults({ encoding: null });
const config = require("./config.js");
const twitter = new twit(config);
const tweet_search_query = process.env.BOT_TARGET_HASHES;

/**
 * Params object for twit lib calls
 */
const params = {
  q: tweet_search_query,
  result_type: "recent",
  lang: "en",
  count: 20,
  result_type: "popular"
};

/**
 *  Function to get random Gif direct Url.
 *  from giphy's api.
 */
async function getGif() {
  const q = `clapping+sarcastic`;
  const res = await fetch(
    `http://api.giphy.com/v1/gifs/search?api_key=${
      config.giphy_key
    }&q=${q}&limit=25`
  );
  const json = await res.json();
  return ranDom(json.data).images.fixed_height.url;
}

/**
 * Util function to return random item from
 * @param {*} arr the incoming array of objects
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
 * This is a function that uses predefined object to
 * search Twitter's API.
 */
const tweet = async () => {
  /**
   *  We call Giphy api to get an appropiate gif
   *  to Post with the link to the tweet, and after
   *  the promise is resolved we use that data to
   *  update the post.
   */
  const q = `clapping+sarcastic`;
  let mediaIdStr = "";
  let base64Gif = "";
  const gifToPost = await getGif();
  console.log(`Stage 1 Finished - Got gif url: ${gifToPost}`);
  request.get(gifToPost, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      base64Gif = new Buffer(body).toString("base64");
      console.log(`Stage 2 Finished - Got gif base64: ${base64Gif.length}`);
      twitter.post(
        "media/upload",
        { media_data: base64Gif },
        (err, data, response) => {
          mediaIdStr = data.media_id_string;
          console.log(
            `Stage 3 Finished - Got gif twitter Media id: ${mediaIdStr}`
          );
          twitter.get("search/tweets", params, (err, data) => {
            if (!err) {
              const randomTweetId = ranDom(data.statuses).id_str;
              console.log(
                `Stage 4 Finished - Got Random Twitt: ${randomTweetId}`
              );
              post(mediaIdStr, randomTweetId);
            }
          });
        }
      );
    }
  });
};

/**
 * Call the bot.
 */
tweet();
