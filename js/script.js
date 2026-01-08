// Pelikartta
const maps = [
["Vanha linnantorni", "Syvä kaivo", "Aurinkoinen metsäaukio", "Hui! Kuhakäärme pitää alueen asukkaita vankinaan. Voisitko auttaa heitä jotenkin?",
    "Kapea metsäpolku", "Vanha portti", "Joen ranta", "Vanha puupenkki", "Kaukainen mökki, jossa musiikki raikaa. Väki pyytää sinua liittymään mukaan. He kaipaisivat huilistia."
],
["TBT", "TBT", "TBT", "Kuja", "TBT", "TBT", "TBT", "TBT", "TBT"]
];

const images = [
["torni.jpg", "kaivo.jpg", "aukio.jpg", "dragon.jpg", "polku.jpg", "portti_kiinni.jpg", "joki.jpg", "penkki.jpg", "mokki.jpg"],
["R.jpeg", "R.jpeg", "R.jpeg", "R.jpeg", "R.jpeg", "R.jpeg", "R.jpeg", "R.jpeg", "R.jpeg", ]
];

const blockMessages = [
    ["Haluamasi reitti on liian vaarallinen.<br>", "Salaperäinen voima estää liikkumisen valitsemaasi suuntaan.<br>Kaivosta kuuluu kutsuvaa kaikua...<br>",
        "Vaikeaselkoinen pensas estää liikkumisen.<br>", "Et pääse ohittamaan kuhakäärmettä sitä kautta.<br>", "",
        "Portti on suljettu. Tarvitset avaimen avataksesi sen.<br>", "Joki on liian syvä ylitettäväksi.<br>",
        "Metsä on liian pelottava kuljettavaksi.<br>", "Olet liian pöyristynyt mennäksesi valitsemaasi suuntaan.<br>"
    ],
    ["Et pääse kulkemaan.", "Et pääse kulkemaan.", "Et pääse kulkemaan.", "Et pääse kulkemaan.", "Et pääse kulkemaan.",
        "Et pääse kulkemaan.", "Et pääse kulkemaan.", "Et pääse kulkemaan.", "Et pääse kulkemaan."]
];

const tarinat = [
    "Havahdut ajatuksistasi keskellä metsäpolkua.<br>Missä oikein olet?<br>Tutki ympäristöäsi ja yritä päästä eteenpäin.<br>Onnea matkaan!",
    "Astuttuasi portista päädyt oudolle kujalle. Ihmiset ovat vetäytyneitä ja ilmassa kuuluu hiljainen veisaus... Mistä on kyse?"
    ];

let mapLocation = 4;
console.log(maps[mapLocation]);

let items = ["kivi"];
let itemLocations = [6];
const knownItems = ["huilu", "kivi", "miekka", "avain"];
let item = "";
let backPack = [];


// Alustuksia
let playersInput = "";
let gameMessage = "";
let currentMap = 0;
let vaihdaKartta = false;

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
            gameMessage = "";
            if(mapLocation >= 3) {
            mapLocation -= 3;
            } else {
                gameMessage = blockMessages[currentMap][mapLocation]
            }
            break;
        
        case "itä":
            gameMessage = "";
            if (mapLocation === 5 && käytettyAvain && vaihdaKartta) {
                image.classList.add("fade-out");
                const tarinaElementti = document.querySelector("#tarina");
                tarinaElementti.classList.add("fade-out");
                setTimeout(() => {
                    currentMap = 1;
                    mapLocation = 3;
                    vaihdaKartta = false;
                    gameMessage = "Portti sulkeutuu takanasi ja edessäsi on epäilyttävä kuja.";
                    const currentImages = images[currentMap];
                    image.src = `images/${currentImages[mapLocation]}`;
                    tarinaElementti.innerHTML = tarinat[currentMap];
                    image.classList.remove("fade-out");
                    tarinaElementti.classList.remove("fade-out");
                },800);
            }else if(mapLocation % 3 !== 2) {
                mapLocation++;
            } else {
                gameMessage = blockMessages[currentMap][mapLocation];
            }
            render();
            break;

        case "etelä":
            gameMessage = "";
            if(mapLocation <= 5) {
            mapLocation += 3;
            } else {
                gameMessage = blockMessages[currentMap][mapLocation];
            }
            break;

        case "länsi":
            gameMessage = "";
            if(mapLocation % 3 != 0) {
            mapLocation--;
            } else {
                gameMessage = blockMessages[currentMap][mapLocation];
            }
            break;
        
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
    const currentMapData = maps[currentMap];
    const currentImages = images[currentMap];
    output.innerHTML = `Sijaintisi: ${currentMapData[mapLocation]}<br>`; // Palauttaa HTML-elementtiin arvon | Template string -muoto = muuttuja laitetaan `$[]` sisään => f"Sijainti {}" in python
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
    image.src = `images/${currentImages[mapLocation]}`;
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
                gameMessage = blockMessages[currentMap][mapLocation]
            }
            render();
            isMoving = false;
            break;
        case "ArrowLeft":
            gameMessage = "";
            if(mapLocation % 3 !== 0) {
            mapLocation--;
            } else {
                gameMessage = blockMessages[currentMap][mapLocation];
            }
            render();
            isMoving = false;
            break;
        case "ArrowDown":
            gameMessage = "";
            if(mapLocation <= 5) {
            mapLocation += 3;
            } else {
                gameMessage = blockMessages[currentMap][mapLocation];
            }
            render();
            isMoving = false;
            break;
        case "ArrowRight":
            gameMessage = "";
            if (mapLocation === 5 && käytettyAvain && vaihdaKartta) {
                image.classList.add("fade-out");
                const tarinaElementti = document.querySelector("#tarina");
                tarinaElementti.classList.add("fade-out");
                setTimeout(() => {
                    currentMap = 1;
                    mapLocation = 3;
                    vaihdaKartta = false;
                    gameMessage = "Portti sulkeutuu takanasi ja edessäsi on epäilyttävä kuja.";
                    const currentImages = images[currentMap];
                    image.src = `images/${currentImages[mapLocation]}`;
                    tarinaElementti.innerHTML = tarinat[currentMap];
                    image.classList.remove("fade-out");
                    tarinaElementti.classList.remove("fade-out");
                    render();
                },800);
            }else if(mapLocation % 3 !== 2) {
                mapLocation++;
                render();
                isMoving = false;
            } else {
                gameMessage = blockMessages[currentMap][mapLocation];
                render();
                isMoving = false;
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
                    gameMessage += `Avaat avaimella portin. Jatka seikkailuasi kulkemalla itään...`;
                    käytettyAvain = true;
                    vaihdaKartta = true;
                    backPack.splice(backPackIndexNumber, 1);
                    itemLocations.push(mapLocation);
                    images[0][5] = "portti.jpg";
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