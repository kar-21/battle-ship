import React from "react";
import p5 from "p5";
import { withRouter } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import InfoIcon from "@material-ui/icons/Info";
import CancelIcon from "@material-ui/icons/Cancel";

import { SHIP_PROPERTIES } from "../../constants";
import arrow from "../../assets/icons/arrow-up.svg";
import miniDefenderOneSVG from "../../assets/images/mini-defender-1.svg";
import miniDefenderTwoSVG from "../../assets/images/mini-defender-2.svg";
import defenderOneSVG from "../../assets/images/defenderOne.svg";
import defenderTwoSVG from "../../assets/images/defenderTwo.svg";
import destroyerSVG from "../../assets/images/destroyer.svg";
import submarineSVG from "../../assets/images/submarine.svg";
import aircraftCarrierSVG from "../../assets/images/aircraft-carrier.svg";

const classes = {
  canvas: {
    display: "flex",
    marginTop: "2vh",
  },
  button: {
    position: "absolute",
    top: "50%",
    left: "70%",
  },
  h3: {
    textAlign: "center",
  },
  h5: {
    marginTop: "0.5%",
    textAlign: "center",
    backgroundImage: `url(${arrow})`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "57%",
    backgroundSize: "118px",
    height: "36px",
  },
  congratsText: {
    position: "absolute",
    top: "0%",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    background: "rgba(128, 128,128, 0.2)",
  },
  h1: {
    textAlign: "center",
    fontSize: "5vh",
    padding: "5%",
  },
  dialog: {
    width: "45%",
    margin: "auto",
    background: "white",
    boxShadow: "10px 9px 15px 7px #888888",
    borderRadius: "6px",
    textAlign: "center",
  },
  buttonRoute: {
    margin: "1%",
  },
  arrangeButton: {
    margin: "1%",
    marginLeft: "calc(50% - 12vw)",
    width: "24vw",
  },
  helpMenu: {
    display: "flex",
    padding: "0.75%",
    fontSize: "2.5vh",
    marginLeft: "3px",
    borderRadius: "5px",
    alignItems: "center",
    background: "#fbfbfb",
    justifyContent: "center",
    boxShadow:
      "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
  },
  helpContainer: {
    display: "flex",
    marginLeft: "48%",
    marginTop: "4px",
  },
};

class BattleGroundCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRefs = React.createRef();
    this.state = {
      isBambedFirstTime: false,
      isComputerTurn: false,
      anyoneWon: null,
      isDialogOpen: false,
      isHelpMenuOpen: false,
    };
  }

  hasWinner = false;
  winner;
  rowColumn = 10;
  gridSize =
    (window.screen.availHeight - window.screen.availHeight * 0.25) /
    this.rowColumn;

  gridArrayUser = this.props.gridArray;
  gridArrayComputer;

  miniDefenderOne;
  miniDefenderTwo;
  defenderOne;
  defenderTwo;
  destroyer;
  submarine;
  aircraftCarrier;

  isComputerTurn = false;
  cellAvailableToBombForComputer = [];
  lastBombedCells = [];
  lastMissedCell = null;
  timeout = 500;
  isShipConcentated;

  userShipProperties = new SHIP_PROPERTIES();
  computerShipProperties = new SHIP_PROPERTIES();

  handleRoute = () => {
    console.log(">>", this.props);
    this.props.history.push("/arrangeShip");
  };

  initializeCellAvailableToBomb = () => {
    this.gridArrayComputer.forEach((column, columIndex) =>
      column.forEach((element, rowIndex) => {
        this.cellAvailableToBombForComputer.push(
          columIndex * this.rowColumn + rowIndex
        );
      })
    );
  };

  initializeArray = (index) => {
    let grid = new Array(index)
      .fill(null)
      .map(() => new Array(index).fill(null));
    grid = this.arrangeComputerShips(grid);
    console.table(grid);
    return grid;
  };

  arrangeComputerShips = (grid) => {
    Object.keys(this.computerShipProperties)
      .reverse()
      .forEach((ship) => {
        grid = this.getRandomPositionForShip(grid, ship);
      });
    this.isShipConcentated = this.checkIfThreeShipsAreNextToEachother(grid);
    let loopCount = 0;
    while (this.isShipConcentated[0] && loopCount < 30) {
      grid = grid.map((column) =>
        column.map((element) =>
          element === this.isShipConcentated[1] ? null : element
        )
      );
      this.computerShipProperties[this.isShipConcentated[1]].cellLocation = [];
      grid = this.getRandomPositionForShip(grid, this.isShipConcentated[1]);
      this.isShipConcentated = this.checkIfThreeShipsAreNextToEachother(grid);
      loopCount++;
    }
    console.log(">>> loop count", loopCount);
    return grid;
  };

  getRandomPositionForShip = (grid, ship) => {
    const isVertical = !!Math.floor(Math.random() * 2);
    let randomRow = Math.floor(
      Math.random() *
        (this.rowColumn - this.computerShipProperties[ship].cellSize)
    );
    let randomColumn = Math.floor(Math.random() * this.rowColumn);
    if (isVertical) {
      let isOverlap = false;
      for (
        let cellCount = randomRow === 0 ? 0 : -1;
        cellCount <= this.computerShipProperties[ship].cellSize ||
        randomRow + cellCount < this.rowColumn;
        cellCount++
      ) {
        if (grid[randomRow + cellCount][randomColumn] !== null) {
          isOverlap = true;
          break;
        }
      }
      if (!isOverlap) {
        for (
          let cellCount = 0;
          cellCount < this.computerShipProperties[ship].cellSize;
          cellCount++
        ) {
          grid[randomRow + cellCount][randomColumn] = ship;
          this.computerShipProperties[ship].cellLocation.push(
            (randomRow + cellCount) * this.rowColumn + randomColumn
          );
        }
        this.computerShipProperties[ship].alignment = "vertical";
        return grid;
      }
    } else {
      let isOverlap = false;
      for (
        let cellCount = randomRow === 0 ? 0 : -1;
        cellCount <= this.computerShipProperties[ship].cellSize ||
        randomRow + cellCount < this.rowColumn;
        cellCount++
      ) {
        if (grid[randomColumn][randomRow + cellCount] !== null) {
          isOverlap = true;
          break;
        }
      }
      if (!isOverlap) {
        for (
          let cellCount = 0;
          cellCount < this.computerShipProperties[ship].cellSize;
          cellCount++
        ) {
          grid[randomColumn][randomRow + cellCount] = ship;
          this.computerShipProperties[ship].cellLocation.push(
            randomColumn * this.rowColumn + (randomRow + cellCount)
          );
        }
        this.computerShipProperties[ship].alignment = "horizontal";
        return grid;
      }
    }
    return this.getRandomPositionForShip(grid, ship);
  };

  checkIfThreeShipsAreNextToEachother(grid) {
    let isThreeShipsAreNextToEachother = false;
    let shipNeedTobeArranged = null;
    for (let columnCount = 0; columnCount < this.rowColumn; columnCount++) {
      for (let rowCount = 0; rowCount < this.rowColumn - 2; rowCount++) {
        if (
          grid[columnCount][rowCount] !== null &&
          grid[columnCount][rowCount + 1] !== null &&
          grid[columnCount][rowCount + 2] !== null &&
          grid[columnCount][rowCount] !== grid[columnCount][rowCount + 1] &&
          grid[columnCount][rowCount + 1] !== grid[columnCount][rowCount + 2]
        ) {
          const shipArray = Object.keys(this.computerShipProperties);
          if (
            shipArray.indexOf(grid[columnCount][rowCount]) >
              shipArray.indexOf(grid[columnCount][rowCount + 1]) &&
            shipArray.indexOf(grid[columnCount][rowCount + 2]) >
              shipArray.indexOf(grid[columnCount][rowCount + 1])
          ) {
            shipNeedTobeArranged = grid[columnCount][rowCount + 1];
          } else if (
            shipArray.indexOf(grid[columnCount][rowCount + 1]) >
              shipArray.indexOf(grid[columnCount][rowCount + 2]) &&
            shipArray.indexOf(grid[columnCount][rowCount]) >
              shipArray.indexOf(grid[columnCount][rowCount + 2])
          ) {
            shipNeedTobeArranged = grid[columnCount][rowCount + 2];
          } else {
            shipNeedTobeArranged = grid[columnCount][rowCount];
          }
          break;
        }
      }
    }
    if (!isThreeShipsAreNextToEachother) {
      for (let rowCount = 0; rowCount < this.rowColumn; rowCount++) {
        for (
          let columnCount = 0;
          columnCount < this.rowColumn - 2;
          columnCount++
        ) {
          if (
            grid[columnCount][rowCount] !== null &&
            grid[columnCount + 1][rowCount] !== null &&
            grid[columnCount + 2][rowCount] !== null &&
            grid[columnCount][rowCount] !== grid[columnCount + 1][rowCount] &&
            grid[columnCount + 1][rowCount] !== grid[columnCount + 2][rowCount]
          ) {
            const shipArray = Object.keys(this.computerShipProperties);
            if (
              shipArray.indexOf(grid[columnCount][rowCount]) >
                shipArray.indexOf(grid[columnCount + 1][rowCount]) &&
              shipArray.indexOf(grid[columnCount + 2][rowCount]) >
                shipArray.indexOf(grid[columnCount + 1][rowCount])
            ) {
              shipNeedTobeArranged = grid[columnCount + 1][rowCount];
            } else if (
              shipArray.indexOf(grid[columnCount][rowCount]) >
                shipArray.indexOf(grid[columnCount + 2][rowCount]) &&
              shipArray.indexOf(grid[columnCount][rowCount]) >
                shipArray.indexOf(grid[columnCount + 2][rowCount])
            ) {
              shipNeedTobeArranged = grid[columnCount + 2][rowCount];
            } else {
              shipNeedTobeArranged = grid[columnCount][rowCount];
            }
            break;
          }
        }
      }
    }
    return [isThreeShipsAreNextToEachother, shipNeedTobeArranged];
  }

  getUserShipProperties = () => {
    console.table(this.gridArrayUser);
    for (let columnCount = 0; columnCount < this.rowColumn; columnCount++) {
      for (let rowCount = 0; rowCount < this.rowColumn; rowCount++) {
        if (this.gridArrayUser[columnCount][rowCount] !== null) {
          const ship = this.gridArrayUser[columnCount][rowCount];
          this.userShipProperties[ship].cellLocation.push(
            columnCount * this.rowColumn + rowCount
          );
        }
      }
    }
    Object.keys(this.userShipProperties).forEach((ship) => {
      const offsetX = 1;
      const offsetY = 1;
      if (
        this.userShipProperties[ship].cellLocation[0] + 1 !==
        this.userShipProperties[ship].cellLocation[1]
      ) {
        this.userShipProperties[ship].alignment = "vertical";
        const grabXRatio =
          this.userShipProperties[ship].cellLocation[0] % this.rowColumn;
        const grabYRatio = Math.floor(
          this.userShipProperties[ship].cellLocation[0] / this.rowColumn
        );
        this.userShipProperties[ship].positionX =
          this.gridSize * grabXRatio + offsetX - 4;
        this.userShipProperties[ship].positionY =
          this.gridSize * grabYRatio + offsetY;
      } else {
        const grabXRatio =
          this.userShipProperties[ship].cellLocation[0] % this.rowColumn;
        const grabYRatio = Math.floor(
          this.userShipProperties[ship].cellLocation[0] / this.rowColumn
        );
        this.userShipProperties[ship].positionX =
          this.gridSize * grabXRatio + offsetX;
        this.userShipProperties[ship].positionY =
          this.gridSize * grabYRatio + offsetY + 4;
      }
    });
  };

  setPositionForComputerShips = () => {
    Object.keys(this.computerShipProperties).forEach((ship) => {
      const offsetX =
        this.gridSize * this.rowColumn + window.screen.availHeight * 0.05;
      const offsetY = 1;
      if (this.computerShipProperties[ship].alignment === "vertical") {
        const grabXRatio =
          this.computerShipProperties[ship].cellLocation[0] % this.rowColumn;
        const grabYRatio = Math.floor(
          this.computerShipProperties[ship].cellLocation[0] / this.rowColumn
        );
        this.computerShipProperties[ship].positionX =
          this.gridSize * grabXRatio + offsetX - 4;
        this.computerShipProperties[ship].positionY =
          this.gridSize * grabYRatio + offsetY;
      } else {
        const grabXRatio =
          this.computerShipProperties[ship].cellLocation[0] % this.rowColumn;
        const grabYRatio = Math.floor(
          this.computerShipProperties[ship].cellLocation[0] / this.rowColumn
        );
        this.computerShipProperties[ship].positionX =
          this.gridSize * grabXRatio + offsetX;
        this.computerShipProperties[ship].positionY =
          this.gridSize * grabYRatio + offsetY + 4;
      }
    });
  };

  computerAttack = () => {
    console.log("inside computer attack");
    if (!this.lastBombedCells.length) {
      const randomCell = this.cellAvailableToBombForComputer[
        Math.floor(Math.random() * this.cellAvailableToBombForComputer.length)
      ];
      const randomRow = randomCell % this.rowColumn;
      const randomColumn = Math.floor(randomCell / this.rowColumn);
      console.log(">>random", randomColumn, randomRow);
      this.cellAvailableToBombForComputer.splice(
        this.cellAvailableToBombForComputer.indexOf(randomCell),
        1
      );
      console.log("1>>>>", this.cellAvailableToBombForComputer);
      if (this.gridArrayUser[randomColumn][randomRow] === null) {
        this.gridArrayUser[randomColumn][randomRow] = "miss";
        this.isComputerTurn = false;
        this.setState({ ...this.state, isComputerTurn: false });
      } else {
        console.log("user ship", this.gridArrayUser[randomColumn][randomRow]);
        const bombedShip = this.gridArrayUser[randomColumn][randomRow];
        this.userShipProperties[bombedShip].bomedLocation.push(
          randomColumn * this.rowColumn + randomRow
        );
        this.gridArrayUser[randomColumn][randomRow] =
          this.state.anyoneWon === null
            ? "bombed"
            : this.gridArrayUser[randomColumn][randomRow];
        this.lastBombedCells.push(randomCell);
        let isAllCellBombed = true;
        this.checkAllUserShipsBombed();
        this.userShipProperties[bombedShip].cellLocation.forEach((cell) => {
          if (!this.lastBombedCells.includes(cell)) {
            isAllCellBombed = false;
          }
        });
        console.log(
          ">>>",
          this.userShipProperties[bombedShip].cellLocation,
          isAllCellBombed
        );
        if (isAllCellBombed) {
          this.userShipProperties[bombedShip].cellLocation.forEach((cell) => {
            this.lastBombedCells.splice(this.lastBombedCells.indexOf(cell), 1);
          });
          setTimeout(() => {
            this.computerAttack();
          }, this.timeout);
        } else {
          setTimeout(() => {
            this.attakOnCorrospondingCell(randomColumn, randomRow);
          }, this.timeout);
        }
      }
    } else if (this.lastBombedCells.length === 1) {
      console.log(">>last", this.lastBombedCells);
      const lastRow = this.lastBombedCells[0] % this.rowColumn;
      const lastColumn = Math.floor(this.lastBombedCells[0] / this.rowColumn);
      this.attakOnCorrospondingCell(lastColumn, lastRow);
    } else {
      let bombedShip;
      Object.keys(this.userShipProperties).forEach((ship) => {
        if (
          this.userShipProperties[ship].cellLocation.includes(
            this.lastBombedCells[this.lastBombedCells.length - 1]
          )
        ) {
          bombedShip = ship;
        }
      });
      console.log(">>>:::**", bombedShip);
      this.attakOnEitherSideOfBombedArray(bombedShip);
    }
  };

  attakOnCorrospondingCell = (column, row) => {
    const cellAvailableToChoose = [];
    const alreadyBombedCells = [];
    for (let neighbourCount = 0; neighbourCount < 4; neighbourCount++) {
      const columnIndex =
        neighbourCount === 0
          ? column - 1
          : neighbourCount === 2
          ? column + 1
          : column;
      const rowIndex =
        neighbourCount === 1 ? row + 1 : neighbourCount === 3 ? row - 1 : row;
      if (
        columnIndex > -1 &&
        columnIndex < this.rowColumn &&
        rowIndex > -1 &&
        rowIndex < this.rowColumn &&
        this.cellAvailableToBombForComputer.indexOf(
          columnIndex * this.rowColumn + rowIndex
        ) > -1
      ) {
        cellAvailableToChoose.push(columnIndex * this.rowColumn + rowIndex);
      }
    }
    cellAvailableToChoose.forEach((availableCell) => {
      if (this.cellAvailableToBombForComputer.indexOf(availableCell) === -1) {
        alreadyBombedCells.push(availableCell);
      }
    });
    alreadyBombedCells.forEach((cell) => {
      cellAvailableToChoose.splice(this.cellAvailableToChoose.indexOf(cell), 1);
    });
    console.log(">>>cell avaible 4", column, row, cellAvailableToChoose);
    if (cellAvailableToChoose.length) {
      const randomNextCell =
        cellAvailableToChoose[
          Math.floor(Math.random() * cellAvailableToChoose.length)
        ];
      this.cellAvailableToBombForComputer.splice(
        this.cellAvailableToBombForComputer.indexOf(randomNextCell),
        1
      );
      console.log("3>>>", randomNextCell, this.cellAvailableToBombForComputer);
      const nextBombRow = randomNextCell % this.rowColumn;
      const nextBombColumn = Math.floor(randomNextCell / this.rowColumn);
      if (this.gridArrayUser[nextBombColumn][nextBombRow] === null) {
        this.gridArrayUser[nextBombColumn][nextBombRow] = "miss";
        this.isComputerTurn = false;
        this.setState({ ...this.state, isComputerTurn: false });
      } else {
        const bombedShip = this.gridArrayUser[nextBombColumn][nextBombRow];
        this.userShipProperties[bombedShip].bomedLocation.push(
          nextBombColumn * this.rowColumn + nextBombRow
        );
        this.gridArrayUser[nextBombColumn][nextBombRow] =
          this.state.anyoneWon === null
            ? "bombed"
            : this.gridArrayUser[nextBombColumn][nextBombRow];
        this.lastBombedCells.push(randomNextCell);
        console.log(">>>", this.lastBombedCells);
        let isAllCellBombed = true;
        this.checkAllUserShipsBombed();
        this.userShipProperties[bombedShip].cellLocation.forEach((cell) => {
          if (!this.lastBombedCells.includes(cell)) {
            isAllCellBombed = false;
          }
        });
        console.log(
          ">>>",
          this.userShipProperties[bombedShip].cellLocation,
          isAllCellBombed
        );
        if (isAllCellBombed) {
          this.userShipProperties[bombedShip].cellLocation.forEach((cell) => {
            this.lastBombedCells.splice(this.lastBombedCells.indexOf(cell), 1);
          });
          setTimeout(() => {
            this.computerAttack();
          }, this.timeout);
        } else {
          setTimeout(() => {
            this.attakOnEitherSideOfBombedArray(bombedShip);
          }, this.timeout);
        }
      }
    } else {
      setTimeout(() => {
        this.computerAttack();
      }, this.timeout);
    }
  };

  attakOnEitherSideOfBombedArray = (ship) => {
    const lastBombedCellOfShip = [];
    console.log(">>>>last", this.lastBombedCells, ship);
    this.userShipProperties[ship].cellLocation.forEach((cell) => {
      if (this.lastBombedCells.includes(cell)) {
        lastBombedCellOfShip.push(cell);
      }
    });
    if (lastBombedCellOfShip.length > 1) {
      const firstBombedCell = lastBombedCellOfShip.reduce((a, b) =>
        Math.min(a, b)
      );
      const lastBombedCell = lastBombedCellOfShip.reduce((a, b) =>
        Math.max(a, b)
      );
      console.log(">>", firstBombedCell, lastBombedCell, this.lastBombedCells);
      const cellAvailableToChoose = [];
      const alreadyBombedCells = [];
      if (
        lastBombedCell - firstBombedCell >= this.rowColumn &&
        Math.floor((lastBombedCell + this.rowColumn) % this.rowColumn) ===
          Math.floor(lastBombedCell % this.rowColumn)
      ) {
        cellAvailableToChoose.push(lastBombedCell + this.rowColumn);
      } else if (
        lastBombedCell - firstBombedCell >= 1 &&
        lastBombedCell - firstBombedCell < this.rowColumn &&
        Math.floor((lastBombedCell + 1) / this.rowColumn) ===
          Math.floor(lastBombedCell / this.rowColumn)
      ) {
        cellAvailableToChoose.push(lastBombedCell + 1);
      }
      if (
        lastBombedCell - firstBombedCell >= this.rowColumn &&
        Math.floor((firstBombedCell - this.rowColumn) % this.rowColumn) ===
          Math.floor(firstBombedCell % this.rowColumn)
      ) {
        cellAvailableToChoose.push(firstBombedCell - this.rowColumn);
      } else if (
        lastBombedCell - firstBombedCell >= 1 &&
        lastBombedCell - firstBombedCell < this.rowColumn &&
        Math.floor((firstBombedCell - 1) / this.rowColumn) ===
          Math.floor(firstBombedCell / this.rowColumn)
      ) {
        cellAvailableToChoose.push(firstBombedCell - 1);
      }
      cellAvailableToChoose.forEach((availableCell) => {
        console.log(
          ">>::>",
          availableCell,
          this.cellAvailableToBombForComputer
        );
        if (this.cellAvailableToBombForComputer.indexOf(availableCell) === -1) {
          alreadyBombedCells.push(availableCell);
        }
      });
      alreadyBombedCells.forEach((cell) => {
        cellAvailableToChoose.splice(cellAvailableToChoose.indexOf(cell), 1);
      });
      console.log("<<<<<", cellAvailableToChoose);
      if (cellAvailableToChoose.length) {
        const randomCell =
          cellAvailableToChoose[
            Math.floor(Math.random() * cellAvailableToChoose.length)
          ];
        console.log("<<<<<<<<<<:::", randomCell);
        const randomRow = randomCell % this.rowColumn;
        const randomColumn = Math.floor(randomCell / this.rowColumn);
        this.cellAvailableToBombForComputer.splice(
          this.cellAvailableToBombForComputer.indexOf(randomCell),
          1
        );
        console.log("5>>>", this.cellAvailableToBombForComputer);
        if (this.gridArrayUser[randomColumn][randomRow] === null) {
          this.gridArrayUser[randomColumn][randomRow] = "miss";
          this.isComputerTurn = false;
          this.setState({ ...this.state, isComputerTurn: false });
        } else {
          const bombedShip = this.gridArrayUser[randomColumn][randomRow];
          console.log("<<<", bombedShip);
          this.userShipProperties[bombedShip].bomedLocation.push(
            randomColumn * this.rowColumn + randomRow
          );
          this.gridArrayUser[randomColumn][randomRow] =
            this.state.anyoneWon === null
              ? "bombed"
              : this.gridArrayUser[randomColumn][randomRow];
          this.lastBombedCells.push(randomCell);
          console.log(">>>", this.lastBombedCells);
          this.checkAllUserShipsBombed();
          let isAllCellBombed = true;
          this.userShipProperties[bombedShip].cellLocation.forEach((cell) => {
            if (!this.lastBombedCells.includes(cell)) {
              isAllCellBombed = false;
            }
          });
          console.log(
            ">>>",
            this.userShipProperties[bombedShip].cellLocation,
            isAllCellBombed
          );
          if (isAllCellBombed) {
            this.userShipProperties[bombedShip].cellLocation.forEach((cell) => {
              this.lastBombedCells.splice(
                this.lastBombedCells.indexOf(cell),
                1
              );
            });
            setTimeout(() => {
              this.computerAttack();
            }, this.timeout);
          } else {
            setTimeout(() => {
              this.attakOnEitherSideOfBombedArray(bombedShip);
            }, this.timeout);
          }
        }
      } else {
        setTimeout(() => {
          this.computerAttack();
        }, this.timeout);
      }
    } else {
      const randomRow = lastBombedCellOfShip[0] % this.rowColumn;
      const randomColumn = Math.floor(lastBombedCellOfShip[0] / this.rowColumn);
      setTimeout(() => {
        this.attakOnCorrospondingCell(randomColumn, randomRow);
      }, this.timeout);
    }
  };

  checkAllUserShipsBombed = () => {
    let totalBomedCell = 0;
    Object.keys(this.userShipProperties).forEach((ship) => {
      totalBomedCell += this.userShipProperties[ship].bomedLocation.length;
    });
    if (totalBomedCell === 23) {
      this.setState({ ...this.state, anyoneWon: "computer" });
    }
  };

  checkAllComputerShipsBombed = () => {
    let totalBomedCell = 0;
    Object.keys(this.computerShipProperties).forEach((ship) => {
      totalBomedCell += this.computerShipProperties[ship].bomedLocation.length;
    });
    if (totalBomedCell === 23) {
      this.setState({ ...this.state, anyoneWon: "user" });
    }
  };

  Sketch = (p) => {
    let canvas;

    p.preload = () => {
      loadImages();
    };

    p.setup = () => {
      this.gridArrayComputer = this.initializeArray(this.rowColumn);
      this.setPositionForComputerShips();
      this.getUserShipProperties();
      this.initializeCellAvailableToBomb();
      canvas = p.createCanvas(
        window.screen.availHeight * 0.05 +
          2 +
          this.gridSize * this.rowColumn +
          this.gridSize * this.rowColumn,
        this.gridSize * this.rowColumn + 2,
        p.SVG
      );
      canvas.class("canvas-battle-ground");
    };

    p.draw = () => {
      p.clear();
      p.frameRate(30);
      createGrid();
      displayUserImage();
      displayComputerImage();
      grayoutBoard();
    };

    p.mousePressed = () => {
      if (this.state.anyoneWon === null && !this.isComputerTurn) {
        const offsetX =
          this.gridSize * this.rowColumn + window.screen.availHeight * 0.05;
        const offsetY = 1;
        const selectedColumn = Math.floor((p.mouseY - offsetY) / this.gridSize);
        const selectedRow = Math.floor((p.mouseX - offsetX) / this.gridSize);
        if (
          selectedColumn > -1 &&
          selectedColumn < this.rowColumn &&
          selectedRow > -1 &&
          selectedRow < this.rowColumn
        ) {
          if (!this.state.isBambedFirstTime) {
            this.setState({ ...this.state, isBambedFirstTime: true });
          }
          if (this.gridArrayComputer[selectedColumn][selectedRow] === null) {
            this.gridArrayComputer[selectedColumn][selectedRow] = "miss";
            console.log(">>missed");
            this.isComputerTurn = true;
            this.setState({ ...this.state, isComputerTurn: true });
            setTimeout(() => {
              this.computerAttack();
            }, this.timeout);
          } else if (
            this.gridArrayComputer[selectedColumn][selectedRow] !== "miss" &&
            this.gridArrayComputer[selectedColumn][selectedRow] !== "bombed"
          ) {
            const bombedShip = this.gridArrayComputer[selectedColumn][
              selectedRow
            ];
            console.log("Ship", bombedShip);
            this.computerShipProperties[bombedShip].bomedLocation.push(
              selectedColumn * this.rowColumn + selectedRow
            );
            this.gridArrayComputer[selectedColumn][selectedRow] =
              this.state.anyoneWon === null
                ? "bombed"
                : this.gridArrayUser[selectedColumn][selectedRow];
            this.checkAllUserShipsBombed();
            if (
              this.computerShipProperties[bombedShip].bomedLocation.length ===
              this.computerShipProperties[bombedShip].cellSize
            ) {
              this.computerShipProperties[bombedShip].displayShip = true;
            }
            this.checkAllComputerShipsBombed();
          }
        }
      }
    };

    const loadImages = () => {
      this.miniDefenderOne = p.loadImage(miniDefenderOneSVG);
      this.miniDefenderTwo = p.loadImage(miniDefenderTwoSVG);
      this.defenderOne = p.loadImage(defenderOneSVG);
      this.defenderTwo = p.loadImage(defenderTwoSVG);
      this.destroyer = p.loadImage(destroyerSVG);
      this.submarine = p.loadImage(submarineSVG);
      this.aircraftCarrier = p.loadImage(aircraftCarrierSVG);
    };

    const createGrid = () => {
      p.push();
      p.translate(1, 1);
      this.gridArrayUser.forEach((rowArray, rowIndex) =>
        rowArray.forEach((element, columnIndex) => {
          p.noStroke();
          p.fill((columnIndex + rowIndex) % 2 === 0 ? "#A2C0D9" : "#ECF2F7");
          if (element === "miss") {
            p.fill((columnIndex + rowIndex) % 2 === 0 ? "#23415A" : "#386890");
          } else if (element === "bombed") {
            p.fill((columnIndex + rowIndex) % 2 === 0 ? "#B80000" : "#DA3232");
          }
          p.square(
            columnIndex + columnIndex * (this.gridSize - 1),
            rowIndex + rowIndex * (this.gridSize - 1),
            this.gridSize
          );
        })
      );
      p.pop();
      p.push();
      p.noFill();
      p.square(1, 1, this.gridSize * this.rowColumn);
      p.pop();

      p.push();
      p.translate(
        this.gridSize * this.rowColumn + window.screen.availHeight * 0.05,
        1
      );
      this.gridArrayComputer.forEach((rowArray, rowIndex) =>
        rowArray.forEach((element, columnIndex) => {
          p.noStroke();
          p.fill((columnIndex + rowIndex) % 2 === 0 ? "#A2C0D9" : "#ECF2F7");
          if (element === "miss") {
            p.fill((columnIndex + rowIndex) % 2 === 0 ? "#23415A" : "#386890");
          } else if (element === "bombed") {
            p.fill((columnIndex + rowIndex) % 2 === 0 ? "#B80000" : "#DA3232");
          }
          p.square(
            columnIndex + columnIndex * (this.gridSize - 1),
            rowIndex + rowIndex * (this.gridSize - 1),
            this.gridSize
          );
        })
      );
      p.pop();
      p.push();
      p.noFill();
      p.square(
        this.gridSize * this.rowColumn + window.screen.availHeight * 0.05,
        1,
        this.gridSize * this.rowColumn
      );
      p.pop();
    };

    const displayUserImage = () => {
      p.push();
      if (this.userShipProperties.miniDefenderOne.alignment !== "horizontal") {
        p.translate(
          this.userShipProperties.miniDefenderOne.positionX + this.gridSize,
          this.userShipProperties.miniDefenderOne.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.userShipProperties.miniDefenderOne.positionX,
          this.userShipProperties.miniDefenderOne.positionY
        );
      }
      p.image(
        this.miniDefenderOne,
        0,
        0,
        this.gridSize * this.userShipProperties.miniDefenderOne.cellSize,
        this.gridSize * (1 - this.userShipProperties.miniDefenderOne.offsetX)
      );
      p.pop();
      p.push();
      if (this.userShipProperties.miniDefenderTwo.alignment !== "horizontal") {
        p.translate(
          this.userShipProperties.miniDefenderTwo.positionX + this.gridSize,
          this.userShipProperties.miniDefenderTwo.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.userShipProperties.miniDefenderTwo.positionX,
          this.userShipProperties.miniDefenderTwo.positionY
        );
      }
      p.image(
        this.miniDefenderTwo,
        0,
        0,
        this.gridSize * this.userShipProperties.miniDefenderTwo.cellSize,
        this.gridSize * (1 - this.userShipProperties.miniDefenderTwo.offsetX)
      );
      p.pop();
      p.push();
      if (this.userShipProperties.defenderOne.alignment !== "horizontal") {
        p.translate(
          this.userShipProperties.defenderOne.positionX + this.gridSize,
          this.userShipProperties.defenderOne.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.userShipProperties.defenderOne.positionX,
          this.userShipProperties.defenderOne.positionY
        );
      }
      p.image(
        this.defenderOne,
        0,
        0,
        this.gridSize * this.userShipProperties.defenderOne.cellSize,
        this.gridSize * (1 - this.userShipProperties.defenderOne.offsetX)
      );
      p.pop();
      p.push();
      if (this.userShipProperties.defenderTwo.alignment !== "horizontal") {
        p.translate(
          this.userShipProperties.defenderTwo.positionX + this.gridSize,
          this.userShipProperties.defenderTwo.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.userShipProperties.defenderTwo.positionX,
          this.userShipProperties.defenderTwo.positionY
        );
      }
      p.image(
        this.defenderTwo,
        0,
        0,
        this.gridSize * this.userShipProperties.defenderTwo.cellSize,
        this.gridSize * (1 - this.userShipProperties.defenderTwo.offsetX)
      );
      p.pop();
      p.push();
      if (this.userShipProperties.destroyer.alignment !== "horizontal") {
        p.translate(
          this.userShipProperties.destroyer.positionX + this.gridSize,
          this.userShipProperties.destroyer.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.userShipProperties.destroyer.positionX,
          this.userShipProperties.destroyer.positionY
        );
      }
      p.image(
        this.destroyer,
        0,
        0,
        this.gridSize * this.userShipProperties.destroyer.cellSize,
        this.gridSize * (1 - this.userShipProperties.destroyer.offsetX)
      );
      p.pop();
      p.push();
      if (this.userShipProperties.submarine.alignment !== "horizontal") {
        p.translate(
          this.userShipProperties.submarine.positionX + this.gridSize,
          this.userShipProperties.submarine.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.userShipProperties.submarine.positionX,
          this.userShipProperties.submarine.positionY
        );
      }
      p.image(
        this.submarine,
        0,
        0,
        this.gridSize * this.userShipProperties.submarine.cellSize,
        this.gridSize * (1 - this.userShipProperties.submarine.offsetX)
      );
      p.pop();
      p.push();
      if (this.userShipProperties.aircraftCarrier.alignment !== "horizontal") {
        p.translate(
          this.userShipProperties.aircraftCarrier.positionX + this.gridSize,
          this.userShipProperties.aircraftCarrier.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.userShipProperties.aircraftCarrier.positionX,
          this.userShipProperties.aircraftCarrier.positionY
        );
      }
      p.image(
        this.aircraftCarrier,
        0,
        0,
        this.gridSize * this.userShipProperties.aircraftCarrier.cellSize,
        this.gridSize * (1 - this.userShipProperties.aircraftCarrier.offsetX)
      );
      p.pop();
    };

    const displayComputerImage = () => {
      if (this.computerShipProperties.miniDefenderOne.displayShip) {
        p.push();
        if (
          this.computerShipProperties.miniDefenderOne.alignment !== "horizontal"
        ) {
          p.translate(
            this.computerShipProperties.miniDefenderOne.positionX +
              this.gridSize,
            this.computerShipProperties.miniDefenderOne.positionY
          );
          p.rotate((p.PI / 180) * 90);
        } else {
          p.translate(
            this.computerShipProperties.miniDefenderOne.positionX,
            this.computerShipProperties.miniDefenderOne.positionY
          );
        }
        p.image(
          this.miniDefenderOne,
          0,
          0,
          this.gridSize * this.computerShipProperties.miniDefenderOne.cellSize,
          this.gridSize *
            (1 - this.computerShipProperties.miniDefenderOne.offsetX)
        );
        p.pop();
      }
      if (this.computerShipProperties.miniDefenderTwo.displayShip) {
        p.push();
        if (
          this.computerShipProperties.miniDefenderTwo.alignment !== "horizontal"
        ) {
          p.translate(
            this.computerShipProperties.miniDefenderTwo.positionX +
              this.gridSize,
            this.computerShipProperties.miniDefenderTwo.positionY
          );
          p.rotate((p.PI / 180) * 90);
        } else {
          p.translate(
            this.computerShipProperties.miniDefenderTwo.positionX,
            this.computerShipProperties.miniDefenderTwo.positionY
          );
        }
        p.image(
          this.miniDefenderTwo,
          0,
          0,
          this.gridSize * this.computerShipProperties.miniDefenderTwo.cellSize,
          this.gridSize *
            (1 - this.computerShipProperties.miniDefenderTwo.offsetX)
        );
        p.pop();
      }
      if (this.computerShipProperties.defenderOne.displayShip) {
        p.push();
        if (
          this.computerShipProperties.defenderOne.alignment !== "horizontal"
        ) {
          p.translate(
            this.computerShipProperties.defenderOne.positionX + this.gridSize,
            this.computerShipProperties.defenderOne.positionY
          );
          p.rotate((p.PI / 180) * 90);
        } else {
          p.translate(
            this.computerShipProperties.defenderOne.positionX,
            this.computerShipProperties.defenderOne.positionY
          );
        }
        p.image(
          this.defenderOne,
          0,
          0,
          this.gridSize * this.computerShipProperties.defenderOne.cellSize,
          this.gridSize * (1 - this.computerShipProperties.defenderOne.offsetX)
        );
        p.pop();
      }
      if (this.computerShipProperties.defenderTwo.displayShip) {
        p.push();
        if (
          this.computerShipProperties.defenderTwo.alignment !== "horizontal"
        ) {
          p.translate(
            this.computerShipProperties.defenderTwo.positionX + this.gridSize,
            this.computerShipProperties.defenderTwo.positionY
          );
          p.rotate((p.PI / 180) * 90);
        } else {
          p.translate(
            this.computerShipProperties.defenderTwo.positionX,
            this.computerShipProperties.defenderTwo.positionY
          );
        }
        p.image(
          this.defenderTwo,
          0,
          0,
          this.gridSize * this.computerShipProperties.defenderTwo.cellSize,
          this.gridSize * (1 - this.computerShipProperties.defenderTwo.offsetX)
        );
        p.pop();
      }
      if (this.computerShipProperties.destroyer.displayShip) {
        p.push();
        if (this.computerShipProperties.destroyer.alignment !== "horizontal") {
          p.translate(
            this.computerShipProperties.destroyer.positionX + this.gridSize,
            this.computerShipProperties.destroyer.positionY
          );
          p.rotate((p.PI / 180) * 90);
        } else {
          p.translate(
            this.computerShipProperties.destroyer.positionX,
            this.computerShipProperties.destroyer.positionY
          );
        }
        p.image(
          this.destroyer,
          0,
          0,
          this.gridSize * this.computerShipProperties.destroyer.cellSize,
          this.gridSize * (1 - this.computerShipProperties.destroyer.offsetX)
        );
        p.pop();
      }
      if (this.computerShipProperties.submarine.displayShip) {
        p.push();
        if (this.computerShipProperties.submarine.alignment !== "horizontal") {
          p.translate(
            this.computerShipProperties.submarine.positionX + this.gridSize,
            this.computerShipProperties.submarine.positionY
          );
          p.rotate((p.PI / 180) * 90);
        } else {
          p.translate(
            this.computerShipProperties.submarine.positionX,
            this.computerShipProperties.submarine.positionY
          );
        }
        p.image(
          this.submarine,
          0,
          0,
          this.gridSize * this.computerShipProperties.submarine.cellSize,
          this.gridSize * (1 - this.computerShipProperties.submarine.offsetX)
        );
        p.pop();
      }
      if (this.computerShipProperties.aircraftCarrier.displayShip) {
        p.push();
        if (
          this.computerShipProperties.aircraftCarrier.alignment !== "horizontal"
        ) {
          p.translate(
            this.computerShipProperties.aircraftCarrier.positionX +
              this.gridSize,
            this.computerShipProperties.aircraftCarrier.positionY
          );
          p.rotate((p.PI / 180) * 90);
        } else {
          p.translate(
            this.computerShipProperties.aircraftCarrier.positionX,
            this.computerShipProperties.aircraftCarrier.positionY
          );
        }
        p.image(
          this.aircraftCarrier,
          0,
          0,
          this.gridSize * this.computerShipProperties.aircraftCarrier.cellSize,
          this.gridSize *
            (1 - this.computerShipProperties.aircraftCarrier.offsetX)
        );
        p.pop();
      }
    };

    const grayoutBoard = () => {
      const color = p.color(128, 128, 128);
      color.setAlpha(100);
      if (this.isComputerTurn || this.state.anyoneWon !== null) {
        p.push();
        p.fill(color);
        p.square(
          this.gridSize * this.rowColumn + window.screen.availHeight * 0.05,
          1,
          this.gridSize * this.rowColumn
        );
        p.pop();
      }
      if (!this.isComputerTurn || this.state.anyoneWon !== null) {
        p.push();
        p.fill(color);
        p.square(1, 1, this.gridSize * this.rowColumn);
        p.pop();
      }
    };
  };

  componentDidMount() {
    if (this.props.gridArray.length) {
      this.p5Ref = new p5(this.Sketch, this.canvasRefs.current);
    }
    this.setState({ ...this.state, isDialogOpen: true });
  }

  handleDialogOpen = () => {
    console.log(">>", this);
    this.setState({ ...this.state, isDialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ ...this.state, isDialogOpen: false });
  };

  handleMenuOpenClose = () => {
    console.log("openMenu");
    this.setState({
      ...this.state,
      isHelpMenuOpen: !this.state.isHelpMenuOpen,
    });
  };

  render() {
    return (
      <>
        {this.props.gridArray.length ? (
          <>
            <div style={classes.canvas} ref={this.canvasRefs}></div>
            {this.state.isBambedFirstTime ? (
              <>
                {this.state.anyoneWon === null ? (
                  <>
                    {this.state.isComputerTurn ? (
                      <h3 style={classes.h3}>Computer's Turn</h3>
                    ) : (
                      <h3 style={classes.h3}>Your's Turn</h3>
                    )}
                  </>
                ) : (
                  <>
                    {this.state.anyoneWon === "user" ? (
                      <>
                        <h3 style={classes.h3}>User Won</h3>
                        <div style={classes.congratsText} onClick={() => {}}>
                          <div style={classes.dialog}>
                            <h1 style={classes.h1}>
                              Congrats {this.props.userName}!🎉 You Won the
                              Battle. 🤩
                            </h1>
                            <Divider />
                            <Button
                              style={classes.buttonRoute}
                              color="primary"
                              variant="contained"
                              size="large"
                              onClick={this.handleRoute}
                            >
                              Play Again
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 style={classes.h3}>Computer Won</h3>
                        <div style={classes.congratsText} onClick={() => {}}>
                          <div style={classes.dialog}>
                            <h1 style={classes.h1}>
                              Sorry {this.props.userName}🌋, Good Luck next
                              time. 😔
                            </h1>
                            <Divider />
                            <Button
                              style={classes.buttonRoute}
                              color="primary"
                              variant="contained"
                              size="large"
                              onClick={this.handleRoute}
                            >
                              Play Again
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <div style={classes.helpContainer}>
                <Fab
                  size="small"
                  color="primary"
                  onClick={this.handleMenuOpenClose}
                >
                  {this.state.isHelpMenuOpen ? <CancelIcon /> : <InfoIcon />}
                </Fab>
                {this.state.isHelpMenuOpen ? (
                  <div style={classes.helpMenu}>
                    Select the cell to launch the missile.
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h3 style={classes.h3}>No data found !</h3>
            <Button
              style={classes.arrangeButton}
              color="primary"
              variant="contained"
              size="large"
              onClick={this.handleRoute}
            >
              Arrange Again
            </Button>
          </>
        )}
      </>
    );
  }
}

export default withRouter(BattleGroundCanvas);
