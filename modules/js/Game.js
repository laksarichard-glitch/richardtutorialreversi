/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * richardtutorialreversi implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

import { PlayerTurn } from "./PlayerTurn.js";

/**
 * We create one State class per declared state on the PHP side, to handle all state specific code here.
 * onEnteringState, onLeavingState and onPlayerActivationChange are predefined names that will be called by the framework.
 * When executing code in this state, you can access the args using this.args
 */
const BgaAnimations = await importEsmLib("bga-animations", "1.x");

export class Game {
  constructor(bga) {
    console.log("richardtutorialreversi constructor");
    this.bga = bga;

    // Declare the State classes
    this.playerTurn = new PlayerTurn(this, bga);
    this.bga.states.register("PlayerTurn", this.playerTurn);

    // Uncomment the next line to show debug informations about state changes in the console. Remove before going to production!
    // this.bga.states.logger = console.log;

    // Here, you can init the global variables of your user interface
    // Example:
    // this.myGlobalValue = 0;
  }

  /*
        setup:
        
        This method must set up the game user interface according to current game situation specified
        in parameters.
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
        
        "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
    */

  setup(gamedatas) {
    console.log("Starting game setup");
    this.gamedatas = gamedatas;

    this.animationManager = new BgaAnimations.Manager({
      animationsActive: () => this.bga.gameui.bgaAnimationsActive(),
    });

    // Example to add a div on the game area
    this.bga.gameArea.getElement().insertAdjacentHTML(
      "beforeend",
      `
            <div id="player-tables"></div>
        `,
    );

    this.bga.gameArea.getElement().insertAdjacentHTML(
      "beforeend",
      `
        <div id="board">
        </div>
      `,
    );

    // Setting up player boards
    Object.values(gamedatas.players).forEach((player) => {
      // example of setting up players boards
      this.bga.playerPanels.getElement(player.id).insertAdjacentHTML(
        "beforeend",
        `
                <span id="energy-player-counter-${player.id}"></span> Energy
            `,
      );
      const counter = new ebg.counter();
      counter.create(`energy-player-counter-${player.id}`, {
        value: player.energy,
        playerCounter: "energy",
        playerId: player.id,
      });
    });

    // TODO: Set up your game interface here, according to "gamedatas"
    const board = document.getElementById("board");
    const hor_scale = 64.8;
    const ver_scale = 64.4;
    for (let x = 1; x <= 8; x++) {
      for (let y = 1; y <= 8; y++) {
        const left = Math.round((x - 1) * hor_scale + 10);
        const top = Math.round((y - 1) * ver_scale + 7);
        // we use afterbegin to make sure squares are placed before discs
        board.insertAdjacentHTML(
          `afterbegin`,
          `<div id="square_${x}_${y}" class="square" style="left: ${left}px; top: ${top}px;"></div>`,
        );
      }
    }

    // this.addDiscOnBoard(2, 2, this.bga.players.getCurrentPlayerId(), false);
    for (var i in gamedatas.board) {
      const square = gamedatas.board[i];

      if (square.player !== null) {
        this.addDiscOnBoard(square.x, square.y, square.player);
      }
    }

    // Setup game notifications to handle (see "setupNotifications" method below)
    this.setupNotifications();

    console.log("Ending game setup");
  }

  ///////////////////////////////////////////////////
  //// Utility methods
  async addDiscOnBoard(x, y, playerId, animate = true) {
    const color = this.gamedatas.players[playerId].color;
    const discId = `disc_${x}_${y}`;

    document.getElementById(`square_${x}_${y}`).insertAdjacentHTML(
      "beforeend",
      `
                <div class="disc" data-color="${color}" id="${discId}">
                    <div class="disc-faces">
                        <div class="disc-face" data-side="white"></div>
                        <div class="disc-face" data-side="black"></div>
                    </div>
                </div>
            `,
    );

    if (animate) {
      const element = document.getElementById(discId);
      await this.animationManager.fadeIn(
        element,
        document.getElementById(`overall_player_board_${playerId}`),
      );
    }
  }

  /*
    
        Here, you can defines some utility methods that you can use everywhere in your javascript
        script. Typically, functions that are used in multiple state classes or outside a state class.
    
    */

  ///////////////////////////////////////////////////
  //// Reaction to cometD notifications

  /*
        setupNotifications:
        
        In this method, you associate each of your game notifications with your local method to handle it.
        
        Note: game notification names correspond to "bga->notify->all" calls in your Game.php file.
    
    */
  setupNotifications() {
    console.log("notifications subscriptions setup");

    // automatically listen to the notifications, based on the `notif_xxx` function on this class.
    // Uncomment the logger param to see debug information in the console about notifications.
    this.bga.notifications.setupPromiseNotifications({
      // logger: console.log
    });
  }

  // TODO: from this point and below, you can write your game notifications handling methods

  /*
    Example:
    async notif_cardPlayed( args ) {
        // Note: args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
        
        // TODO: play the card in the user interface.
    }
    */
}
