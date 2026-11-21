let selectedObject = null;
let raycaster, pointer;
let objectWorldPos = new THREE.Vector3();


/* https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain_raycast.html*/
function onPointerMove(event) {
    if (!gltf) return; // model not loaded yet

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObject(gltf.scene, true);

    if (intersects.length > 0) {
        console.log('Pointer is over the model', intersects[0].object.name);
        selectedObject = intersects[0].object;
    } else {
        console.log('Pointer is not over the model');
        // selectedObject = null;
    }
}
window.addEventListener('pointermove', onPointerMove, false)



async function zoomIn () {

    if (selectedObject.name == 'poster' || selectedObject.name == 'monitor') {
    selectedObject.getWorldPosition(objectWorldPos);

    gsap.to(camera.position, {
        x: objectWorldPos.x, y: objectWorldPos.y, z: objectWorldPos.z + 1,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
        }
    });

    nn.get('.popup').css('display', 'block')
    await nn.sleep(10)
    nn.get('.popup').css('opacity', 1)
    } else {
        nn.get('.popup').css('display', 'none');
    }
}

async function zoomOut() {

    const target = new THREE.Vector3(defaultTarget.x, defaultTarget.y, defaultTarget.z);

    gsap.to(camera.position, {
     x: defaultCameraPos.x, y: defaultCameraPos.y, z: defaultCameraPos.z,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(target)
      }
    })
    
    nn.get('.popup').css('display', 'block')
    await nn.sleep(10)
    nn.get('.popup').css('opacity', 0)
  }


function onPointerClick(event) {
    // switch (selectedObject) {
    //     case 'poster':
    //         break;
    // }
    zoomIn();
}
window.addEventListener('click', onPointerClick, false);

function onKeyPress(event) {
    if (event.key === 'Escape') {
        zoomOut();
    }
}
window.addEventListener('keydown', onKeyPress, false);