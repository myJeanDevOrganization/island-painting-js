let grid = {
  array: [],
  size: 25,
  container: document.getElementById("cont"),
  containerSize: Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8),
  setContainerSize: () => {
    grid.containerSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
    grid.container.style.width = grid.containerSize + "px";
    grid.container.style.height = grid.containerSize + "px";
  },
  create: () => {
    let calc = grid.containerSize / grid.size;
    for (let x = 0; x < grid.size; x++) {
      grid.array[x] = new Array();
      for (let y = 0; y < grid.size; y++) {
        let square = {
          body: document.createElement("DIV"),
          x: x,
          y: y,
          z: 0,
          color: () => {
            let height = square.z;
            let r, g, b;

            if (height <= 2) {
              let blend = (height + 1) / 4;
              r = Math.floor(blend * 20);
              g = Math.floor(100 + blend * 155);
              b = 255;
            } else if (height <= 5) {
              let blend = (height - 2) / 3;
              r = Math.floor(255 - blend * 50);
              g = Math.floor(200 + blend * 55);
              b = Math.floor(50 - blend * 50);
            } else if (height <= 8) {
              let blend = (height - 5) / 3;
              r = Math.floor(255 - blend * 55);
              g = Math.floor(200 - blend * 100);
              b = Math.floor(blend * 20);
            } else {
              let blend = (height - 8) / 2;
              r = Math.floor(200 - blend * 150);
              g = Math.floor(100 + blend * 155);
              b = Math.floor(20 + blend * 30);
            }

            square.body.style.background = `rgb(${r}, ${g}, ${b})`;
          },
        };
        grid.array[x][y] = square;
        square.body.classList.add("square");
        cont.appendChild(square.body);
        square.body.style.width = (calc + 1) + "px";
        square.body.style.height = (calc + 1) + "px";
        square.body.style.left = x * calc + "px";
        square.body.style.bottom = y * calc + "px";
        square.body.addEventListener("mouseover", () => {
          user.hoveredSquare.x = x;
          user.hoveredSquare.y = y;
          if (user.mouseDown == true) {
            grid.brush(x, y);
          }
        });
      }
    }
  },
  updateSquareSizes: () => {
    let calc = grid.containerSize / grid.size;
    for (let x = 0; x < grid.size; x++) {
      for (let y = 0; y < grid.size; y++) {
        grid.array[x][y].body.style.width = (calc + 1) + "px";  // Add 1px
        grid.array[x][y].body.style.height = (calc + 1) + "px"; // Add 1px
        grid.array[x][y].body.style.left = x * calc + "px";
        grid.array[x][y].body.style.bottom = y * calc + "px";
      }
    }
  },

  brush: (x, y) => {
    const minHeight = 1; // Deep ocean floor
    const maxHeight = 10;  // Mountain peaks

    if (user.down) {
      // Lower terrain - check minimum limit
      if (map.array[user.viewX + x][user.viewY + y].z > minHeight)
        map.array[user.viewX + x][user.viewY + y].z -= 1;
      if (map.array[user.viewX + x + 1][user.viewY + y + 1].z > minHeight)
        map.array[user.viewX + x + 1][user.viewY + y + 1].z -= 1;
      if (map.array[user.viewX + x + 1][user.viewY + y].z > minHeight)
        map.array[user.viewX + x + 1][user.viewY + y].z -= 1;
      if (map.array[user.viewX + x][user.viewY + y + 1].z > minHeight)
        map.array[user.viewX + x][user.viewY + y + 1].z -= 1;
      if (map.array[user.viewX + x - 1][user.viewY + y - 1].z > minHeight)
        map.array[user.viewX + x - 1][user.viewY + y - 1].z -= 1;
      if (map.array[user.viewX + x - 1][user.viewY + y].z > minHeight)
        map.array[user.viewX + x - 1][user.viewY + y].z -= 1;
      if (map.array[user.viewX + x][user.viewY + y - 1].z > minHeight)
        map.array[user.viewX + x][user.viewY + y - 1].z -= 1;
    } else {
      // Raise terrain - check maximum limit
      if (map.array[user.viewX + x][user.viewY + y].z < maxHeight)
        map.array[user.viewX + x][user.viewY + y].z += 1;
      if (map.array[user.viewX + x + 1][user.viewY + y + 1].z < maxHeight)
        map.array[user.viewX + x + 1][user.viewY + y + 1].z += 1;
      if (map.array[user.viewX + x + 1][user.viewY + y].z < maxHeight)
        map.array[user.viewX + x + 1][user.viewY + y].z += 1;
      if (map.array[user.viewX + x][user.viewY + y + 1].z < maxHeight)
        map.array[user.viewX + x][user.viewY + y + 1].z += 1;
      if (map.array[user.viewX + x - 1][user.viewY + y - 1].z < maxHeight)
        map.array[user.viewX + x - 1][user.viewY + y - 1].z += 1;
      if (map.array[user.viewX + x - 1][user.viewY + y].z < maxHeight)
        map.array[user.viewX + x - 1][user.viewY + y].z += 1;
      if (map.array[user.viewX + x][user.viewY + y - 1].z < maxHeight)
        map.array[user.viewX + x][user.viewY + y - 1].z += 1;
    }
    grid.updateBlock(x, y);
    grid.updateBlock(x + 1, y + 1);
    grid.updateBlock(x - 1, y - 1);
    grid.updateBlock(x + 1, y);
    grid.updateBlock(x - 1, y);
    grid.updateBlock(x, y + 1);
    grid.updateBlock(x, y - 1);
  },
  updateAll: () => {
    for (let x = 0; x < grid.size; x++) {
      for (let y = 0; y < grid.size; y++) {
        grid.updateBlock(x, y);
      }
    }
  },
  updateBlock: (x, y) => {
    grid.array[x][y].z = map.array[user.viewX + x][user.viewY + y].z;
    grid.array[x][y].color();
    grid.array[x][y].body.style.transform =
      "translate3D(0,0," + grid.array[x][y].z + "px)";
    if (map.array[user.viewX + x][user.viewY + y].actor != null) {
      grid.updateActor(true, x, y);
    } else {
      grid.updateActor(false, x, y);
    }
    if (grid.array[x][y].z <= 3) {
      // Only add wave class if it doesn't already have it
      if (!grid.array[x][y].body.classList.contains("wave")) {
        setTimeout(() => {
          grid.array[x][y].body.classList.add("wave");
          let randomDelay = Math.random() * 4;
          grid.array[x][y].body.style.animationDelay = randomDelay + "s";
        }, Math.floor(Math.random() * 100));
      }
    } else {
      grid.array[x][y].body.classList.remove("wave");
      grid.array[x][y].body.style.animationDelay = ""; // Clear the delay
    }
  },
  updateActor: (show, x, y) => {
    if (show == true) {
      let currentActor = map.array[user.viewX + x][user.viewY + y].actor;
      let currentChild = grid.array[x][y].body.firstChild;

      // Only update if the actor has changed
      if (currentChild !== currentActor.body) {
        while (grid.array[x][y].body.firstChild) {
          grid.array[x][y].body.removeChild(grid.array[x][y].body.firstChild);
        }
        grid.array[x][y].body.appendChild(currentActor.body);
      }
    } else {
      while (grid.array[x][y].body.firstChild) {
        grid.array[x][y].body.removeChild(grid.array[x][y].body.firstChild);
      }
    }
  },
};

