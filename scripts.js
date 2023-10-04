const STRINGS = {
    open: {
        en: "OPEN",
        de: "OFFEN",
    },
    closed: {
        en: "CLOSED",
        de: "GESCHLOSSEN",
    },
};

const pageLang = new Intl.Locale(document.documentElement.lang).language;
const selectedLang = pageLang === "de" ? "de" : "en";

// DOOR STATUS

const doorElem = document.getElementById("door");
const doorOverlayElem = doorElem.closest(".door-overlay");

async function refreshDoorStatus() {
    const res = await fetch("https://eingang.c3w.at/status.json");

    if (!res.ok) {
        throw new Error("Unexpected error status: " + res.status)
    }

    const {status} = await res.json();

    if (status === "open") {
        doorElem.innerHTML = STRINGS.open[selectedLang];
        doorElem.classList.add('open');
    } else if (status === "closed") {
        doorElem.innerHTML = STRINGS.closed[selectedLang];
        doorElem.classList.add('closed');
    } else {
        throw new Error("Unexpected door status: " + status);
    }

    doorOverlayElem.classList.remove("failed");
}

function setDoorFail(err) {
    doorOverlayElem.classList.add("failed");
    throw err;
}

refreshDoorStatus().catch(setDoorFail);

setInterval(() => {
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
