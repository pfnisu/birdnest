import {List} from './list.js'
import {Map} from './map.js'

const site = 'Birdnest'

// Define state objects for views
const main = document.querySelector('main')
const views = [new List(main), new Map(main)]

// Construct navigation from view titles
const tabs = views.map(view => view.title)
const nav = document.querySelector('nav')
nav.innerHTML = tabs.reduce((cat, el) => `${cat}<a>${el}</a>`, '')

// Set view to activated tab 
const setView = async (ev) => {
    views.forEach(view => view.stop())
    const nav = document.querySelectorAll('nav a')
    nav.forEach(el => el.className = '')
    const index = ev ? tabs.indexOf(ev.target.textContent) : 0
    nav[index].className += 'active'
    document.title = `${site} - ${views[index].title}`
    await views[index].compose()
    views[index].start(10000)
}

// Initialize view and setup a handler for nav
setView()
nav.addEventListener('click', setView, true)
