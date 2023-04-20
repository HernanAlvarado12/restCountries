const URL_ROOTER = 'https://restcountries.com/v3.1'
const countryFragment = document.createDocumentFragment()
const countrySection = document.querySelector('section#countrySection')
const countrySectionContainer = document.querySelector('main > section:first-child.w-90')
const countryInformationContainer = document.querySelector('main > section:last-child.w-90#selectedCountry')
const countryInformation = document.getElementById('countryInformation')
const countryTemplate = document.getElementById('countryTemplate').content
const borderTemplate = document.getElementById('borderTemplate').content
const filterRegion = document.querySelector('article > section#filterRegion')
const inputCountry = document.querySelector('form > label > input[name="country"]')


const request = {
    all: `${URL_ROOTER}/all`,
    region: `${URL_ROOTER}/region`,
    search: `${URL_ROOTER}/name`
}


document.addEventListener('click', event => {
    /**
     * @type {Element}
     */
    const target = event.target
    if(target.matches('form.w-full.rounded-sm + article :is(#filterText, div, p, ion-icon)')) {
        filterRegion.classList.toggle('hidden')
    }else if(target.matches('#filterRegion > ul > li')) {
       filterRegionConsumer(target)
    }else if(target.matches('header > nav > div span')) {
        darkMode()
    }else if(target.matches('main section#countrySection :is(article, figure, img, figcaption, h3, div, p, span)')) {
        selectedCountry(target)   
    }else if(target.matches('#selectedCountry button')) {
        toggleClassListContainers()
    }
})


document.addEventListener('keyup', event => {    
    const regex = new RegExp('^[A-z\n\b\r]+$')
    if(regex.test(event.key)) {
        searchCountry()
    }
})


document.addEventListener('focusin', event => {
    filterRegion.classList.add('hidden')
})


document.addEventListener('DOMContentLoaded', event => {
    loadDarkMode()
    consumer({ clear: false, urlRequest: request.all })
})


document.addEventListener('submit', event => {
    event.preventDefault()
})


/**
 * 
 * @param {Element} currentNode 
 */
function selectedCountry(currentNode) {
    const parentElement = parentNode(currentNode, 'article.w-full.p-1.rounded-md')
    toggleClassListContainers()
    fetch(`${request.search}/${parentElement.getAttribute('data-country')}`)
        .then(response => response.json())
        .then(json => {
            console.log(json)
            const [ { name: { official: name, nativeName } , population, region, subregion, capital, tld, currencies, languages, borders = [], flags: { png: path }  } ] = json
            countryInformationContainer.querySelector('img').setAttribute('src', path);
            countryInformationContainer.querySelector('h3').textContent = name
            const listItem = countryInformationContainer.querySelectorAll('#countryInformation section > ul > li > span')
            const { official } = nativeName[Object.keys(nativeName)[0]] 
            const { name: currency } = currencies[Object.keys(currencies)[0]]
            const language = Object.keys(languages).join(',')
            const fragment = document.createDocumentFragment()
            borders.forEach(border => {
                const clone = borderTemplate.cloneNode(true)
                clone.firstElementChild.textContent = border
                fragment.append(clone)
            })
            consumerCountrySelected({ listNodes: [...listItem], json: { official, population, region, subregion, capital, tld, currency, language } })
            document.querySelector('#countryInformation > section > div > div').append(fragment)
        })
}


/**
 * @typedef {Object} darkModeTheme
 * @property {Boolean} state
 * @param {darkModeTheme} params 
 */
function darkMode() {
    const htmlElement = document.documentElement.classList
    if(htmlElement.contains('dark')) {
        htmlElement.remove('dark')
        localStorage.setItem('theme', 'light')
    }else {
        htmlElement.add('dark')
        localStorage.setItem('theme', 'dark')
    }
}


/**
 * 
 * @param {Element} currentNode 
 */
function filterRegionConsumer(currentNode) {
    inputCountry.value = ''
    filterRegion.classList.toggle('hidden')
    const value = currentNode.getAttribute('value')
    if(value === 'all') {
        consumer({ urlRequest: request.all })
    }else {
        consumer({ urlRequest: `${request.region}/${value}` })
    }
}


/**
 * @returns {void}
 */
function loadDarkMode() {
    if(localStorage.getItem('theme') === 'dark'  || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    }else {
        document.documentElement.classList.remove('dark')
    }
}


/**
 * @returns {void}
 */
function searchCountry() {
    if(inputCountry.value.length > 0) {
        consumer({ urlRequest: `${request.search}/${inputCountry.value}` })
    }else {
        consumer({ urlRequest: request.all })
    }
}



/**
 * 
 * @param {Array<Object>} jsonData 
 */
async function supplier(jsonData) {
    jsonData.forEach(country => {
        const { name: { official }, capital, region, population, flags: { png: path } } = country
        const clone = countryTemplate.cloneNode(true)
        clone.querySelector('article').setAttribute('data-country', official)
        clone.querySelector('figure > img').setAttribute('src', path)
        clone.querySelector('figcaption > h3').textContent = official
        clone.querySelector('figcaption > div #population').textContent = population
        clone.querySelector('figcaption > div #region').textContent = region
        clone.querySelector('figcaption > div #capital').textContent = capital
        countryFragment.append(clone)
    })
    countrySection.append(countryFragment)
}


/**
 * @typedef {Object} consumerAPI
 * @property {Boolean} clear
 * @property {String} urlRequest
 * @property {RequestInit} init
 * @param {consumerAPI} param 
 */
function consumer({ clear = true, urlRequest, init = {} }) {
    if(clear) clearNodes(countrySection)
    fetch(urlRequest, init)
        .then(response => response.ok? response.json() : Promise.reject(new Error('La petición no tiene contenido.')))
        .then(supplier)
        .catch(error => {})
}



/**
 * @typedef {Object} countrySelected
 * @property {Array<Node>} listNodes
 * @property {JSON} json
 * @param {selectedCountry} param 
 */
function consumerCountrySelected({ listNodes, json }) {
    Object.keys(json).forEach((key, index) => {
        listNodes[index].textContent = json[key]
    })
}



function toggleClassListContainers() {
    countrySectionContainer.classList.toggle('hidden')
    countryInformationContainer.classList.toggle('hidden')
}

/**
 * 
 * @param {Element} currentNode 
 * @param {String} match
 * @returns {Element} parentElement
 */
function parentNode(currentNode, match) {
    if(currentNode === document.body) {
        return null
    }else {
        if(currentNode.matches(match))
            return currentNode
        return parentNode(currentNode.parentElement, match)
    }
}


/**
 * 
 * @param {Element} currentNode 
 */
function clearNodes(currentNode) {
    [...currentNode.children].filter(node => node.nodeName === 'ARTICLE')
                             .forEach(node => node.remove())
}