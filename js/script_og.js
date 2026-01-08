// Pelikartta
const map = [];

map[0] = "Vanha linnantorni";
map[1] = "Syvä kaivo";
map[2] = "Aurinkoinen metsäaukio";
map[3] = "Hui! Kuhakäärme pitää alueen asukkaita vankinaan. Voisitko auttaa heitä jotenkin?";
map[4] = "Kapea metsäpolku";
map[5] = "Vanha portti";
map[6] = "Joen ranta";
map[7] = "Vanha puupenkki";
map[8] = "Kaukainen mökki, jossa musiikki raikaa. Väki pyytää sinua liittymään mukaan. He kaipaisivat huilistia.";

const images = [];

images [0] = "torni.jpg";
images [1] = "kaivo.jpg";
images [2] = "aukio.jpg";
images [3] = "dragon.jpg";
images [4] = "polku.jpg";
images [5] = "portti_kiinni.jpg";
images [6] = "joki.jpg";
images [7] = "penkki.jpg";
images [8] = "mokki.jpg";
// images [9] = "R.jpeg";

const blockMessages = [];

blockMessages[0] = "Haluamasi reitti on liian vaarallinen.<br>";
blockMessages[1] = "Salaperäinen voima estää liikkumisen valitsemaasi suuntaan.<br>Kaivosta kuuluu kutsuvaa kaikua...<br>";
blockMessages[2] = "Vaikeaselkoinen pensas estää liikkumisen.<br>";
blockMessages[3] = "Et pääse ohittamaan kuhakäärmettä sitä kautta.<br>";
blockMessages[4] = "";
blockMessages[5] = "Portti on suljettu. Tarvitset avaimen avataksesi sen.<br>";
blockMessages[6] = "Joki on liian syvä ylitettäväksi.<br>";
blockMessages[7] = "Metsä on liian pelottava kuljettavaksi.<br>";
blockMessages[8] = "Olet liian pöyristynyt mennäksesi valitsemaasi suuntaan.<br>";

let mapLocation = 4;
console.log(map[mapLocation]);

let items = ["kivi"];
let itemLocations = [6];
const knownItems = ["huilu", "kivi", "miekka", "avain"];
let item = "";
let backPack = [];


// Pelaajan syöte
let playersInput = ""; // Alustetaan

// Pelin viesti
let gameMessage = ""; // Alustetaan

// Pelaajan käytössä olevat komennot
let actionsForPlayer = ["pohjoinen", "itä", "etelä", "länsi", "poimi", "käytä", "jätä"]; // Neljä vaihtoehtoa looppiin
let action = ""; // Tänne tallennetaan syötteet

// Käyttöliittymäelementit
const image = document.querySelector("#image");
const output = document.querySelector("#output"); // Viittaa p id(#)
const input = document.querySelector("#input"); // Viittaa input id(#)
const button = document.querySelector("#action_btn");
button.addEventListener("click", clickHandler, false);
document.addEventListener("keydown", function(event) {
    if(event.key === 'Enter') {
        button.click();
    }
}, false);

