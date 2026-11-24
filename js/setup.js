let renderer, scene, camera, gltf;
let width = window.innerWidth;
let height = window.innerHeight;
const defaultCameraPos = new THREE.Vector3(0, 1, 2) //{ x: 0, y: 1, z: 2 }; 
const defaultTarget = new THREE.Vector3(0, 0.5, 0) // { x: 0, y: 0.5, z: 0 };
// const frustumSize = 100;
// const aspect = window.innerWidth / window.innerHeight;

/* https://three-assets.sgp1.cdn.digitaloceanspaces.com/assets/images/blender_to_threejs_cheatsheet.png */

/* https://stackoverflow.com/questions/64409605/how-do-i-load-gltfloader-from-a-cdn-three-js */
async function loadModel() {
    const loader = new THREE.GLTFLoader();
    try {
        gltf = await loader.loadAsync('scene/roomsketch.gltf');
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.position.set(-0.3, -1, 0);
        gltf.scene.rotation.y = -(Math.PI / 2); 
        scene.add(gltf.scene);
        console.log("model loaded");
    } catch (error) {
        console.log('Error loading GLTF model');
    }
}

function createScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);
    camera.lookAt(defaultTarget.x, defaultTarget.y, defaultTarget.z);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    document.body.style.margin = 0;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 6);
    scene.add(dir);
}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.addEventListener('resize', onWindowResize, false);