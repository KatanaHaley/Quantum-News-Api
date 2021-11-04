const PORT = process.env.PORT || 4000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
    {
    name: 'phys',
    address:'https://phys.org/tags/quantum+computing',
    base: 'https://phys.org'
    },
    {
    name: 'mit',
    address:'https://news.mit.edu',
    base: 'https://news.mit.edu'
    },
    {
    name: 'cern',
    address:'https://home.cern',
    base: 'https://home.cern'
    },
    {
    name: 'new scientist',
    address:'https://www.newscientist.com/article-topic/large-hadron-collider',
    base: 'https://www.newscientist.com'
    },
    {
    name: 'space.com',
    address:'https://www.space.com/science-astronomy',
    base: 'https://www.space.com'
    },
  {
    name: 'nature',
    address:'https://www.nature.com/subjects/quantum-physics',
    base: 'https://www.nature.com'
    },
     {
    name: 'science',
    address:'https://www.science.org/topic/category/physics',
    base: 'https://www.science.org'
    },
      {
    name: 'scitech',
    address:'https://www.scitechdaily.com/tag/quantum-physics/',
    base: 'https://www.scitechdaily.com'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
      .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)
         $('a:contains("quantum")', html).each(function() {
           const title = $(this).text()
           const url = $(this).attr('href')
           articles.push({
               title,
               url: newspaper.base + url,
               source: newspaper.name
           })
         }
        )
    })
})

app.get('/', (req, res) => {
    res.json('Welcome to the Quantum Computing News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:searchId', async (req, res) => {
    const searchId = req.params.searchId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == searchId)[0].address

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == searchId)[0].base
    
    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("quantum")', html).each(function() {
            const title= $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: searchId
            })
        })
        res.json(specificArticles)
    }).catch(error => console.log(error))
})

app.listen(PORT, console.log(`The server is running on port ${PORT}`));