let map = {
  array: [],
  maxHeight: 20,
  size: 200,
  create: () => {
    for (let x = 0; x < map.size; x++) {
      map.array[x] = new Array();
      for (let y = 0; y < map.size; y++) {
        let tile = {
          x: x,
          y: y,
          z: 2,
          actor: null,
        };
        map.array[x][y] = tile;
      }
    }
  },
  placeGrass: () => {
    for (let x = 0; x < map.size; x++) {
      for (let y = 0; y < map.size; y++) {
        if (map.array[x][y].z < 2 && map.array[x][y].z > 1) {
          console.log("made Grass");
          actors.createActor("grass", x, y);
        }
      }
    }
  },
  makeMountains: () => {
    // let randomX = Math.floor(Math.random() * map.size - 10);
    // let randomY = Math.floor(Math.random() * map.size - 10);
    let x = map.size / 2;
    let y = map.size / 2;
    let peak = map.maxHeight;
    map.array[x][y].z = peak;
    for (let ring = 0; ring <= 1; ring++) {
      map.array[x + 1][y + 1].z = 50;
      map.array[x + 1][y - 1].z = 50;
      map.array[x + 1][y + 0].z = 50;
    }
  },
  makeEdges: () => {
    for (let x = 0; x < map.size; x++) {
      for (let y = 0; y < map.size; y++) {
        for (let count = 5; count > 0; count--) {
          map.array[x][count].z = 0;
          map.array[count][y].z = 0;
          map.array[x][map.size - count].z = 0;
          map.array[map.size - count][y].z = 0;
        }
      }
    }
  },
};

