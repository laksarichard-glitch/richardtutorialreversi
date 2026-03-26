<?php

declare(strict_types=1);

namespace Bga\Games\richardtutorialreversi\States;

use Bga\GameFramework\StateType;
use Bga\Games\richardtutorialreversi\Game;

class NextPlayer extends \Bga\GameFramework\States\GameState
{

    public function __construct(protected Game $game)
    {
        parent::__construct(
            $game,
            id: 90,
            type: StateType::GAME,

            updateGameProgression: true,
        );
    }
}
