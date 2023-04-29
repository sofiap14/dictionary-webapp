const express = require('express');
const request = require('request');
require('dotenv').config();

const app = express();
const apiKey = process.env.DICTIONARY_API_KEY;

app.use(express.urlencoded({ extended: true }));

app.use('/public/css', express.static(__dirname + '/public/css', { 
    setHeaders: function (res, path, stat) {
      res.set('Content-Type', 'text/css');
    }
  }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {meaning: null, error: null});
});

app.post('/', (req, res) => {
  let word = req.body.word;
  let url = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`;
  request(url, function(err, response, body) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    if (err){
        res.render('index',{meaning: null, error: 'Error, please try again or try another word!'})
    }
    else{
        let body_content = JSON.parse(body);
        if (body_content && body_content.length > 0 && body_content[0].meta) {
            let word = body_content[0];
            let entered_word = word.meta.id.split(':')[0];
            if (!vowels.includes(word.fl[0])) {
                let messageText = `The word "${entered_word}" is a ${word.fl} and it means "${word.shortdef[0]}"`;
                res.render('index', {meaning: messageText, error: null});
            } else {
                let messageText = `The word "${entered_word}" is an ${word.fl} and it means "${word.shortdef[0]}"`;
                res.render('index', {meaning: messageText, error: null});
            }
        }
        else{
            res.render('index', {meaning: null, error: "Sorry, an error occured. Please try again or try another word!"});
        }
    }
  })
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
