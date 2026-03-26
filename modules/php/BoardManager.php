<?php

declare(strict_types=1);

namespace Bga\Games\richardtutorialreversi;

class BoardManager
{
    public function __construct(private Game $game) {}

    public function initializeBoard(int $boardSize, int $blackPlayerId, int $whitePlayerId): void
    {
        $sqlValues = [];
        $boardSizeHalf = (int) floor($boardSize / 2);

        for ($x = 1; $x <= $boardSize; $x++) {
            for ($y = 1; $y <= $boardSize; $y++) {
                $discValue = 'NULL';
                if (($x === $boardSizeHalf && $y === $boardSizeHalf) || ($x === ($boardSizeHalf + 1) && $y === ($boardSizeHalf + 1))) {
                    $discValue = (string) $whitePlayerId;
                } elseif (($x === $boardSizeHalf && $y === ($boardSizeHalf + 1)) || ($x === ($boardSizeHalf + 1) && $y === $boardSizeHalf)) {
                    $discValue = (string) $blackPlayerId;
                }

                $sqlValues[] = "($x,$y,$discValue)";
            }
        }

        $sql = "INSERT INTO `board` (`board_x`,`board_y`,`board_player`) VALUES " . implode(',', $sqlValues);
        $this->game->DbQuery($sql);
    }

    public function getOccupiedDiscs(): array
    {
        return $this->game->getObjectListFromDB(
            "SELECT 
                `board_x`       `x`, 
                `board_y`       `y`, 
                `board_player`  `player`
             FROM 
                `board`
             WHERE 
                `board_player` IS NOT NULL"
        );
    }


    // Get the list of returned disc when "player" we play at this place ("x", "y"),
    //  or a void array if no disc is returned (invalid move)
    function getTurnedOverDiscs($x, $y, $player, $board)
    {
        $turnedOverDiscs = array();

        if ($board[$x][$y] === null) // If there is already a disc on this place, this can't be a valid move
        {
            // For each directions...
            $directions = array(
                array(-1, -1),
                array(-1, 0),
                array(-1, 1),
                array(0, -1),
                array(0, 1),
                array(1, -1),
                array(1, 0),
                array(1, 1)
            );

            foreach ($directions as list($d0, $d1)) {
                // foreach ($directions as $direction) {
                // Starting from the square we want to place a disc...
                $current_x = $x;
                $current_y = $y;
                $bContinue = true;
                $mayBeTurnedOver = array();

                while ($bContinue) {
                    // Go to the next square in this direction
                    $current_x += $d0;
                    $current_y += $d1;

                    if ($current_x < 1 || $current_x > 8 || $current_y < 1 || $current_y > 8)
                        $bContinue = false; // Out of the board => stop here for this direction
                    else if ($board[$current_x][$current_y] === null)
                        $bContinue = false; // An empty square => stop here for this direction
                    else if ($board[$current_x][$current_y] != $player) {
                        // There is a disc from our opponent on this square
                        // => add it to the list of the "may be turned over", and continue on this direction
                        $mayBeTurnedOver[] = array('x' => $current_x, 'y' => $current_y);
                    } else if ($board[$current_x][$current_y] == $player) {
                        // This is one of our disc

                        if (count($mayBeTurnedOver) == 0) {
                            // There is no disc to be turned over between our 2 discs => stop here for this direction
                            $bContinue = false;
                        } else {
                            // We found some disc to be turned over between our 2 discs
                            // => add them to the result and stop here for this direction
                            $turnedOverDiscs = array_merge($turnedOverDiscs, $mayBeTurnedOver);
                            $bContinue = false;
                        }
                    }
                }
            }
        }

        return $turnedOverDiscs;
    }

    // Get the complete board with a double associative array
    function getBoard()
    {
        return $this->game->getDoubleKeyCollectionFromDB("SELECT board_x x, board_y y, board_player player
                                                       FROM board", true);
    }

    // Get the list of possible moves (x => y => true)
    function getPossibleMoves($player_id)
    {
        $result = array();

        $board = self::getBoard();

        for ($x = 1; $x <= 8; $x++) {
            for ($y = 1; $y <= 8; $y++) {
                $returned = self::getTurnedOverDiscs($x, $y, $player_id, $board);
                if (count($returned) == 0) {
                    // No discs returned => not a possible move
                } else {
                    // Okay => set this coordinate to "true"
                    if (! isset($result[$x]))
                        $result[$x] = array();

                    $result[$x][$y] = true;
                }
            }
        }

        return $result;
    }
}