function playGame() {
    // Luetaan syöte ja muutetaan kirjaimet pieniksi
    playersInput = input.value.toLowerCase();
    gameMessage = "";
    action = "";
    item="";

    // Tarkista pelaajan syöte, löytyykö hyväksyttyjen listalta
    for(let i = 0; i < actionsForPlayer.length; i++) {
        if(playersInput.indexOf(actionsForPlayer[i]) !== -1) {
            action = actionsForPlayer[i];
            console.log(`Pelaajan valinta ${action} tunnistettiin.`);
            break;            
        }
    }
    // Minkä esineen pelaaja haluaa
    for(let i = 0; i < knownItems.length; i++) {
        if(playersInput.indexOf(knownItems[i]) !== -1) {
            item = knownItems[i]
            console.log(`Haluttu esine: ${item}`);
        }
    }
    if (action === "") {
        gameMessage = "Tuntematon toiminto.";
        render();
        return;
    }

    switch(action) {
        case "pohjoinen":
            if(mapLocation >= 3) {
            mapLocation -= 3;
            } else {
                gameMessage = blockMessages[mapLocation]
            }
            break;
        
        case "itä":
            if(mapLocation % 3 != 2) {
            mapLocation++;
            } else {
                gameMessage = blockMessages[mapLocation];
            }
            break;

        case "etelä":
            if(mapLocation <= 5) {
            mapLocation += 3;
            } else {
                gameMessage = blockMessages[mapLocation];
            }
            break;

        case "länsi":
            if(mapLocation % 3 != 0) {
            mapLocation--;
            } else {
                gameMessage = blockMessages[mapLocation];
            }
            break;

        // case "katu":
        //     if(mapLocation === 5 && käytettyAvain == true) {
        //         mapLocation = 9;
        //     } else if (mapLocation === 5 && käytettyAvain == false) {
        //         gameMessage += blockMessages[5]
        //     }
        //     break;
        
        case "poimi":
            takeItem();
            break;

        case "käytä":
            useItem();
            break

        case "jätä":
            leaveItem();
            break

        default:
            gameMessage = "Tuntematon toiminto";
    }
    render();
}

render();

function renderMap() {
    const kartta = document.querySelector("#kartta");
    kartta.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const ruutu = document.createElement("div");
        ruutu.classList.add("ruutu");
        if (i === mapLocation) {
            ruutu.classList.add("pelaaja");
            ruutu.textContent = "p";
        }
        kartta.appendChild(ruutu);
    }
}

function render() {
    output.innerHTML = `Sijaintisi: ${map[mapLocation]}<br>`; // Palauttaa HTML-elementtiin arvon | Template string -muoto = muuttuja laitetaan `$[]` sisään => f"Sijainti {}" in python
    if (gameMessage) {
        output.innerHTML += `<br> ${gameMessage}`;
    }
    for(let i = 0; i < items.length; i++) {
        if(mapLocation === itemLocations[i]) {
            output.innerHTML += `<br>Näet esineen: ${items[i]}`
        }
    }
    if(backPack.length !== 0) {
        output.innerHTML += `<br>Mukanasi on: ${backPack.join(", ")}`;
    }
    image.src = `images/${images[mapLocation]}`;
    renderMap();
}

let isMoving = false;
let käytettyAvain = false;

// Liikkuminen

document.addEventListener ("keydown", function(move) {
    if (move.key === 'ArrowUp' || move.key === 'ArrowDown' || move.key === 'ArrowLeft' || move.key === 'ArrowRight') {
        move.preventDefault();
    }
    if (isMoving) return;
    isMoving = true;
    switch(move.key) {
       case "ArrowUp":
            gameMessage = "";
            if(mapLocation >= 3) {
            mapLocation -= 3;
            } else {
                gameMessage = blockMessages[mapLocation]
            }
            break;
        case "ArrowLeft":
            gameMessage = "";
            if(mapLocation % 3 !== 0) {
            mapLocation--;
            } else {
                gameMessage = blockMessages[mapLocation];
            }
            break;
        case "ArrowDown":
            gameMessage = "";
            if(mapLocation <= 5) {
            mapLocation += 3;
            } else {
                gameMessage = blockMessages[mapLocation];
            }
            break;
        case "ArrowRight":
            gameMessage = "";
            if(mapLocation % 3 !== 2) {
            mapLocation++;
            } else {
                gameMessage = blockMessages[mapLocation];
            }
            break;
        }
        render();
        setTimeout(() => {
            isMoving = false;
        }, 200);
    }, false);


function clickHandler() {
    console.log("Nappia painettu");
    playGame();
    input.value='';
}

