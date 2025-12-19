// ........................................................................
// ...... carta arrastrada ................................................
let draggedCard = null;
// ........................................................................
// ...... grupo de cartas arrastradas .....................................
let draggedCardsGroup = [];
// ........................................................................
// ...... ruta de la carpeta del mazo .....................................
const deckPath = 'card-deck';
// ........................................................................
// ...... arreglo de imágenes del mazo ....................................
const deckArray = [
    "01-b-clubs", "02-b-clubs", "03-b-clubs", "04-b-clubs", "05-b-clubs", "06-b-clubs", "07-b-clubs", "08-b-clubs", "09-b-clubs", "10-b-clubs", "11-b-clubs", "12-b-clubs", "13-b-clubs",
    "01-r-diamonds", "02-r-diamonds", "03-r-diamonds", "04-r-diamonds", "05-r-diamonds", "06-r-diamonds", "07-r-diamonds", "08-r-diamonds", "09-r-diamonds", "10-r-diamonds", "11-r-diamonds", "12-r-diamonds", "13-r-diamonds",
    "01-r-hearts", "02-r-hearts", "03-r-hearts", "04-r-hearts", "05-r-hearts", "06-r-hearts", "07-r-hearts", "08-r-hearts", "09-r-hearts", "10-r-hearts", "11-r-hearts", "12-r-hearts", "13-r-hearts",
    "01-b-spades", "02-b-spades", "03-b-spades", "04-b-spades", "05-b-spades", "06-b-spades", "07-b-spades", "08-b-spades", "09-b-spades", "10-b-spades", "11-b-spades", "12-b-spades", "13-b-spades",
];
// ........................................................................
// ...... llevar la cuenta del número de cartas ...........................
let deckIndex = 0;
// ........................................................................
// ...... barajo las cartas del mazo ......................................
// fuente: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
const shuffledArray = deckArray.toSorted((a, b) => 0.5 - Math.random());
// ........................................................................
// ...... funcionalidad drag and drop en tableau ..........................
// ........................................................................
// ...... columnas del tableau ............................................
// información de los bucles:
// - la i indica el número de columna del tableau
// - la j indica el número de carta de la columna
// accedo a las columnas del tableau
const tableauColumns = document.getElementsByClassName('column');
for (let i = 0; i < tableauColumns.length; i++) {
    // console.log(tableauColumns[i]); // muestra cada una de las columnas
    // accedo a las cartas de la columna
    // Dentro del buccle: introduzco la ruta de la carta del mazo,
    // creo un elemento imagen donde voy a incluir la carta,
    // le doy un estilo para que tenga proporcionalidad,
    // a la imagen le asigno la ruta de la carta en el mazo,
    // le establezco la propiedad de que puede ser arrastrada,
    // le añado a cada columna el número de elementos hasta que j sea igual a i,
    // sumo uno al contador de cartas empleadas
    let cards = tableauColumns[i].children;

    for (let card of cards) {
        console.log(`- ${card.dataset.number} - ${card.dataset.color} - ${card.src.split('/').pop()}`);
    }
    for (let j = 0; j <= i; j++) {
        let backCardPath = deckPath + '/back.png';
        let cardPath = deckPath + "/" + shuffledArray[deckIndex] + ".png"; // le indico que carta del mazo debe enseñar mediante la ruta
        let imageTableau = document.createElement('img');

        let cardName = shuffledArray[deckIndex];
        let cardFileName = cardName + ".png";
        // obtener información de la carta
        let cardNumber = Number.parseInt(cardFileName.substring(0, 2));
        let cardColor = cardFileName.charAt(3);
        let cardSuit = cardFileName.split("-")[2];

        imageTableau.className = "face-down"; // por defecto estará boca abajo
        imageTableau.src = backCardPath;
        imageTableau.setAttribute("draggable", true);
        imageTableau.dataset.cardName = cardName;

        tableauColumns[i].appendChild(imageTableau); // importante: le añade al contenedor correspondiente la carta, se indica con la "[i]"
        updateColumnLayout(tableauColumns[i]);
        deckIndex++;
        // accedo a la última carta de cada columna
        // evita que se puedan arrastrar el resto de cartas que no sean las últimas de las columnas en la parte donde agregas las cartas al tableau
        if (j === i) {
            imageTableau.className = "card";
            imageTableau.src = cardPath;
            imageTableau.setAttribute("draggable", true);

            imageTableau.dataset.number = cardNumber;
            imageTableau.dataset.color = cardColor;
            imageTableau.dataset.suit = cardSuit;
            imageTableau.dataset.column = i;

            imageTableau.addEventListener('dragstart', e => {
                draggedCard = e.target;

                let column = e.target.parentElement;
                let allCards = Array.from(column.children); // se obtienen todas las cartas de la columna
                let index = allCards.indexOf(draggedCard); // obtiene la posición de la carta en la columna
                let movingCards = allCards.slice(index).filter(card => card.dataset.number && card.dataset.color);
                // let movingCards = allCards.slice(index);
                // función para obtener la información de las cartas arrastradas
                function getCardInfo(card) {
                    return {
                        number: Number.parseInt(card.dataset.number),
                        color: card.dataset.color
                    };
                }// getCardInfo.end
                let isValidMove = true;
                for (let k = 0; k < movingCards.length - 1; k++) {
                    let currentCard = getCardInfo(movingCards[k]);
                    let nextCard = getCardInfo(movingCards[k + 1]);
                    console.log(`Comparando cartas: ${currentCard.number}${currentCard.color} con ${nextCard.number}${nextCard.color}`);
                    if (currentCard.number !== nextCard.number + 1 || currentCard.color === nextCard.color) {
                        isValidMove = false;
                        console.log("Movimiento inválido detectado en estas cartas");
                        break;
                    }// if.end
                }// for.end

                if (isValidMove) {
                    draggedCardsGroup = movingCards;
                    draggedCard = movingCards[0];
                } else {
                    draggedCardsGroup = [draggedCard];
                }// else.end
                console.log("Drag start - cartas en grupo:", movingCards.map(c => c.dataset.number + c.dataset.color));
                console.log("¿Movimiento válido?", isValidMove);
            });//dragStart event.end
        } else {
            imageTableau.setAttribute("draggable", false);
        }// else.end
    }// for.end
}// for.end
for (let i = 0; i < tableauColumns.length; i++) {
    tableauColumns[i].addEventListener('drop', e => {
        e.preventDefault();

        if (tableauColumns[i] === draggedCard.parentElement) return; // añadido
        if (draggedCardsGroup.length === 0) return;

        for (let card of draggedCardsGroup) {
            // si la carta no tiene dataset.number ni color, se los asigno
            if (!card.dataset.number || !card.dataset.color) {
                let cardFileName = card.src.split("/").pop();
                card.dataset.number = cardFileName.substring(0, 2);
                card.dataset.color = cardFileName.charAt(3);
                card.dataset.suit = cardFileName.split("-")[2];
            }// if.end
        }// for.end

        let topCard = draggedCardsGroup[0];
        let topCardName = topCard.src.split("/").pop();
        let draggedCardNumber = Number.parseInt(topCardName.substring(0, 2));
        let draggedCardColor = topCardName.charAt(3);

        // solo se pueden depositar reyes, si la columna está vacía
        if (tableauColumns[i].children.length === 0) {
            if (draggedCardNumber === 13) {
                const originColumn = draggedCard.parentElement;
                for (let card of draggedCardsGroup) {
                    tableauColumns[i].appendChild(card);
                }// for.end
                updateColumnLayout(tableauColumns[i]);
                revealNextCardInColumn(originColumn);
            }// if.end
            return;
        }// if.end

        // última carta de la columna del tableau
        let lastCard = tableauColumns[i].lastElementChild;
        let lastCardSrc = lastCard.src;
        let lastCardName = lastCardSrc.split('/').pop();
        let lastCardNumber = Number.parseInt(lastCardName.substring(0, 2));
        let lastCardColor = lastCardName.charAt(3);

        if (draggedCardNumber === (lastCardNumber - 1) && draggedCardColor !== lastCardColor) {
            const originColumn = draggedCard.parentElement;
            for (let card of draggedCardsGroup) {
                tableauColumns[i].appendChild(card);
            }// for.end
            updateColumnLayout(tableauColumns[i]);
            revealNextCardInColumn(originColumn);
            console.log("COLUMNA: ", originColumn);
        }// if.end
        console.log("Drop - cartas arrastradas:", draggedCardsGroup.map(c => c.dataset.number + c.dataset.color));
        draggedCardsGroup = [];
    });
    tableauColumns[i].addEventListener('dragover', e => {
        e.preventDefault();
    });
}// for. end
// ........................................................................
// ...... stock ...........................................................
// accedo al stock
// en el bucle, tomo en consideración el número de cartas que fueron ya colocadas
// y voy restando la diferencia que hay con el arreglo completo de cartas barajadas 
// (52 cartas barajadas - 28 cartas ya colocadas)
const stock = document.querySelector('.stock');
for (let i = deckIndex; i < shuffledArray.length; i++) {
    let cardPath = deckPath + "/" + shuffledArray[i] + ".png";
    let imageStock = document.createElement('img');
    imageStock.className = "card";
    imageStock.src = cardPath;
    imageStock.setAttribute("draggable", true);
    imageStock.dataset.fromStock = "true"; // para saber la procedencia después

    // las cartas necesitan que se les otorgue un dataset para que se puedan arrastrar varias
    let cardName = shuffledArray[i];
    imageStock.dataset.number = cardName.substring(0, 2);
    imageStock.dataset.color = cardName.charAt(3);
    imageStock.dataset.suit = cardName.split("-")[2];

    // la carta puede ser arrastrada
    imageStock.addEventListener('dragstart', e => {
        draggedCard = e.target;
        draggedCardsGroup = [draggedCard];
    });
    stock.appendChild(imageStock);
}// for.end
// ........................................................................
// ...... funcionalidad drag and drop en waste ............................
const wasteContainer = document.querySelector('.waste');

