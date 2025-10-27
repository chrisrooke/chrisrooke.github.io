const sceneX = document.getElementById('scene-x');
sceneX.oninput = function() {
    document.getElementById('body').style.setProperty('--scene-x-unit', this.value);
    document.getElementById('scene-x-value').innerHTML = this.value + 'deg';
}

const sceneY = document.getElementById('scene-y');
sceneY.oninput = function() {
    document.getElementById('body').style.setProperty('--scene-y-unit', this.value);
    document.getElementById('scene-y-value').innerHTML = this.value + 'deg';
}

const lightX = document.getElementById('light-x');
lightX.oninput = function() {
    document.getElementById('body').style.setProperty('--light-x-unit', this.value);
    document.getElementById('light-x-value').innerHTML = this.value + 'deg';
}

const lightY = document.getElementById('light-y');
lightY.oninput = function() {
    document.getElementById('body').style.setProperty('--light-y-unit', this.value);
    document.getElementById('light-y-value').innerHTML = this.value + 'deg';
}

const objects = document.getElementsByClassName('object');

const objectX = document.getElementById('object-x');
objectX.oninput = function() {
    for (let obj of objects) {
        obj.style.setProperty('--object-x-unit', this.value);
    }
    document.getElementById('object-x-value').innerHTML = this.value + 'deg';
}

const objectY = document.getElementById('object-y');
objectY.oninput = function() {
    for (let obj of objects) {
        obj.style.setProperty('--object-y-unit', this.value);
    }
    document.getElementById('object-y-value').innerHTML = this.value + 'deg';
}

const objectZ = document.getElementById('object-z');
objectZ.oninput = function() {
    for (let obj of objects) {
        obj.style.setProperty('--object-z-unit', this.value);
    }
    document.getElementById('object-z-value').innerHTML = this.value + 'deg';
}

// const elevation = document.getElementById('elevation');
// elevation.oninput = function() {
//     for (let obj of objects) {
//         obj.style.setProperty('--elevation-manual', this.value + 'px');
//     }
//     document.getElementById('elevation-value').innerHTML = this.value + 'px';
// }

// Get all instances of an object across all layers by object ID
function getObjectInstances(objectId) {
  return document.querySelectorAll(`.object[data-object-id="${objectId}"]`);
}

// Get unique objects (one per object ID, checking only object-layer)
function getUniqueObjects() {
  return document.querySelectorAll('#object-layer .object');
}

// Check if a position is occupied by another object
function isPositionOccupied(x, y, z, excludeObjectId = null) {
  const uniqueObjects = getUniqueObjects();
  
  for (let obj of uniqueObjects) {
    const objectId = obj.getAttribute('data-object-id');
    if (objectId === excludeObjectId) continue;
    
    const objX = parseFloat(obj.getAttribute('data-x-pos')) || 0;
    const objY = parseFloat(obj.getAttribute('data-y-pos')) || 0;
    const objZ = parseFloat(obj.getAttribute('data-z-pos')) || 0;
    
    if (objX === x && objY === y && objZ === z) {
      return true;
    }
  }
  
  return false;
}

// Update all instances of an object across all layers
function updateObjectPosition(objectId, attr, value) {
  const instances = getObjectInstances(objectId);
  instances.forEach(instance => {
    instance.setAttribute(attr, value);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const movementMap = {
    "#x-left":    { attr: "data-x-pos", delta: -1 },
    "#x-right":   { attr: "data-x-pos", delta: 1 },
    "#z-back":    { attr: "data-z-pos", delta: -1 },
    "#z-forward": { attr: "data-z-pos", delta: 1 },
    "#y-up":      { attr: "data-y-pos", delta: 1 },
    "#y-down":    { attr: "data-y-pos", delta: -1 },
  };

  const MIN = 0;
  const MAX = 4;

  // Function to update button disabled states based on object positions
  function updateButtonStates() {
    const activeObjects = document.querySelectorAll("#object-layer .active");

    Object.entries(movementMap).forEach(([buttonId, { attr, delta }]) => {
      const button = document.querySelector(buttonId);
      if (!button) return;

      // Determine if *any* active object can still move in this direction
      let canMove = false;

      activeObjects.forEach(obj => {
        const objectId = obj.getAttribute('data-object-id');
        const xPos = parseFloat(obj.getAttribute('data-x-pos')) || 0;
        const yPos = parseFloat(obj.getAttribute('data-y-pos')) || 0;
        const zPos = parseFloat(obj.getAttribute('data-z-pos')) || 0;
        const currentPos = parseFloat(obj.getAttribute(attr)) || 0;
        const nextPos = currentPos + delta;

        // Check bounds
        if (nextPos < MIN || nextPos > MAX) {
          return; // This object can't move
        }

        // Calculate what the new position would be
        let newX = xPos, newY = yPos, newZ = zPos;
        if (attr === 'data-x-pos') newX = nextPos;
        if (attr === 'data-y-pos') newY = nextPos;
        if (attr === 'data-z-pos') newZ = nextPos;

        // Check if the new position would collide
        if (!isPositionOccupied(newX, newY, newZ, objectId)) {
          canMove = true;
        }
      });

      button.disabled = !canMove;
    });
  }

  // Attach listeners for movement
  Object.entries(movementMap).forEach(([buttonId, { attr, delta }]) => {
    const button = document.querySelector(buttonId);
    if (!button) return;

    button.addEventListener("click", () => {
      document.querySelectorAll("#object-layer .active").forEach(obj => {
        const objectId = obj.getAttribute('data-object-id');
        const current = parseFloat(obj.getAttribute(attr)) || 0;
        let next = current + delta;

        // Clamp to range [MIN, MAX]
        next = Math.max(MIN, Math.min(MAX, next));

        // Calculate what the full new position would be
        const xPos = parseFloat(obj.getAttribute('data-x-pos')) || 0;
        const yPos = parseFloat(obj.getAttribute('data-y-pos')) || 0;
        const zPos = parseFloat(obj.getAttribute('data-z-pos')) || 0;
        
        let newX = xPos, newY = yPos, newZ = zPos;
        if (attr === 'data-x-pos') newX = next;
        if (attr === 'data-y-pos') newY = next;
        if (attr === 'data-z-pos') newZ = next;

        // Only move if the position is not occupied
        if (!isPositionOccupied(newX, newY, newZ, objectId)) {
          updateObjectPosition(objectId, attr, next);
        }
      });

      // Update button states after movement
      updateButtonStates();
    });
  });

  // Initialize button states on page load
  updateButtonStates();
});