// Poimittavat esineet
function takeItem() {
    const itemIndexNumber = items.indexOf(item);
    console.log(`itemIndexNumber: ${itemIndexNumber}`);
    console.log(`mapLocation: ${mapLocation}`);
    console.log(`itemLocations: ${itemLocations}`);
    if(itemIndexNumber !== -1 && itemLocations[itemIndexNumber] === mapLocation) {
        backPack.push(item);
        items.splice(itemIndexNumber, 1);
        itemLocations.splice(itemIndexNumber, 1);
        gameMessage = `Poimit esineen: ${item}.<br>`;
        console.log(`Pelikentällä: ${items}`);
        console.log(`Repussa: ${backPack}`);
        if(backPack.length !== 0) {
            output.innerHTML += `<br>Mukanasi on: ${backPack.join(", ")}`;
        }
    } else {
        gameMessage += "Et voi tehdä tätä toimintoa = poimi.";
    }
    render();
}
// Jätettävät esineet
function leaveItem() {
    if(backPack.length !== 0) {
        const backPackIndexNumber = backPack.indexOf(item);
        if(backPackIndexNumber !== -1) {
            items.push(backPack[backPackIndexNumber]);
            itemLocations.push(mapLocation);
            backPack.splice(backPackIndexNumber, 1);
            gameMessage += `Pudotit esineen: ${item}.<br>`;
        } else {
            gameMessage += `Et voi tehdä tätä toimintoa = jätä.`
        }
    } else {
        gameMessage += `Sinulla ei ole mitään mukana.`
    }
    render();
}
// Käytettävät esineet
function useItem() {
    const backPackIndexNumber = backPack.indexOf(item);
    if(backPackIndexNumber === -1) {
        gameMessage += `Sinulla ei ole sitä mukanasi.`
    }
    if(backPackIndexNumber !== -1) {
        switch(item) {
            case "huilu":
                if(mapLocation === 8) {
                gameMessage += `Soittosi saa mökin väen herkistymään ja tarjoavat sinulle miekkaa palkaksi.<br>`
                backPack.splice(backPackIndexNumber, 1);
                itemLocations.push(mapLocation);
                items.push("miekka");
                console.log(`Pelikentällä: ${items}`);
                console.log(`Repussa: ${backPack}`);
                } else {
                    gameMessage += `<br>Kaunis musiikki soi ympärilläsi. Kunpa voisit soittaa sitä jonkun kanssa.<br>`
                }
                break;

            case "miekka":
                if(mapLocation === 3) {
                    gameMessage += `Taistelet kuhakäärmettä vastaan... Ja voitat sen! Hervottomat asukkaat tarjoavat sinulle avaimen.<br>`
                    backPack.splice(backPackIndexNumber, 1);
                    itemLocations.push(mapLocation);
                    items.push("avain");
                    console.log(`Pelikentällä: ${items}`);
                    console.log(`Repussa: ${backPack}`);
                } else {
                    gameMessage += `<br>Heiluttelet miekkaasi tylsistyneenä. Varo, ettet osu kehenkään... ihmiseen!`
                }
                break;
            
            case "kivi":
                if(mapLocation === 1) {
                    gameMessage += `Pudotit kiven kaivoon.<br>`
                    backPack.splice(backPackIndexNumber, 1);
                    itemLocations.push(mapLocation);
                    items.push("huilu");
                    console.log(`Pelikentällä: ${items}`);
                    console.log(`Repussa: ${backPack}`);
                } else {
                    gameMessage += `Heittelet kiveä ilmaan. Tiesitkö, että tietää onnea heittää se kaivoon.<br>`
                }
                break;

            case "avain":
                if(mapLocation === 5) {
                    gameMessage += `Avaat avaimella portin ja eteesi aukeaa uusi seikkailu.<br>`
                    käytettyAvain = true;
                    backPack.splice(backPackIndexNumber, 1);
                    itemLocations.push(mapLocation);
                    images[5] = "portti.jpg";
                    map.push = "katu";
                    console.log(`Pelikentällä: ${items}`);
                    console.log(`Repussa: ${backPack}`);
                } else {
                    gameMessage += `<br>Heittelet avain ilmaan. Varo pudottamasta sitä! Avaimet avaavat ovia.<br>`
                }
                break;
        }

    }
    render();
}