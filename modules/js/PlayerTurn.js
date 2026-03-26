export class PlayerTurn {
  constructor(game, bga) {
    this.game = game;
    this.bga = bga;
  }
  onEnteringState(args, isCurrentPlayerActive) {
    this.bga.statusBar.setTitle(
      isCurrentPlayerActive
        ? _("${you} must play a disc_xx")
        : _("${actplayer} must play a disc_xx"),
    );

    if (isCurrentPlayerActive) {
      this.updatePossibleMoves(args.possibleMoves);
    }
  }
  updatePossibleMoves(possibleMoves) {
    // Remove current possible moves
    document
      .querySelectorAll(".possibleMove")
      .forEach((div) => div.classList.remove("possibleMove"));

    for (let x in possibleMoves) {
      for (let y in possibleMoves[x]) {
        // x,y is a possible move
        document
          .getElementById(`square_${x}_${y}`)
          .classList.add("possibleMove");
      }
    }

    this.bga.gameui.addTooltipToClass(
      "possibleMove",
      "",
      _("Place a disc here_zz"),
    );
  }
}