wasteContainer.addEventListener('drop', e => {
    e.preventDefault();
    // para que solo se puedan añadir cartas del "stock"
    if (draggedCard.dataset.fromStock === "true") {
        wasteContainer.appendChild(draggedCard);
        updateColumnLayout(wasteContainer); // modificado
        draggedCard.addEventListener('dragstart', e => {
            draggedCard = e.target;
            draggedCardsGroup = [draggedCard];
        });
    }
});
wasteContainer.addEventListener('dragover', e => {
    e.preventDefault();
});
// para volver a agregar cartas al "stock" cuando se hayan arrastrado todas al "waste"
wasteContainer.addEventListener("click", () => {
    while (wasteContainer.children.length > 0) {
        let card = wasteContainer.lastElementChild;
        stock.insertBefore(card, stock.firstElementChild);
    }
    updateColumnLayout(stock);
});
// ........................................................................
// ...... funcionalidad drag and drop en foundations ......................
const foundation = document.getElementsByClassName('foundation');
for (let i = 0; i < foundation.length; i++) {
    foundation[i].addEventListener('drop', e => {
        e.preventDefault();
        const originColumn = draggedCard.parentElement; // añadido
        // carta que se está arrastrando
        let draggedCardSrc = draggedCard.src;
        let draggedCardFileName = draggedCardSrc.split('/').pop();
        let draggedCardNumber = Number.parseInt(draggedCardFileName.substring(0, 2));
        let draggedCardSuit = draggedCardFileName.substring(5, 8);
        if (foundation[i].children.length === 0) {
            // al principio, solo se permiten "ases"
            if (draggedCardNumber == "01") { // draggedCardFileName.startsWith("01-")
                foundation[i].appendChild(draggedCard);
                updateColumnLayout(draggedCard.parentElement);
            }// if.end
            revealNextCardInColumn(originColumn); // añadido
            return;
        }// if.end
        // última carta en la base correspondiente
        let lastCard = foundation[i].lastElementChild;
        let lastFoundationCardSrc = lastCard.src;
        let lastFoundationCardFileName = lastFoundationCardSrc.split("/").pop();

        let cardFileName = draggedCard.src.split("/").pop();

        let lastFoundationCardNumber = Number.parseInt(lastFoundationCardFileName.substring(0, 2));
        let lastFoundationCardSuit = lastFoundationCardFileName.substring(5, 8);
        // condición 1: la carta arrastrada debe ser una unidad mayor que la primera carta de la base
        // condición 2: la carta arrastrada debe ser del mismo palo que la primera carta de la base
        if (draggedCardNumber == (lastFoundationCardNumber + 1)) {
            if (draggedCardSuit === lastFoundationCardSuit) {
                foundation[i].appendChild(draggedCard);
                updateColumnLayout(draggedCard.parentElement);
            }// if.end
            revealNextCardInColumn(originColumn); // añadido
        }// if.end
    });
    foundation[i].addEventListener('dragover', e => {
        e.preventDefault();
    });
}// for.end
// función para apilar las cartas visualmente
function updateColumnLayout(column) {
    const cards = column.querySelectorAll('img');
    console.log("Actualizar layout - cartas en columna:", cards.length);
    cards.forEach((card, index) => {
        card.style.top = (index * 30) + "px";
        card.style.zIndex = index + 1;
    });
}

