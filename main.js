// ---------------- SCENE SETUP ----------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(6, 6, 6);
camera.lookAt(0, 0, 0);

// ---------------- LIGHT ----------------
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.set(5, 10, 7);
scene.add(light);

// ---------------- CUBE CREATION ----------------
const cubes = [];
const cubeSize = 0.98;

const colors = {
  right: 0xff0000,
  left: 0xff8000,
  top: 0xffffff,
  bottom: 0xffff00,
  front: 0x00ff00,
  back: 0x0000ff
};

function createCubie(x, y, z) {
  const materials = [
    new THREE.MeshStandardMaterial({ color: colors.right }),
    new THREE.MeshStandardMaterial({ color: colors.left }),
    new THREE.MeshStandardMaterial({ color: colors.top }),
    new THREE.MeshStandardMaterial({ color: colors.bottom }),
    new THREE.MeshStandardMaterial({ color: colors.front }),
    new THREE.MeshStandardMaterial({ color: colors.back }),
  ];

  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cube = new THREE.Mesh(geometry, materials);
  cube.position.set(x, y, z);
  scene.add(cube);
  cubes.push(cube);
}

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      createCubie(x, y, z);
    }
  }
}

// ---------------- ROTATION LOGIC ----------------
function rotateLayer(axis, layer, direction) {
  const group = new THREE.Group();
  cubes.forEach(c => {
    if (Math.round(c.position[axis]) === layer) {
      group.add(c);
    }
  });

  scene.add(group);

  const angle = direction * Math.PI / 2;
  group.rotateOnAxis(
    axis === 'x' ? new THREE.Vector3(1, 0, 0) :
    axis === 'y' ? new THREE.Vector3(0, 1, 0) :
                   new THREE.Vector3(0, 0, 1),
    angle
  );

  group.children.forEach(c => {
    c.position.applyAxisAngle(
      axis === 'x' ? new THREE.Vector3(1, 0, 0) :
      axis === 'y' ? new THREE.Vector3(0, 1, 0) :
                     new THREE.Vector3(0, 0, 1),
      angle
    );
    scene.add(c);
  });

  scene.remove(group);
}

// ---------------- CONTROLS ----------------
window.addEventListener("keydown", e => {
  switch (e.key.toLowerCase()) {
    case 'u': rotateLayer('y', 1, 1); break;
    case 'd': rotateLayer('y', -1, -1); break;
    case 'l': rotateLayer('x', -1, 1); break;
    case 'r': rotateLayer('x', 1, -1); break;
    case 'f': rotateLayer('z', 1, -1); break;
    case 'b': rotateLayer('z', -1, 1); break;
  }
});

// ---------------- RENDER LOOP ----------------
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// ---------------- RESIZE ----------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
