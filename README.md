## News Hate Detector

Hate speech and fake news has become prominent across the globe and there are very few activists and people who work on tackling it and taking action. Expert.ai's simple API makes it so much easier to find hatred and various aspects of online hate easier to detect like below:

1000 Personal Insult
2000 Discrimination and Harassment
    2100 Racism  
    2200 Sexism
    2300 Ableism
    2400 Religious Hatred
    2500 Homophobia
    2600 Classism
    2700 Body Shaming 
3000 Threat and Violence

## What it does

This simple prototype was built in a couple of hours as I discovered the hackathon at the very end just before the deadline. The idea is to be able to give a news article to the the 'Detect Hate Speech' API from expert.ai to find insights from the article's content.

For the prototype:

1. I am pulling the first article from a specific topic (Politics as shown in the demo)
2. Scraping the content from the link using JSDOM and Readability packages
3. Sending the content to https://nlapi.expert.ai/v2/detect/hate-speech/en to get some insights.

## How we built it

**Stack:** Node.js + Express + EJS + Expert.AI
**APIs:** Fetching a random article using the NEWS API (`GET https://newsapi.org/v2/everything?q=bitcoin&apiKey=API_KEY`) & Hate Speech Detector API (`https://docs.expert.ai/nlapi/latest/guide/detection/hate-speech/`)

## Challenges we ran into

I discovered the hackathon very late but the API was super simple!

## Accomplishments that we're proud of

Being able to put out a basic app in a very very short time

## Screenshots

![1](https://user-images.githubusercontent.com/4999463/198404702-de9b1ee7-7a49-448f-85ce-1be6dc792718.png)
![2](https://user-images.githubusercontent.com/4999463/198404709-500be93a-6ba7-457e-9b66-a304c210f0e6.png)
![3](https://user-images.githubusercontent.com/4999463/198404711-67146047-1d4b-4f08-bdf9-ea7f784064e9.png)

## Pitch Video

[![Pitch Video](https://img.youtube.com/vi/yLSSoWCwGVc/0.jpg)](https://www.youtube.com/watch?v=yLSSoWCwGVc)

## What's next for News Hate Detector

1. Better UI and users should be able to input a news article to gain insights
2. Showing the content in a better form highlighting the words returned from the API for the triggers identified
3. Accounts and storage system for caching already tracked articles to not make multiple wasteful API requests
4. Get initial feedback from the team and improve on the MVP and take it to actual users
