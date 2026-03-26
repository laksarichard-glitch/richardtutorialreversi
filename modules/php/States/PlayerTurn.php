<?php

declare(strict_types=1);

namespace Bga\Games\richardtutorialreversi\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\Games\richardtutorialreversi\Game;

class PlayerTurn extends GameState
{
    public function __construct(protected Game $game)
    {
        parent::__construct(
            $game,
            id: 10,
            type: StateType::ACTIVE_PLAYER,

        );
    }

    function zombie(int $playerId) {}
    function getArgs(int $activePlayerId): array
    {
        return [
            'possibleMoves' => $this->game->boardManager->getPossibleMoves($activePlayerId)
        ];
    }
}
