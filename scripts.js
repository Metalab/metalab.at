const STRINGS = {
    open: {
        en: "OPEN",
        de: "OFFEN",
    },
    open_since: {
        en: "Open since ",
        de: "Offen seit "
    },
    closed: {
        en: "CLOSED",
        de: "GESCHLOSSEN",
    },
    closed_since: {
        en: "Closed since ",
        de: "Geschlossen seit ",
    },
    last_update: {
        en: "Last update: ",
        de: "Letztes Update: "
    },
};

const pageLang = new Intl.Locale(document.documentElement.lang).language;
const selectedLang = pageLang === "de" ? "de" : "en";

// LAB STATUS

const labstatusElem = document.getElementById("labstatus");
const labstatusOverlayElem = labstatusElem.closest(".labstatus-overlay");

async function refreshLabStatus() {
    const res = await fetch("https://eingang.metalab.at/status.json");

    if (!res.ok) {
        throw new Error("Unexpected error status: " + res.status)
    }

    const labstatus_json = await res.json();
    let lab_state = labstatus_json.status;
    /*var hass_state = labstatus_json.state;
    var hass_last_changed_date = new Date(labstatus_json.last_changed_utc);
    var hass_last_updated_date = new Date(labstatus_json.last_updated_utc);

    const date_options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
    };

    //return localized and formatted date
    var hass_last_changed_date_formatted = new Intl.DateTimeFormat(undefined, date_options).format(hass_last_changed_date);
    var hass_last_updated_date_formatted = new Intl.DateTimeFormat(undefined, date_options).format(hass_last_updated_date);*/

    //if (hass_state === "on") {
    if (lab_state === "open") {
        labstatusElem.innerHTML = STRINGS.open[selectedLang];
        //labstatusOverlayElem.title = STRINGS.open_since[selectedLang] + hass_last_changed_date_formatted;
        labstatusElem.classList.add('open');
    //} else if (hass_state === "off") {
    } else if (lab_state === "closed") {
        labstatusElem.innerHTML = STRINGS.closed[selectedLang];
        //labstatusOverlayElem.title = STRINGS.closed_since[selectedLang] + hass_last_changed_date_formatted;
        labstatusElem.classList.add('closed');
    } else {
        //throw new Error("Unexpected lab status: " + hass_state);
        throw new Error("Unexpected lab status: " + lab_state);
    }

    /*if ((new Date().getTime() - hass_last_updated_date.getTime()) >= 900_000) { //15 minutes
        labstatusElem.innerHTML += " (!)";
        labstatusOverlayElem.title += "\n" + STRINGS.last_update[selectedLang] + hass_last_updated_date_formatted;
    }*/

    labstatusOverlayElem.classList.remove("failed");
}

function setLabFail(err) {
    labstatusOverlayElem.classList.add("failed");
    throw err;
}

refreshLabStatus().catch(setLabFail);

// DOOR STATUS

const doorElem = document.getElementById("door");
const doorOverlayElem = doorElem.closest(".door-overlay");

async function refreshDoorStatus() {
    const res = await fetch("https://eingang.metalab.at/doorstatus.json");

    if (!res.ok) {
        throw new Error("Unexpected error status: " + res.status)
    }

    const doorstatus_json = await res.json();
    let door_state = doorstatus_json.status;
    /*var hass_state = labstatus_json.state;
    var hass_last_changed_date = new Date(labstatus_json.last_changed_utc);
    var hass_last_updated_date = new Date(labstatus_json.last_updated_utc);

    const date_options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
    };

    //return localized and formatted date
    var hass_last_changed_date_formatted = new Intl.DateTimeFormat(undefined, date_options).format(hass_last_changed_date);
    var hass_last_updated_date_formatted = new Intl.DateTimeFormat(undefined, date_options).format(hass_last_updated_date);*/

    //if (hass_state === "on") {
        if (door_state === "open") {
        doorElem.innerHTML = STRINGS.open[selectedLang];
        //doorOverlayElem.title = STRINGS.open_since[selectedLang] + hass_last_changed_date_formatted;
        doorElem.classList.add('open');
    } else if (door_state === "closed") {
    //} else if (hass_state === "off") {
        doorElem.innerHTML = STRINGS.closed[selectedLang];
        //doorOverlayElem.title = STRINGS.closed_since[selectedLang] + hass_last_changed_date_formatted;
        doorElem.classList.add('closed');
    } else {
        //throw new Error("Unexpected door status: " + hass_state);
        throw new Error("Unexpected door status: " + door_state);
    }

    /*if ((new Date().getTime() - hass_last_updated_date.getTime()) >= 900_000) { //15 minutes
        doorElem.innerHTML += " (!)";
        doorOverlayElem.title += "\n" + STRINGS.last_update[selectedLang] + hass_last_updated_date_formatted;
    }*/

    doorOverlayElem.classList.remove("failed");
}

function setDoorFail(err) {
    doorOverlayElem.classList.add("failed");
    throw err;
}

refreshDoorStatus().catch(setDoorFail);

// REFRESH TIMERS

setInterval(() => {
    refreshLabStatus().catch(setLabFail);
    refreshDoorStatus().catch(setDoorFail);
}, 30_000);

// VIDEO PLAY AND PAUSE

const video = document.querySelector('header > video');
const playsymbol = document.querySelector('header > .playpause > .playsymbol');
const pausesymbol = document.querySelector('header > .playpause > .pausesymbol');

video.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playsymbol.style.display = 'none';
        pausesymbol.style.display = 'block';
    } else {
        video.pause();
        playsymbol.style.display = 'block';
        pausesymbol.style.display = 'none';
    }
});

// NAVBAR TOGGLE FUNCTIONALITY

function toggleNavbar() {
    const menu = document.querySelector('nav > ul');
    menu.classList.toggle('show');
}
