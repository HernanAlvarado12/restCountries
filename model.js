const URL_ROOTER = 'https://restcountries.com/v3.1'
const countryFragment = document.createDocumentFragment()
const countryTemplate = document.getElementById('countryTemplate').content


const request = {
    all: `${URL_ROOTER}/all`
}

document.addEventListener('DOMContentLoaded', event => {
    consumer({ urlRequest: request.all })
        .then(response => response.json())
        .then(allConsumer)
        .catch(error => console.log(error))
})


/**
 * 
 * @param {Array<Object>} jsonData 
 */
async function allConsumer(jsonData) {
    console.log(jsonData)
    jsonData.forEach(country => {
        const { name: { official }, capital, region, population, flags: { png: path } } = country
        const clone = countryTemplate.cloneNode(true)
        clone.querySelector('figure > img').setAttribute('src', path)
        clone.querySelector('figcaption > h3').textContent = official
        clone.querySelector('figcaption > div #population').textContent = population
        clone.querySelector('figcaption > div #region').textContent = region
        clone.querySelector('figcaption > div #capital').textContent = capital
        countryFragment.append(clone)
    })
    document.querySelector('section#countrySection').append(countryFragment)
}


/**
 * @typedef {Object} consumerAPI
 * @property {String} urlRequest
 * @property {RequestInit} init
 * @param {consumerAPI} param 
 */
async function consumer({ urlRequest, init = {} }) {
    return fetch(urlRequest, init)
}

