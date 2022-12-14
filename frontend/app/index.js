import {Sightings} from './sightings.js'
import {Closest} from './closest.js'
import {Map} from './map.js'

const site = 'Birdnest'

// Define state objects for views
const main = document.querySelector('main')
const views = [new Sightings(main), new Closest(main), new Map(main)]

// Construct navigation from view titles
const tabs = views.map(view => view.title)
const nav = document.querySelector('nav')
nav.innerHTML = tabs.reduce((cat, el) => cat + '<a>' + el + '</a>', '')

// Set view to activated tab 
function setView(ev) {
	const key = ev ? ev.target.textContent : tabs[0]
    const nav = document.querySelectorAll('nav a')
	nav.forEach(el => el.className = '')
	nav[tabs.indexOf(key)].className += 'active'
	document.title = site + ' - ' + views[tabs.indexOf(key)].title
    views[tabs.indexOf(key)].compose()
}

// Initialize view and setup a handler for nav
setView()
nav.addEventListener('click', setView, true)
