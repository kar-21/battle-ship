# Battle-Ship

![Netlify](https://img.shields.io/netlify/fd7b8c65-357c-46eb-8196-e40ec73a8131?color=limegreen&style=flat-square) ![yarn](https://img.shields.io/badge/yarn-1.22.4-red?style=flat-square) ![P5.js](https://img.shields.io/badge/p5.js-v1.1.9-yellow?style=flat-square) ![React.js](https://img.shields.io/badge/React-v16.13.1-blue?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-yellowgreen?style=flat-square)

An interactive battle ground designed for the gamers with the help of React.js and P5.js. Player forms a navy fleet with help of 7 ships. Player ship will encounter a battle with a bot navy fleet.

Battle Ship's URL is [https://battleship-p5.netlify.app](https://battleship-p5.netlify.app)

# Features

Battle ship is a one player game who plays with a bot. Player will have a 7 ships to form a fleet. They arrange ships in the 10x10 square board. Each ship has its own cell size. They are respectively -

- 1 x Aircraft Carrier --- 5 cells
- 1 x Submarine --- 4 cells
- 1 x Cruiser --- 4 cells
- 2 x Destroyer --- 3 cells
- 2 x Patrol ship --- 2 cells

Game is divided into 2 major features - Arrange Ship & Battle Ground. Few other small feature are designed to enhance the User Experience in the game.

## Arrange Ship
Player will have his own battle ground of size 10x10 board. In this board, player will position their ship in the board without any overlap of ships. Each ship will require 2 to 5 consecutive cells based in ship type and player can arrange ship in 2 orientation type - horizontal & vertical. 

Player can easily arrange the ships by dragging the ship & dropping it inside the board. Player can re-arrange the ship as many times as they want before proceeding to battle ground. Once player proceed to battle they can change the position of ship.

## Battle Ground 
 Bot will have his own battle ground 10x10 board. Bot will also have 7 ships and bot will arrange its ships in its own board. Bot's ship will not be visible to player.
 
 Player will guess bot's ship location and lock a cell to bomb it. If bomb hits bot's ship player will get one more chance. If player missed Bot's ship, then turn will switch to Bot and Bot will bomb player's ship. The first one to bomb all opponents 7 ship will win the game.

# Tech

Battle Ship uses a number of open source projects to work properly:

* [React] - A JavaScript library for building user interfaces
* [react-dom] - DOM structure helps react entry point
* [react-dev-utils] - Some utilities used by react apps
* [react-script] - An elegant, flexible DSL for React for use with CoffeeScript
* [p5] - A JavaScript library for creative coding to create canvas
* [react-router-dom] - DOM binding for react router
* [react-full-screen] - A React component that sets its children to fullscreen
* [react-screen-orientation] - A React component that displays its children based on orientation
* [node-sass] - Allows to natively compile .scss files to css automatically via a connect middleware
* [@material-ui/core] - React components for faster and easier web development
* [@material-ui/icons] - Provides the Google Material icons packaged as a set of React components

And of course Battle Ship itself is open source with a [public repository][Battleship-repo] on GitHub.

## Installing dependencies

Yarn package manager is used in this project. If yarn is not installed in the machine refer this link [yarn](https://yarnpkg.com/getting-started/install).
Run `yarn` or `yarn install` to install all dependencies for this project. 

## Development server

Run `yarn start` or `react-scripts start` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Build

Run `yarn build` or `react-scripts build` to generate production build. The build artifacts will be stored in the `build/` directory.

To host build folder locally using a third party library [http-server](https://www.npmjs.com/package/http-server), follow these steps - 
- Run `yarn build` and  install http-server globally by running `yarn global add http-serve`. 
- Navigate to `build/` folder from command line and run `http-server -a=127.0.0.1 -p=8080`.
- Open `http://127.0.0.1:8080` in the browser to access the served build.

   [react]: <https://reactjs.org/>
   [react-dom]: <https://www.npmjs.com/package/react-dom>
   [react-dev-utils]: <https://www.npmjs.com/package/react-dev-utils>
   [react-script]: <https://www.npmjs.com/package/react-script>
   [p5]: <https://p5js.org>
   [react-router-dom]: <https://www.npmjs.com/package/react-router-dom>
   [react-full-screen]: <https://www.npmjs.com/package/react-full-screen>
   [react-screen-orientation]: <https://www.npmjs.com/package/react-screen-orientation>
   [node-sass]: <https://www.npmjs.com/package/node-sass>
   [@material-ui/core]: <https://material-ui.com>
   [@material-ui/icons]: <https://www.npmjs.com/package/@material-ui/icons>
   [Battleship-repo]: <https://github.com/kar-21/battle-ship>
