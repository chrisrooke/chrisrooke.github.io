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
    const objects = document.querySelectorAll(".object");

    Object.entries(movementMap).forEach(([buttonId, { attr, delta }]) => {
      const button = document.querySelector(buttonId);
      if (!button) return;

      // Determine if *any* object can still move in this direction
      let canMove = false;

      objects.forEach(obj => {
        const pos = parseFloat(obj.getAttribute(attr)) || 0;
        if ((delta < 0 && pos > MIN) || (delta > 0 && pos < MAX)) {
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
      document.querySelectorAll(".object").forEach(obj => {
        const current = parseFloat(obj.getAttribute(attr)) || 0;
        let next = current + delta;

        // Clamp to range [MIN, MAX]
        next = Math.max(MIN, Math.min(MAX, next));
        obj.setAttribute(attr, next);
      });

      // Update button states after movement
      updateButtonStates();
    });
  });

  // Initialize button states on page load
  updateButtonStates();
});
