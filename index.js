
const express = require('express');
const { Deta } = require('deta');
const axios = require('axios');
const { join } = require('path');
const bodyParser = require('body-parser');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const e = require('express');
require('dotenv').config();

const deta = Deta('tzvm6'); // configure your Deta project
const db = deta.Base('simpleDB');  // access your DB

const app = express(); // instantiate express
app.use(express.json())
app.use(express.static(join(__dirname, "/public")));
app.set('view engine', 'ejs');
const port = 3000
app.engine('html', require('ejs').renderFile)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/', (req, res) => {
  // Build the URL we are going request. This will get articles related to Apple and sort them newest first
  let url = 'https://newsapi.org/v2/everything?' +
  'q=Ukraine&' +
  'sortBy=publishedAt&' +
  'apiKey='+process.env.NEWS_API_KEY;
  console.log(url);
  let articleContent;
  
  //get article content
  axios.get(url).then(function(r1) {
    let firstResult = r1.data.articles[0];
    axios.get(firstResult.url).then(async function(r2) {
      let dom = new JSDOM(r2.data, {
        url: firstResult.url
      });
      let article = new Readability(dom.window.document).parse();

      articleContent = article.textContent;
      
      callExpertAI(articleContent).then(result => {
        console.log(result)
        res.render('index', {response: '', error: '', pageTitle: '🔥 News Hate Detector', hateIdentified: result.hateIdentified, hateWordsArray: result.hateWordsArray, parsedURL: firstResult.url, parsedContent: articleContent, articleTitle: firstResult.title, articleImage: firstResult.urlToImage, articleAuthor: firstResult.author});
      });

    }).catch((err) => console.log(err));
  }).catch((err) => console.log(err));
  
})
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/parser',(req, res) => {
  var exampleContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
  var exampleResponse = '[{"namespace":"hate-speech_en_1.1","id":"2100","label":"Racism","hierarchy":["Racism"],"score":80,"frequency":12.3,"winner":true,"positions":[{"start":2500,"end":2505},{"start":2515,"end":2521},{"start":2593,"end":2598},{"start":2619,"end":2622}]},{"namespace":"hate-speech_en_1.1","id":"2400","label":"Religious Hatred","hierarchy":["Religious Hatred"],"score":480,"frequency":73.83,"winner":true,"positions":[{"start":2490,"end":2493},{"start":2494,"end":2499},{"start":2500,"end":2505},{"start":2515,"end":2521}]},{"namespace":"hate-speech_en_1.1","id":"3000","label":"Threat and Violence","hierarchy":["Threat and Violence"],"score":90,"frequency":13.84,"winner":true,"positions":[{"start":1772,"end":1778},{"start":1790,"end":1798},{"start":1814,"end":1828}]}]';
  var parsedJSON = JSON.parse(exampleResponse);
  const hateIdentified = [];
  var hateWordsArray = [];
  var hateWordsString = "";
  //console.log(parsedJSON);

  //console.log('Total length: ' + parsedJSON.length);
  parsedJSON.forEach(element => {
    hateIdentified.push(element.label)
    for(let i=0; i<element.positions.length; i++) {
      if(i==0){
        hateWordsString = exampleContent.substring(element.positions[i]['start'], element.positions[i]['end']);
      } else {
        hateWordsString += ","+ exampleContent.substring(element.positions[i]['start'], element.positions[i]['end']);
      }
      exampleContent.replace(exampleContent.substring(element.positions[i]['start'], element.positions[i]['end']), "<span id='" + element.label +"'>" + exampleContent.substring(element.positions[i]['start'], element.positions[i]['end']) + "</span>")
    }
    hateWordsArray[element.label] = hateWordsString;
  });
  console.log(hateIdentified);
  console.log(hateWordsArray);
  res.send(exampleContent);
})

async function callExpertAI(articleContent) {
  const hateIdentified = [];
  var hateWordsArray = [];
  var hateWordsString = "";
  try {
    let response = await axios.post('https://nlapi.expert.ai/v2/detect/hate-speech/en', {"document": {"text": articleContent}}, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+process.env.EXPERT_API_TOKEN
    }
    });

    if(response.status == 200){
      var parsedJSON = response.data.data.categories;
      parsedJSON.forEach(element => {
        hateIdentified.push(element.label);
        for(let i=0; i<element.positions.length; i++) {
          if(i==0){
            hateWordsString = articleContent.substring(element.positions[i]['start'], element.positions[i]['end']);
          } else {
            hateWordsString += ","+ articleContent.substring(element.positions[i]['start'], element.positions[i]['end']);
          }
        }
        hateWordsArray.push(element.label + ":" + hateWordsString);
      });
    }

    return {
      'hateIdentified': hateIdentified,
      'hateWordsArray': hateWordsArray,
      'articleContent': articleContent
    };
    
  }
  catch (err) {
    console.error(err);
  };
}
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

//for production
module.exports = app; 