let user = {
  viewX: map.size / 2,
  viewY: map.size / 2,
  mouseDown: false,
  down: false,
  brushSize: 1,
  hoveredSquare: { x: -1, y: -1 },
  checkKey: (e) => {
    e = e || window.event;
    if (e.keyCode == "38" || e.keyCode == "87") {
      if (
        user.viewY + grid.size < map.size ||
        user.viewX + grid.size < map.size
      ) {
        // up arrow
        user.viewX++;
        user.viewY++;
      } else {
      }
    } else if (e.keyCode == "40" || e.keyCode == "83") {
      if (user.viewY > 0 || user.viewX > 0) {
        // down arrow
        user.viewX--;
        user.viewY--;
      }
    } else if (e.keyCode == "37" || e.keyCode == "65") {
      if (user.viewX > 0) {
        // left arrow
        user.viewX--;
        user.viewY++;
      }
    } else if (e.keyCode == "39" || e.keyCode == "68") {
      if (user.viewY + grid.size > 0 || user.viewX + grid.size < map.size) {
        // right arrow
        user.viewX++;
        user.viewY--;
      }
    } else if (e.keyCode == "32") {
      user.down = !user.down;
    } else if (e.keyCode == "72") { // "h" key
      villagers.spawnAtMouse();
    }
    grid.updateAll();
  },
  addCheckKeyEvent: () => {
    document.onkeydown = user.checkKey;
  },
};

let villagers = {
  list: [],

  createVillager: (x, y) => {
    let villager = {
      body: null,
      x: x,
      y: y,
      z: 0,
      type: "villager",
    };
    villager.body = document.createElement("DIV");
    villager.body.classList.add("object");
    villager.body.classList.add("villager");

    let hue = Math.floor(Math.random() * 360);
    villager.body.style.filter = `sepia(1) hue-rotate(${hue}deg) saturate(6) brightness(1.2) drop-shadow(1px 0px 0px black) drop-shadow(-1px 0px 0px black) drop-shadow(0px 1px 0px black) drop-shadow(0px -1px 0px black)`;
    map.array[x][y].actor = villager;
    villagers.list.push(villager);
    return villager;
  },

  canMoveTo: (x, y) => {
    if (x < 0 || y < 0 || x >= map.size || y >= map.size) {
      return false;
    }
    if (map.array[x][y].actor != null && map.array[x][y].actor.type === "villager") {
      return false;
    }
    return true;
  },

  killVillager: (villager) => {
    let index = villagers.list.indexOf(villager);
    if (index > -1) {
      villagers.list.splice(index, 1);
    }

    let villagerColor = villager.body.style.filter;

    villager.body.classList.remove("villager");
    villager.body.classList.add("skull");
    villager.type = "skull";

    villager.body.style.filter = villagerColor;

    map.array[villager.x][villager.y].z += 1;

    console.log("Villager died in water! Land rises from their sacrifice.");
  },

  getValidMoves: (villager) => {
    let validMoves = [];
    let directions = [
      { x: 0, y: 1 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: 1, y: -1 },
      { x: -1, y: -1 }
    ];

    for (let dir of directions) {
      let newX = villager.x + dir.x;
      let newY = villager.y + dir.y;
      if (villagers.canMoveTo(newX, newY)) {
        validMoves.push({ x: newX, y: newY });
      }
    }
    return validMoves;
  },

  moveVillager: (villager, newX, newY) => {
    if (!villagers.canMoveTo(newX, newY)) {
      return false;
    }

    map.array[villager.x][villager.y].actor = null;
    villager.x = newX;
    villager.y = newY;
    map.array[newX][newY].actor = villager;

    if (map.array[newX][newY].z < 10) {
      map.array[newX][newY].z += 1;
    }

    if (map.array[newX][newY].z <= 3) {
      villagers.killVillager(villager);
      grid.updateAll();
      return true;
    }

    grid.updateAll();

    villager.body.classList.add('hopping');
    villager.body.addEventListener('animationend', () => {
      villager.body.classList.remove('hopping');
    }, { once: true });

    return true;
  },

  moveRandomly: (villager) => {
    let validMoves = villagers.getValidMoves(villager);
    if (validMoves.length > 0) {
      let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      villagers.moveVillager(villager, randomMove.x, randomMove.y);
    }
  },

  startAutoMovement: (villager, interval = 2000) => {
    setInterval(() => {
      if (villagers.list.includes(villager)) {
        villagers.moveRandomly(villager);
      }
    }, interval);
  },

  spawnAtMouse: () => {
    let mouseX = user.hoveredSquare.x;
    let mouseY = user.hoveredSquare.y;

    if (mouseX < 0 || mouseY < 0) {
      console.log("No square selected");
      return;
    }

    let worldX = user.viewX + mouseX;
    let worldY = user.viewY + mouseY;

    if (map.array[worldX][worldY].z <= 3) {
      console.log("Cannot spawn villager in water");
      return;
    }
    if (!villagers.canMoveTo(worldX, worldY)) {
      console.log("Cannot spawn villager here");
      return;
    }

    let newVillager = villagers.createVillager(worldX, worldY);
    setTimeout(() => {
      villagers.startAutoMovement(newVillager, 3000);
    }, Math.random() * 3000);
    console.log("Villager spawned!");
    grid.updateAll();
  },
};

