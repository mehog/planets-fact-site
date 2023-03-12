function _(elId) {
    return document.getElementById(elId);
}

const _loader = _('loader');
const _planetDescriptionsource = _('planet-description-source');
const _planetDescription = _('planet-description');
const _planetHolderImg = _('planet-holder-img');


function addListenerForBtnToggle() {
    const btnGroup = document.querySelector('.btn-toggle-group');
    btnGroup.addEventListener('click', (event) => {
        let clickedBtn;
        if (event.target.classList.contains('btn')) {
            clickedBtn = event.target;
        }
        if (event.target.tagName === 'SPAN') {
            clickedBtn = event.target.parentNode;
        }
        toggleActiveClass(clickedBtn);
    });
}

async function getPlanetsData(filePath) {
    let data = await fetch(filePath);
    let planets = await data.json();
    setNavMenu(planets);
    setPlanetList(planets);
    buildPlanetContentOverview(getPlanetNameFromUrl());
    hideLoader();
    preselectMenuItem();
    _('root').style.display = "block";
}

addListenerForBtnToggle();

setTimeout(() => { // show the loader for a moment
    getPlanetsData('/assets/data.json');
}, 300);

function toggleActiveClass(clickedBtn) {
    if (clickedBtn) {
        let selectedPlanet = getSelectedPlanet(getPlanetNameFromUrl());
        let selectedPlanetName = selectedPlanet.name.toLowerCase();

        clickedBtn.classList.add('active');
        clickedBtn.dataset.activePlanet = selectedPlanetName;
        const siblings = Array.from(clickedBtn.parentNode.children).filter((child) => child !== clickedBtn);
        siblings.forEach((sibling) => sibling.classList.remove('active'));
    }
}

_('planet-overiew').addEventListener('click', function() {
    buildPlanetContentOverview(getPlanetNameFromUrl());
});

_('planet-internal-structure').addEventListener('click', function() {
    let selectedPlanet = getSelectedPlanet(getPlanetNameFromUrl());

    _planetDescription.getElementsByTagName('p')[0].textContent = selectedPlanet.structure.content;
    _planetDescriptionsource.href = selectedPlanet.structure.source;
    _planetHolderImg.src = selectedPlanet.images.internal;
});

_('planet-surface-geology').addEventListener('click', function() {
    let selectedPlanet = getSelectedPlanet(getPlanetNameFromUrl());

    _planetDescription.getElementsByTagName('p')[0].textContent = selectedPlanet.geology.content;
    _planetDescriptionsource.href = selectedPlanet.geology.source;
    _planetHolderImg.src = selectedPlanet.images.geology;
});

function showLoader() {
    _loader.style.display = "block";
}

function hideLoader() {
    _loader.style.display = "none";
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

function setNavMenu(data) {
    let ul = _('menu-items');

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        var liElement = document.createElement('li');
        var aElement = document.createElement('a');

        liElement.classList.add(element.name.toLowerCase());
        aElement.href = "#" + element.name;
        aElement.textContent = element.name;
        aElement.classList.add(element.name.toLowerCase());
        liElement.addEventListener("click", function () {
            _("hamburger-lines").classList.remove('active');
            buildPlanetContentOverview(element.name);
            toggleActiveClass(this);
        });
        liElement.appendChild(aElement);
        ul.appendChild(liElement);
    }
}

function buildPlanetContentOverview(planetName) {
    let selectedPlanet = getSelectedPlanet(planetName);
    let selectedPlanetName = selectedPlanet.name;

    _('planet-overiew').dataset.activePlanet = selectedPlanetName.toLowerCase();
    _('planet-internal-structure').dataset.activePlanet = selectedPlanetName.toLowerCase();
    _('planet-surface-geology').dataset.activePlanet = selectedPlanetName.toLowerCase();

    _planetDescription.getElementsByTagName('h1')[0].textContent = selectedPlanetName;
    _planetDescription.getElementsByTagName('p')[0].textContent = selectedPlanet.overview.content;
    _planetDescriptionsource.href = selectedPlanet.overview.source;
    _planetHolderImg.src = selectedPlanet.images.planet;

    _('planet-rot-time').textContent = selectedPlanet.rotation;
    _('planet-rev-time').textContent = selectedPlanet.revolution;
    _('planet-radius').textContent = selectedPlanet.radius;
    _('planet-avg-temp').textContent = selectedPlanet.temperature;

    setTimeout(() => {
        toggleActiveClass(_('planet-overiew'));
    }, 100);

}

function getSelectedPlanet(planetName) {
    let planets = getPlanetList();
    let selectedPlanet = planets.find(x => x.name === planetName);
    if (!selectedPlanet) {
        selectedPlanet = planets.find(x => x.name === planets[0].name);
    }
    return selectedPlanet;
}

function preselectMenuItem() {
    let planets = getPlanetList();
    let selectedPlanet = getSelectedPlanet(getPlanetNameFromUrl()) || planets[0].name;
    let menuItem = document.querySelector('.menu-items li.' + selectedPlanet.name.toLowerCase());
    menuItem.classList.add('active');
}