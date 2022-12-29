"use strict";

function buttonHeaderPair(title, propertyToUpdate, updateCallback, initialValue) {
    const newHeader = document.createElement("h3");
    newHeader.textContent = title;

    const newTextField = document.createElement("input");
    newTextField.type = "text";
    newTextField.id = propertyToUpdate;

    const propertyName = propertyToUpdate.split("-").join(" ");
    newTextField.placeholder = propertyName;
    newTextField.value = initialValue;

    const newButton = document.createElement("button");
    newButton.textContent = "Update value";

    newButton.addEventListener("click", updateCallback);

    const formContainer = document.createElement("div");
    formContainer.classList.add("button-heading");
    formContainer.appendChild(newHeader);
    formContainer.appendChild(newTextField);
    formContainer.appendChild(newButton);

    this.formContainer = formContainer;
}

function createCell(state, cellWidth) {
    const cell = document.createElement("div");
    cell.classList.add(state);
    cell.style = `height: ${cellWidth}px; width: ${cellWidth}px;`;

    return cell;
}

const randomizeState = () => {
    const states = ["alive-cell", "dead-cell"];
    return states[Math.floor(Math.random() * states.length)];
}

const initializeGrid = () => {
    const gridContainer = document.querySelector(".grid-container");
    const sideWidth = Number(document.querySelector("#grid-size").value);

    const setAlive = (e) => {
        e.classList.replace("dead-cell", "alive-cell");
    }

    if (sideWidth !== sideWidth || sideWidth == "") {
        alert("Invalid grid size");
        return;
    }

    const cellWidth = 500 / sideWidth;

    const rows = []

    for (let i = 0; i < sideWidth; i++) {
        const newRow = document.createElement("div");
        newRow.classList.add("row");

        for (let j = 0; j < sideWidth; j++) {
            const newCell = createCell(randomizeState(), cellWidth);
            newCell.addEventListener("click", function () { setAlive(this) });

            newRow.appendChild(newCell);
        }

        rows.push(newRow);
    }

    gridContainer.replaceChildren(...rows);
}

const updateGrid = () => {
    const gridContainer = document.querySelector(".grid-container");

    const sideWidth = Number(document.querySelector("#grid-size").value);
    const cellWidth = 500 / sideWidth;

    const rowsArray = [...gridContainer.children];
    const cells = rowsArray.map((row) => [...row.children].map((cell) => cell.className));
    const newRows = [];

    const mapIndex = (i) => {
        if (i < 0) {
            return sideWidth + i;
        }

        return i
    }

    const getAliveNeighbors = (x, y) => {

        const neighbors = [];

        for (let i = x - 1; i < x + 2; i++) {
            for (let j = y - 1; j < y + 2; j++) {
                if (i === x && j === y) {
                    continue;
                }

                neighbors.push(cells[mapIndex(i % sideWidth)][mapIndex(j % sideWidth)])
            }
        }
        return neighbors.reduce((sumAlive, currentCell) => {
            sumAlive = currentCell === "alive-cell" ? sumAlive + 1 : sumAlive;
            return sumAlive;
        }, 0);
    }

    for (let i = 0; i < sideWidth; i++) {
        const nextRow = document.createElement("div")
        nextRow.classList.add("row");
        for (let j = 0; j < sideWidth; j++) {
            const sumAliveNeighbors = getAliveNeighbors(i, j);
            const currentState = cells[i][j];

            let newCell;
            if (currentState == "alive-cell") {
                if (sumAliveNeighbors == 2 || sumAliveNeighbors == 3) {
                    newCell = createCell("alive-cell", cellWidth);
                } else {
                    newCell = createCell("dead-cell", cellWidth);
                }
            } else if (currentState == "dead-cell" && sumAliveNeighbors == 3) {
                newCell = createCell("alive-cell", cellWidth);
            } else {
                newCell = createCell("dead-cell", cellWidth);
            }

            nextRow.appendChild(newCell);
        }

        newRows.push(nextRow);
    }

    gridContainer.replaceChildren(...newRows);
}

const startSimulation = () => {
    const iterationAmount = Number(document.querySelector("#iteration-amount").value);
    let counter = 0;


    const intervalID = setInterval(() => {
            updateGrid();
        if (++counter === iterationAmount) {
            clearInterval(intervalID);
        }
    }, 500)
}

const initializePage = () => {
    let counter = 0;
    const initialGridWidth = 10;

    const init = () => {
        if (counter < 1) {
            const buttonContainer = document.querySelector(".setting-buttons");
            const sizeSettings = new buttonHeaderPair("Set grid size", "grid-size", initializeGrid, initialGridWidth);
            const iterationSettings = new buttonHeaderPair("Set iteration amount", "iteration-amount", startSimulation, 10)

            buttonContainer.appendChild(sizeSettings.formContainer);
            buttonContainer.appendChild(iterationSettings.formContainer);

            initializeGrid();
            counter++;
        }

        return;
    }

    return init;

}

document.addEventListener("DOMContentLoaded", function () {
    const initializer = initializePage();
    initializer();
});