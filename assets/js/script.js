function _(elId) {
    return document.getElementById(elId);
}

async function getPlanetsData(filePath) {
    let data = await fetch(filePath);
    let planets = await data.json();
    _('root').style.display = "block";
    setNavMenu(planets);
    setPlanetList(planets);
    buildPlanetContent(getPlanetNameFromUrl());
    hideLoader();
}

function showLoader() {
    _('loader').style.display = "block";
}

function hideLoader() {
    _('loader').style.display = "none";
}

function setPlanetList(planets) {
    sessionStorage.setItem('_planet_list', JSON.stringify(planets));
}

function getPlanetList() {
    return JSON.parse(sessionStorage.getItem('_planet_list'));
}

function getPlanetNameFromUrl() {
    return location.hash.replace('#', '');
}

_("hamburger-lines").addEventListener("click", function () {
    this.classList.toggle('active');
});

setTimeout(() => { // show the loader for a moment
    getPlanetsData('/assets/data.json');
}, 300);

function setNavMenu(data) {
    let ul = _('menu-items');
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        var liElement = document.createElement('li');
        var aElement = document.createElement('a');
        aElement.href = "#" + element.name;
        aElement.textContent = element.name;
        aElement.classList.add(element.name.toLowerCase());
        aElement.addEventListener("click", function () {
            _("hamburger-lines").classList.remove('active');
            buildPlanetContent(element.name);
        });
        liElement.appendChild(aElement);
        ul.appendChild(liElement);
    }
}

function buildPlanetContent(planetName) {
    let planets = getPlanetList();
    let selectedPlanet = planets.find(x => x.name === planetName);
    if (!selectedPlanet) {
        selectedPlanet = planets.find(x => x.name === planets[0].name);
    }
    _('planet-holder-img').src = selectedPlanet.images.planet;
    _('planet-description').getElementsByTagName('h2')[0].textContent = selectedPlanet.name;
    _('planet-description').getElementsByTagName('p')[0].textContent = selectedPlanet.overview.content;
    _('planet-rot-time').textContent = selectedPlanet.rotation;
    _('planet-rev-time').textContent = selectedPlanet.revolution;
    _('planet-radius').textContent = selectedPlanet.radius;
    _('planet-avg-temp').textContent = selectedPlanet.temperature;
    console.log(selectedPlanet);
}