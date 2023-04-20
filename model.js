const URL_ROOTER = 'https://restcountries.com/v3.1'
const countryFragment = document.createDocumentFragment()
const countrySection = document.querySelector('section#countrySection')
const countryInformation = document.getElementById('countryInformation')
const countryTemplate = document.getElementById('countryTemplate').content
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
        inputCountry.value = ''
        filterRegion.classList.toggle('hidden')
        const value = target.getAttribute('value')
        if(value === 'all') {
            consumer({ urlRequest: request.all })
        }else {
            consumer({ urlRequest: `${request.region}/${value}` })
        }
    }else if(target.matches('header > nav > div span')) {
        darkMode()
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
 * 
 * @param {Element} currentNode 
 */
function clearNodes(currentNode) {
    [...currentNode.children].filter(node => node.nodeName === 'ARTICLE')
                             .forEach(node => node.remove())
}