// añadido: última actualización
function revealNextCardInColumn(column) {
    const cards = Array.from(column.querySelectorAll('img'));
    if (cards.length === 0) return;

    // Buscar la última carta oculta (face-down)
    for (let i = cards.length - 1; i >= 0; i--) {
        const card = cards[i];
        if (card.classList.contains('face-down')) {
            const cardName = card.dataset.cardName;
            if (!cardName) {
                console.warn("No se encontró dataset.cardName para carta oculta");
                return;
            }
            const cardPath = deckPath + "/" + cardName + ".png";
            card.src = cardPath;
            card.classList.remove('face-down');
            card.classList.add('card');

            // Extraer info para datasets
            card.dataset.number = cardName.substring(0, 2);
            card.dataset.color = cardName.charAt(3);
            card.dataset.suit = cardName.split("-")[2];

            // Hacerla draggable y agregar listener dragstart igual que las cartas visibles
            card.setAttribute("draggable", true);
            card.addEventListener('dragstart', e => {
                draggedCard = e.target;

                let column = e.target.parentElement;
                let allCards = Array.from(column.children);
                let index = allCards.indexOf(draggedCard);
                let movingCards = allCards.slice(index).filter(card => card.dataset.number && card.dataset.color);

                function getCardInfo(card) {
                    let number, color;
                    if (card.dataset.number && card.dataset.color) {
                        number = Number.parseInt(card.dataset.number);
                        color = card.dataset.color;
                    } else {
                        let cardFileName = card.src.split("/").pop();
                        number = Number.parseInt(cardFileName.substring(0, 2));
                        color = cardFileName.charAt(3);
                    }
                    return { number, color };
                }

                let isValidMove = true;
                for (let k = 0; k < movingCards.length - 1; k++) {
                    let currentCard = getCardInfo(movingCards[k]);
                    let nextCard = getCardInfo(movingCards[k + 1]);
                    if (currentCard.number !== nextCard.number + 1 || currentCard.color === nextCard.color) {
                        isValidMove = false;
                        break;
                    }
                }

                if (isValidMove) {
                    draggedCardsGroup = movingCards;
                    draggedCard = movingCards[0];
                } else {
                    draggedCardsGroup = [draggedCard];
                }// else.end
            });// dragStart event.end
            updateColumnLayout(column);
            break; // solo volteamos una carta oculta por vez
        }// if.end
    }// for.end
}// revealNextCardInColumn.end

