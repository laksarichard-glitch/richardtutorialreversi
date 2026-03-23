export function logStart(method) {
  console.log(`start : ${method}`);
}

export function logEnd(method) {
  console.log(`end   : ${method}`);
}
/*
  Return the top left co-ordinates of the player area as  
  */
export function getCoordinates(
  numPlayers,
  tableWidth,
  tableHeight,
  playerTableWidth,
  playerTableHeight,
) {
  const radiansIncrement = (2 * Math.PI) / numPlayers;

  const coordinates = [];

  let minX = 10;
  let minY = 10;
  let maxX = -10;
  let maxY = -10;
  let rangeX = 0;
  let rangeY = 0;

  for (let index = 0; index < numPlayers; index++) {
    let radians = radiansIncrement * index;
    let x = Math.sin(radians);
    let y = -1 * Math.cos(radians);
    console.log(" index = ", index, " x = ", x, " y = ", y);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  rangeX = maxX - minX;
  rangeY = maxY - minY;

  console.log(" minX = ", minX, " minY = ", minY);
  console.log(" maxX = ", maxX, " maxY = ", maxY);
  console.log(" rangeX = ", rangeX, " rangeY = ", rangeY);

  // now co-ords of centre of card (Coc) and then co-cords of top left corner of card
  for (let index = 0; index < numPlayers; index++) {
    let radians = radiansIncrement * index;
    let x = Math.sin(radians);
    let y = -1 * Math.cos(radians);

    let xCoc = Math.trunc(
      ((x - minX) * (tableWidth - playerTableWidth)) / rangeX +
        playerTableWidth / 2,
    );
    let yCoc = Math.trunc(
      ((y - minY) * (tableHeight - playerTableHeight)) / rangeY +
        playerTableHeight / 2,
    );

    let left = xCoc - playerTableWidth / 2;
    let top = yCoc - playerTableHeight / 2;

    console.log(" index = ", index, " left   = ", left, " top = ", top);

    coordinates.push({ x: left, y: top });
  }

  return coordinates;
}
