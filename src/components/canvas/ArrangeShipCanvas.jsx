import React from "react";
import p5 from "p5";
import { withRouter } from "react-router-dom";
import { SHIP_PROPERTIES } from "../../constants";

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
    marginTop: "auto",
    height: "90%",
  },
  button: {
    position: "absolute",
    top: "50%",
    left: "70%",
  },
  instructions: {
    marginLeft: "37%",
    backgroundColor: "rgb(255,255,255, 0.75)",
  },
  h4: {
    margin: "0px",
    fontSize: "3vh",
  },
  li: {
    fontSize: "smaller",
  },
};

class ArrangeShipCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRefs = React.createRef();
    this.state = {
      isArrageShipCompleted: false,
      isDragged: false,
      isKeyPressed: false,
    };
  }
  rowColumn = 10;
  gridSize =
    (window.screen.availHeight - window.screen.availHeight * 0.25) /
    this.rowColumn;

  gridArray;

  miniDefenderOne;
  miniDefenderTwo;
  defenderOne;
  defenderTwo;
  destroyer;
  submarine;
  aircraftCarrier;

  mouseImageOffsetX;
  mouseImageOffsetY;
  currentlySelectedShip;

  shipProperties = new SHIP_PROPERTIES();

  initializeArray = (index) => {
    const grid = new Array(index)
      .fill(null)
      .map(() => new Array(index).fill(null));
    return grid;
  };

  calculateInitialPositions = () => {
    Object.keys(this.shipProperties).forEach((ship, index) => {
      this.shipProperties[ship].positionX =
        window.screen.availHeight * 0.05 + this.gridSize * this.rowColumn;
      this.shipProperties[ship].positionY =
        window.screen.availHeight * 0.03 + index * this.gridSize;
    });
  };

  resetShipPosition = (ship, index) => {
    this.shipProperties[ship].alignment = "horizontal";
    this.shipProperties[ship].positionX =
      window.screen.availHeight * 0.05 + this.gridSize * this.rowColumn;
    this.shipProperties[ship].positionY =
      window.screen.availHeight * 0.03 + index * this.gridSize;
    this.gridArray = this.gridArray.map((column) =>
      column.map((cell) => (cell === ship ? null : cell))
    );
    this.shipProperties[ship].cellLocation = [];
  };

  clearHover = (excludeShip) => {
    Object.keys(this.shipProperties).forEach((ship) => {
      if (this.shipProperties[ship] !== excludeShip) {
        this.shipProperties[ship].hovered = false;
      }
    });
  };

  isArrageShipComplete = () => {
    let totalLength = 0;
    Object.keys(this.shipProperties).forEach((ship) => {
      totalLength += this.shipProperties[ship].cellLocation.length;
    });
    if (totalLength === 23) {
      this.setState({
        ...this.state,
        isArrageShipCompleted: true,
      });
    } else {
      this.setState({
        ...this.state,
        isArrageShipCompleted: false,
      });
    }
  };

  sendGridArray = () => {
    this.props.getGridArray(this.gridArray);
    this.props.history.push("/battleGround");
  };

  Sketch = (p) => {
    let canvas;

    p.preload = () => {
      this.calculateInitialPositions();
      loadImages();
    };

    p.setup = () => {
      this.gridArray = this.initializeArray(this.rowColumn);
      canvas = p.createCanvas(
        window.screen.availHeight * 0.05 +
          2 +
          this.gridSize * this.rowColumn +
          5 * this.gridSize,
        this.gridSize * this.rowColumn + 2,
        p.SVG
      );
      canvas.class("canvas-ship");
    };

    p.draw = () => {
      p.clear();
      p.frameRate(30);
      createGrid();
      displayImage();
      drawSquareAroundhoveredShip();
    };

    p.mousePressed = () => {
      Object.keys(this.shipProperties).forEach((ship) => {
        if (isInsideShip(this.shipProperties[ship])) {
          this.shipProperties[ship].selected = true;
          this.currentlySelectedShip = this.shipProperties[ship];
          clearSelected(ship);
          calculateOffsetMouseDrag(this.shipProperties[ship]);
        }
      });
    };

    p.mouseReleased = () => {
      Object.keys(this.shipProperties).forEach((ship, index) => {
        if (this.shipProperties[ship].selected) {
          const offsetX = 1;
          const offsetY = 1;
          const grabXRatio = Math.round(
            (this.shipProperties[ship].positionX - offsetX) /
              (this.gridSize - 1)
          );
          const grabYRatio = Math.round(
            (this.shipProperties[ship].positionY - offsetY) /
              (this.gridSize - 1)
          );
          if (
            this.shipProperties[ship].alignment === "horizontal" &&
            grabXRatio + this.shipProperties[ship].cellSize <= this.rowColumn &&
            grabYRatio < this.rowColumn &&
            grabXRatio >= 0 &&
            grabYRatio >= 0
          ) {
            this.shipProperties[ship].positionX =
              this.gridSize * grabXRatio + offsetX;
            this.shipProperties[ship].positionY =
              this.gridSize * grabYRatio + offsetY + 4;
            assignLocation(ship, index, grabXRatio, grabYRatio);
            this.isArrageShipComplete();
          } else if (
            this.shipProperties[ship].alignment === "vertical" &&
            grabYRatio + this.shipProperties[ship].cellSize <= this.rowColumn &&
            grabXRatio < this.rowColumn &&
            grabXRatio >= 0 &&
            grabYRatio >= 0
          ) {
            this.shipProperties[ship].positionX =
              this.gridSize * grabXRatio + offsetX - 4;
            this.shipProperties[ship].positionY =
              this.gridSize * grabYRatio + offsetY;
            assignLocation(ship, index, grabXRatio, grabYRatio);
            this.isArrageShipComplete();
          } else {
            this.resetShipPosition(ship, index);
            this.isArrageShipComplete();
          }
        }
      });
      this.currentlySelectedShip = null;
      clearSelected(null);
    };

    p.mouseDragged = () => {
      if (!this.state.isDragged) {
        this.setState({ ...this.state, isDragged: true });
      }
      Object.keys(this.shipProperties).forEach((ship) => {
        if (this.shipProperties[ship].selected) {
          this.shipProperties[ship].positionX =
            p.mouseX - this.mouseImageOffsetX;
          this.shipProperties[ship].positionY =
            p.mouseY - this.mouseImageOffsetY;
        }
      });
    };

    p.keyPressed = () => {
      if (this.currentlySelectedShip && p.keyCode === 72) {
        if (!this.state.isKeyPressed) {
          this.setState({ ...this.state, isKeyPressed: true });
        }
        Object.keys(this.shipProperties).forEach((ship) => {
          if (this.shipProperties[ship] === this.currentlySelectedShip) {
            this.shipProperties[ship].alignment = "horizontal";
            this.mouseImageOffsetX = this.gridSize / 2;
            this.mouseImageOffsetY = this.gridSize / 2;
            this.shipProperties[ship].positionX =
              p.mouseX - this.mouseImageOffsetX;
            this.shipProperties[ship].positionY =
              p.mouseY - this.mouseImageOffsetY;
          }
        });
      } else if (this.currentlySelectedShip && p.keyCode === 86) {
        if (!this.state.isKeyPressed) {
          this.setState({ ...this.state, isKeyPressed: true });
        }
        Object.keys(this.shipProperties).forEach((ship) => {
          if (this.shipProperties[ship] === this.currentlySelectedShip) {
            this.shipProperties[ship].alignment = "vertical";
            this.mouseImageOffsetX = this.gridSize / 2;
            this.mouseImageOffsetY = this.gridSize / 2;
            this.shipProperties[ship].positionX =
              p.mouseX - this.mouseImageOffsetX;
            this.shipProperties[ship].positionY =
              p.mouseY - this.mouseImageOffsetY;
          }
        });
      }
    };

    const calculateOffsetMouseDrag = (ship) => {
      this.mouseImageOffsetX = p.mouseX - ship.positionX;
      this.mouseImageOffsetY =
        p.mouseY - ship.positionY - (this.gridSize * ship.offsetX) / 2;
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
      this.gridArray.forEach((rowArray, rowIndex) =>
        rowArray.forEach((element, columnIndex) => {
          p.noStroke();
          p.fill((columnIndex + rowIndex) % 2 === 0 ? "#A2C0D9" : "#ECF2F7");
          p.square(
            rowIndex + rowIndex * (this.gridSize - 1),
            columnIndex + columnIndex * (this.gridSize - 1),
            this.gridSize
          );
        })
      );
      p.pop();
      p.push();
      p.noFill();
      p.square(1, 1, this.gridSize * this.rowColumn);
      p.pop();
    };

    const displayImage = () => {
      p.push();
      if (this.shipProperties.miniDefenderOne.alignment !== "horizontal") {
        p.translate(
          this.shipProperties.miniDefenderOne.positionX + this.gridSize,
          this.shipProperties.miniDefenderOne.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.shipProperties.miniDefenderOne.positionX,
          this.shipProperties.miniDefenderOne.positionY
        );
      }
      p.image(
        this.miniDefenderOne,
        0,
        0,
        this.gridSize * this.shipProperties.miniDefenderOne.cellSize,
        this.gridSize * (1 - this.shipProperties.miniDefenderOne.offsetX)
      );
      p.pop();
      p.push();
      if (this.shipProperties.miniDefenderTwo.alignment !== "horizontal") {
        p.translate(
          this.shipProperties.miniDefenderTwo.positionX + this.gridSize,
          this.shipProperties.miniDefenderTwo.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.shipProperties.miniDefenderTwo.positionX,
          this.shipProperties.miniDefenderTwo.positionY
        );
      }
      p.image(
        this.miniDefenderTwo,
        0,
        0,
        this.gridSize * this.shipProperties.miniDefenderTwo.cellSize,
        this.gridSize * (1 - this.shipProperties.miniDefenderTwo.offsetX)
      );
      p.pop();
      p.push();
      if (this.shipProperties.defenderOne.alignment !== "horizontal") {
        p.translate(
          this.shipProperties.defenderOne.positionX + this.gridSize,
          this.shipProperties.defenderOne.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.shipProperties.defenderOne.positionX,
          this.shipProperties.defenderOne.positionY
        );
      }
      p.image(
        this.defenderOne,
        0,
        0,
        this.gridSize * this.shipProperties.defenderOne.cellSize,
        this.gridSize * (1 - this.shipProperties.defenderOne.offsetX)
      );
      p.pop();
      p.push();
      if (this.shipProperties.defenderTwo.alignment !== "horizontal") {
        p.translate(
          this.shipProperties.defenderTwo.positionX + this.gridSize,
          this.shipProperties.defenderTwo.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.shipProperties.defenderTwo.positionX,
          this.shipProperties.defenderTwo.positionY
        );
      }
      p.image(
        this.defenderTwo,
        0,
        0,
        this.gridSize * this.shipProperties.defenderTwo.cellSize,
        this.gridSize * (1 - this.shipProperties.defenderTwo.offsetX)
      );
      p.pop();
      p.push();
      if (this.shipProperties.destroyer.alignment !== "horizontal") {
        p.translate(
          this.shipProperties.destroyer.positionX + this.gridSize,
          this.shipProperties.destroyer.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.shipProperties.destroyer.positionX,
          this.shipProperties.destroyer.positionY
        );
      }
      p.image(
        this.destroyer,
        0,
        0,
        this.gridSize * this.shipProperties.destroyer.cellSize,
        this.gridSize * (1 - this.shipProperties.destroyer.offsetX)
      );
      p.pop();
      p.push();
      if (this.shipProperties.submarine.alignment !== "horizontal") {
        p.translate(
          this.shipProperties.submarine.positionX + this.gridSize,
          this.shipProperties.submarine.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.shipProperties.submarine.positionX,
          this.shipProperties.submarine.positionY
        );
      }
      p.image(
        this.submarine,
        0,
        0,
        this.gridSize * this.shipProperties.submarine.cellSize,
        this.gridSize * (1 - this.shipProperties.submarine.offsetX)
      );
      p.pop();
      p.push();
      if (this.shipProperties.aircraftCarrier.alignment !== "horizontal") {
        p.translate(
          this.shipProperties.aircraftCarrier.positionX + this.gridSize,
          this.shipProperties.aircraftCarrier.positionY
        );
        p.rotate((p.PI / 180) * 90);
      } else {
        p.translate(
          this.shipProperties.aircraftCarrier.positionX,
          this.shipProperties.aircraftCarrier.positionY
        );
      }
      p.image(
        this.aircraftCarrier,
        0,
        0,
        this.gridSize * this.shipProperties.aircraftCarrier.cellSize,
        this.gridSize * (1 - this.shipProperties.aircraftCarrier.offsetX)
      );
      p.pop();
    };

    const isInsideShip = (ship) => {
      if (ship.alignment === "horizontal") {
        return (
          p.mouseX > ship.positionX &&
          p.mouseX < ship.positionX + ship.cellSize * this.gridSize &&
          p.mouseY > ship.positionY - (this.gridSize * ship.offsetX) / 2 &&
          p.mouseY <
            ship.positionY - (this.gridSize * ship.offsetX) / 2 + this.gridSize
        );
      } else {
        return (
          p.mouseX > ship.positionX &&
          p.mouseX < ship.positionX + this.gridSize &&
          p.mouseY > ship.positionY &&
          p.mouseY < ship.positionY + ship.cellSize * this.gridSize
        );
      }
    };

    const clearSelected = (excludeShip) => {
      Object.keys(this.shipProperties).forEach((ship) => {
        if (ship !== excludeShip) {
          this.shipProperties[ship].selected = false;
        }
      });
    };

    const drawRectangleAroundShip = (ship) => {
      p.push();
      if (ship.hovered) {
        p.rectMode(p.CORNER);
        p.noFill();
        if (ship.alignment === "horizontal") {
          p.rect(
            ship.positionX,
            ship.positionY - (this.gridSize * ship.offsetX) / 2,
            ship.cellSize * this.gridSize,
            this.gridSize
          );
        } else {
          p.rect(
            ship.positionX + (this.gridSize * ship.offsetX) / 2,
            ship.positionY,
            this.gridSize,
            ship.cellSize * this.gridSize
          );
        }
      }
      p.pop();
    };

    const assignHorizontalPosition = (ship, index, grabXRatio, grabYRatio) => {
      this.shipProperties[ship].cellLocation = [];
      let isAnyShipPresetInDroppedPosition = false;
      for (let cell = 0; cell < this.shipProperties[ship].cellSize; cell++) {
        if (this.gridArray[grabYRatio][grabXRatio + cell]) {
          isAnyShipPresetInDroppedPosition = true;
        }
      }
      if (!isAnyShipPresetInDroppedPosition) {
        for (let cell = 0; cell < this.shipProperties[ship].cellSize; cell++) {
          this.shipProperties[ship].cellLocation.push(
            grabYRatio * this.rowColumn + grabXRatio + cell
          );
          this.gridArray[grabYRatio][grabXRatio + cell] = ship;
        }
      } else {
        this.resetShipPosition(ship, index);
      }
    };

    const assignVerticalPosition = (ship, index, grabXRatio, grabYRatio) => {
      this.shipProperties[ship].cellLocation = [];
      let isAnyShipPresetInDroppedPosition = false;
      for (let cell = 1; cell <= this.shipProperties[ship].cellSize; cell++) {
        if (this.gridArray[grabYRatio + cell - 1][grabXRatio]) {
          isAnyShipPresetInDroppedPosition = true;
        }
      }
      if (!isAnyShipPresetInDroppedPosition) {
        for (let cell = 1; cell <= this.shipProperties[ship].cellSize; cell++) {
          this.shipProperties[ship].cellLocation.push(
            grabYRatio * this.rowColumn * cell + grabXRatio
          );
          this.gridArray[grabYRatio + cell - 1][grabXRatio] = ship;
        }
      } else {
        this.resetShipPosition(ship, index);
      }
    };

    const assignLocation = (ship, index, grabXRatio, grabYRatio) => {
      const mapShipToIndices = this.gridArray.map((column, columnIndex) =>
        column.map((cell, cellIndex) =>
          cell === ship ? columnIndex * this.rowColumn + cellIndex : null
        )
      );
      let previousLocation = [];
      mapShipToIndices.forEach((row) => {
        previousLocation = previousLocation.concat(row);
      });
      previousLocation = previousLocation.filter((e) => e !== null);
      if (previousLocation.length) {
        previousLocation.forEach((location) => {
          const column = Math.floor(location / this.rowColumn);
          const row = location % this.rowColumn;
          this.gridArray[column][row] = null;
        });
      }
      if (this.shipProperties[ship].alignment === "horizontal") {
        assignHorizontalPosition(ship, index, grabXRatio, grabYRatio);
      } else if (this.shipProperties[ship].alignment === "vertical") {
        assignVerticalPosition(ship, index, grabXRatio, grabYRatio);
      }
    };

    const drawSquareAroundhoveredShip = () => {
      Object.keys(this.shipProperties).forEach((ship) => {
        drawRectangleAroundShip(this.shipProperties[ship]);
      });
      if (isInsideShip(this.shipProperties.miniDefenderOne)) {
        this.shipProperties.miniDefenderOne.hovered = true;
        this.clearHover(this.shipProperties.miniDefenderOne);
      } else if (isInsideShip(this.shipProperties.miniDefenderTwo)) {
        this.shipProperties.miniDefenderTwo.hovered = true;
        this.clearHover(this.shipProperties.miniDefenderTwo);
      } else if (isInsideShip(this.shipProperties.defenderOne)) {
        this.shipProperties.defenderOne.hovered = true;
        this.clearHover(this.shipProperties.defenderOne);
      } else if (isInsideShip(this.shipProperties.defenderTwo)) {
        this.shipProperties.defenderTwo.hovered = true;
        this.clearHover(this.shipProperties.defenderTwo);
      } else if (isInsideShip(this.shipProperties.destroyer)) {
        this.shipProperties.destroyer.hovered = true;
        this.clearHover(this.shipProperties.destroyer);
      } else if (isInsideShip(this.shipProperties.submarine)) {
        this.shipProperties.submarine.hovered = true;
        this.clearHover(this.shipProperties.submarine);
      } else if (isInsideShip(this.shipProperties.aircraftCarrier)) {
        this.shipProperties.aircraftCarrier.hovered = true;
        this.clearHover(this.shipProperties.aircraftCarrier);
      } else {
        this.clearHover(null);
      }
    };
  };

  componentDidMount() {
    this.p5Ref = new p5(this.Sketch, this.canvasRefs.current);
  }

  componentWillUnmount() {
    this.canvasRefs = null;
    this.p5Ref.noCanvas();
    this.p5Ref.remove();
    this.p5Ref.removeElements();
  }

  render() {
    return (
      <>
        <div style={classes.canvas} ref={this.canvasRefs}></div>
        {this.state.isArrageShipCompleted ? (
          <button style={classes.button} onClick={this.sendGridArray}>
            Lets Battle !
          </button>
        ) : (
          <></>
        )}
        <div className="instructionsContainer">
          <div style={classes.instructions}>
            {!this.state.isDragged || !this.state.isKeyPressed ? (
              <h4 style={classes.h4}>Instructions</h4>
            ) : (
              <></>
            )}
            {!this.state.isDragged || !this.state.isKeyPressed ? (
              <ul>
                {!this.state.isDragged ? (
                  <li style={classes.li}>Drag your ship with mouse.</li>
                ) : (
                  <></>
                )}
                {!this.state.isKeyPressed ? (
                  <li style={classes.li}>
                    Use key V or H to align ship vertically or horizontally
                    while Dragging ship.
                  </li>
                ) : (
                  <></>
                )}
                <li style={classes.li}>Ships can't be overlapped.</li>
              </ul>
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ArrangeShipCanvas);
