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
    name: 'newscientist',
    address:'https://www.newscientist.com/article-topic/large-hadron-collider',
    base: 'https://www.newscientist.com'
    },
    {
    name: 'space',
    address:'https://www.scientificamerican.com/space-and-physics/',
    base: 'https://www.scientificamerican.com'
    },
  {
    name: 'quanta',
    address:'https://www.quantamagazine.org/tag/quantum-physics/',
    base: 'https://www.quantamagazine.org'
    },
     {
    name: 'science',
    address:'https://www.sciencenews.org/topic/quantum-physics',
    base: 'https://www.sciencenews.org/'
    },
       {
    name: 'fermilab',
    address:'https://news.fnal.gov/tag/quantum-computing',
    base: 'https://news.fnal.gov'
    },
       {
    name: 'alice',
    address:'https://home.cern/science/experiments/alice',
    base: 'https://home.cern'
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