// función para reinicializar el juego
function initializeGame() {
    deckIndex = 0;

    shuffledArray.sort(() => 0.5 - Math.random());

    // Vaciar columnas, stock, waste y foundations
    for (let col of tableauColumns) col.innerHTML = '';
    stock.innerHTML = '';
    wasteContainer.innerHTML = '';
    for (let f of foundation) f.innerHTML = '';

    // Volver a repartir cartas en el tableau
    for (let i = 0; i < tableauColumns.length; i++) {
        for (let j = 0; j <= i; j++) {
            let backCardPath = deckPath + '/back.png';
            let cardPath = deckPath + "/" + shuffledArray[deckIndex] + ".png"; // le indico que carta del mazo debe enseñar mediante la ruta
            let imageTableau = document.createElement('img');
            let cardName = shuffledArray[deckIndex];
            // obtener información de la carta
            let cardNumber = cardName.substring(0, 2);
            let cardColor = cardName.charAt(3);
            let cardSuit = cardName.split("-")[2];

            imageTableau.className = "face-down"; // por defecto estará boca abajo
            imageTableau.src = backCardPath;
            imageTableau.setAttribute("draggable", true);
            imageTableau.dataset.cardName = cardName;

            tableauColumns[i].appendChild(imageTableau); // importante: le añade al contenedor correspondiente la carta, se indica con la "[i]"
            updateColumnLayout(tableauColumns[i]);
            deckIndex++;
            // accedo a la última carta de cada columna
            // evita que se puedan arrastrar el resto de cartas que no sean las últimas de las columnas en la parte donde agregas las cartas al tableau
            if (j === i) {
                imageTableau.className = "card";
                imageTableau.src = cardPath;
                imageTableau.setAttribute("draggable", true);

                imageTableau.dataset.number = cardNumber;
                imageTableau.dataset.color = cardColor;
                imageTableau.dataset.suit = cardSuit;
                imageTableau.dataset.column = i;

                imageTableau.addEventListener('dragstart', e => {
                    draggedCard = e.target;

                    let column = e.target.parentElement;
                    let allCards = Array.from(column.children); // se obtienen todas las cartas de la columna
                    let index = allCards.indexOf(draggedCard); // obtiene la posición de la carta en la columna
                    let movingCards = allCards.slice(index).filter(card => card.dataset.number && card.dataset.color);
                    // let movingCards = allCards.slice(index);
                    // función para obtener la información de las cartas arrastradas
                    function getCardInfo(card) {
                        console.log("getCardInfo recibe carta:", card, card.dataset.number, card.dataset.color);
                        return {
                            number: parseInt(card.dataset.number),
                            color: card.dataset.color
                        };
                    }// getCardInfo.end
                    let isValidMove = true;
                    for (let k = 0; k < movingCards.length - 1; k++) {
                        let currentCard = getCardInfo(movingCards[k]);
                        let nextCard = getCardInfo(movingCards[k + 1]);
                        console.log(`Comparando cartas: ${currentCard.number}${currentCard.color} con ${nextCard.number}${nextCard.color}`);
                        if (currentCard.number !== nextCard.number + 1 || currentCard.color === nextCard.color) {
                            isValidMove = false;
                            console.log("Movimiento inválido detectado en estas cartas");
                            break;
                        }// if.end
                    }// for.end

                    if (isValidMove) {
                        draggedCardsGroup = movingCards;
                        draggedCard = movingCards[0];
                    } else {
                        draggedCardsGroup = [draggedCard];
                    }// else.end
                    console.log("Drag start - cartas en grupo:", movingCards.map(c => c.dataset.number + c.dataset.color));
                    console.log("¿Movimiento válido?", isValidMove);
                });//dragStart event.end
            } else {
                imageTableau.setAttribute("draggable", false);
            }// else.end
        }// for.end
    }// for.end

    // Volver a cargar el stock
    for (let i = deckIndex; i < shuffledArray.length; i++) {
        let cardPath = deckPath + "/" + shuffledArray[i] + ".png";
        let imageStock = document.createElement('img');
        imageStock.className = "card";
        imageStock.src = cardPath;
        imageStock.setAttribute("draggable", true);
        imageStock.dataset.fromStock = "true"; // para saber la procedencia después

        // las cartas necesitan que se les otorgue un dataset para que se puedan arrastrar varias
        let cardName = shuffledArray[i];
        imageStock.dataset.number = cardName.substring(0, 2);
        imageStock.dataset.color = cardName.charAt(3);
        imageStock.dataset.suit = cardName.split("-")[2];

        // la carta puede ser arrastrada
        imageStock.addEventListener('dragstart', e => {
            draggedCard = e.target;
            draggedCardsGroup = [draggedCard];
        });
        stock.appendChild(imageStock);
    }
}

document.getElementById('restartButton').addEventListener('click', () => {
    initializeGame();
});
