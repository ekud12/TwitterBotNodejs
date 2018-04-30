/**
 * Dependencies
 */
const twit = require('twit');
const config = require('./config.js');
const twitter = new twit(config);
const tweet_search_query = process.env.bot_target_hashes;

/**
 * This is a function that uses predefined object to
 * search Twitter's API.
 */
const retweet = () => {
  const params = {
    q: tweet_search_query,
    result_type: 'recent',
    lang: 'en',
    count: 20,
    result_type: 'popular'
  };

  twitter.get('search/tweets', params, (err, data) => {
    if (!err) {
      console.log(data);
      const randomTweet = ranDom(data.statuses);
      //   Twitter.post(
      //     'statuses/retweet/:id',
      //     {
      //       id: retweetId
      //     },
      //     function(err, response) {
      //       if (response) {
      //         console.log('Retweeted!!!');
      //       }
      //       // if there was an error while tweeting
      //       if (err) {
      //         console.log('Something went wrong while RETWEETING... Duplication maybe...');
      //       }
      //     }
      //   );
    } else {
      console.log(err);
    }
  });
};

const ranDom = arr => {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

retweet();