function initilize() {
  grid.setContainerSize();
  grid.create();
  map.create();
  user.addCheckKeyEvent();
  map.makeEdges();
  map.placeGrass();
  grid.updateAll();
}
initilize();

function oceanWaves(up) {
  for (let x = 0; x < grid.size; x++) {
    setTimeout(() => {
      for (let y = 0; y < grid.size; y++) {
        setTimeout(() => {
          grid.array[x][y].body.style.transform =
            "translate3D(0,0," + up + "px)";
          grid.array[x][y].z = up;
        }, y * 100);
      }
    }, x * 100);
  }
  setTimeout(() => {
    oceanWaves(up * -1);
  }, 2000);
}

document.body.onmousedown = function () {
  user.mouseDown = true;
};
document.body.onmouseup = function () {
  user.mouseDown = false;
};

window.addEventListener('resize', () => {
  grid.setContainerSize();
  grid.updateSquareSizes();
});

document.addEventListener('keydown', (e) => {
  let keyElement = null;

  switch (e.keyCode) {
    case 38: case 87: // Up or W
      keyElement = document.getElementById('key-up');
      break;
    case 40: case 83: // Down or S
      keyElement = document.getElementById('key-down');
      break;
    case 37: case 65: // Left or A
      keyElement = document.getElementById('key-left');
      break;
    case 39: case 68: // Right or D
      keyElement = document.getElementById('key-right');
      break;
    case 32: // Space - handle toggle states
      keyElement = document.getElementById('key-space');
      // Toggle the visual state based on user.down after the toggle happens
      setTimeout(() => {
        if (user.down) {
          keyElement.classList.remove('raised');
          keyElement.classList.add('sunken');
        } else {
          keyElement.classList.remove('sunken');
          keyElement.classList.add('raised');
        }
      }, 10); // Small delay to let user.down update first
      return; // Don't add 'pressed' class for space
    case 72: // H
      keyElement = document.getElementById('key-h');
      break;
  }

  if (keyElement) {
    keyElement.classList.add('pressed');
  }
});

document.addEventListener('keyup', (e) => {
  let keyElement = null;

  switch (e.keyCode) {
    case 38: case 87:
      keyElement = document.getElementById('key-up');
      break;
    case 40: case 83:
      keyElement = document.getElementById('key-down');
      break;
    case 37: case 65:
      keyElement = document.getElementById('key-left');
      break;
    case 39: case 68:
      keyElement = document.getElementById('key-right');
      break;
    case 32:
      // Space bar doesn't use normal pressed behavior
      return;
    case 72:
      keyElement = document.getElementById('key-h');
      break;
  }

  if (keyElement) {
    keyElement.classList.remove('pressed');
  }
});

document.getElementById('key-space').classList.add('raised');