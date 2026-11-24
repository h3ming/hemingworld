let selectedObject = null; // for pointer hover
let raycaster, pointer;
let objectWorldPos = new THREE.Vector3();
let clickedObject = null; // for clicked object
//let lookTarget = new THREE.Vector3(); // angle the camera looks at after zooming in 
//const lookDummy = new THREE.PerspectiveCamera(); // used only to compute the end rotation
//let camTimeline = null;

let look = new THREE.Vector3()

const dict = {
    'poster': 'poster-popup',
    'monitor': 'monitor-popup'
}

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
        selectedObject = null;
    }
}
window.addEventListener('pointermove', onPointerMove, false)

function onPointerClick(event) {
    if (selectedObject) { // object can't be null
        if (selectedObject.name in dict) {
            clickedObject = selectedObject;
            clickedObject.getWorldPosition(objectWorldPos);
            console.log("poster at: ", objectWorldPos);
            let lookTarget = new THREE.Vector3(); //could've also used .copy
            switch (clickedObject.name) {
                case 'poster':
                    const postercam = new THREE.Vector3(objectWorldPos.x+0.5, objectWorldPos.y + 0.1, objectWorldPos.z + 1);
                    lookTarget.set(objectWorldPos.x + 0.55, objectWorldPos.y+0.1, objectWorldPos.z);
                    look.set(lookTarget.x, lookTarget.y, lookTarget.z); // need this for smooth lookAt rotation 
                    console.log("looking at: ", lookTarget);
                    zoomIn(postercam, lookTarget);
                    break;
            }
            // zoomIn();
            console.log('clicked object:', selectedObject.name);
        }
        return;
    }
}
window.addEventListener('click', onPointerClick, false);

// https://threejs.org/examples/webgl_math_orientation_transform


// zooms in where x, y, z are the camera position, then angles correctly 
function zoomIn(cameraPos, lookatPos) {
    // gsap.killTweensOf(camera.position);
    // gsap.killTweensOf(look);

    gsap.to(camera.position, {
        x: cameraPos.x, y: cameraPos.y, z: cameraPos.z,
        duration: 2, 
      // ease: 'power2.inOut',
        // onComplete: () => {
        //     camera.lookAt(lookatPos);
        // }
    });
        gsap.to(look, {
        x: lookatPos.x, y: lookatPos.y, z: lookatPos.z,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(look)
    });
    handlePopup(clickedObject.name);
}
    


// async function zoomIn () {

//     if (selectedObject.name == 'poster' || selectedObject.name == 'monitor') {
//     selectedObject.getWorldPosition(objectWorldPos);

//     gsap.to(camera.position, {
//         x: objectWorldPos.x, y: objectWorldPos.y, z: objectWorldPos.z + 1,
//         duration: 2,
//         ease: 'power2.inOut',
//         onUpdate: () => {
//         }
//     });

//     nn.get('.popup').css('display', 'block')
//     await nn.sleep(10)
//     nn.get('.popup').css('opacity', 1)
//     } else {
//         nn.get('.popup').css('display', 'none');
//     }
// }

// used claude to help with the math, wanted a function that would move the camera then angle it during the later half of the animation
function moveCamera(pos, lookAt, duration = 2, turnFraction = 0.5) {
    if (camTimeline) camTimeline.kill();

    const startQuat = camera.quaternion.clone();
    lookDummy.position.copy(pos);
    lookDummy.lookAt(lookAt);
    const endQuat = lookDummy.quaternion.clone();

    const turn = { t: 0 };
    const turnDuration = duration * turnFraction;
    camTimeline = gsap.timeline();

    // Position: full duration
    camTimeline.to(camera.position, {
        x: pos.x, y: pos.y, z: pos.z,
        duration,
        ease: 'power2.inOut'
    }, 0);

    // Rotation: last `turnFraction` of the move
    camTimeline.to(turn, {
        t: 1,
        duration: turnDuration,
        ease: 'power2.inOut',
        onUpdate: () => {
            camera.quaternion.copy(startQuat).slerp(endQuat, turn.t);
        }
    }, duration - turnDuration);

    return camTimeline;
}

// always zooms out to default position
async function zoomOut() {
    gsap.to(camera.position, {
     x: defaultCameraPos.x, y: defaultCameraPos.y, z: defaultCameraPos.z,
      duration: 2,
    //   ease: 'power2.inOut',
    //   onComplete: () => {
    //     camera.lookAt(defaultTarget.x, defaultTarget.y, defaultTarget.z);
    //   }
    });
    gsap.to(look, {
        x: defaultTarget.x, y: defaultTarget.y, z: defaultTarget.z,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(look)
    });
    // nn.get('.popup').css('display', 'none');
    // await nn.sleep(10);
    // nn.get('.popup').css('opacity', 0);

    nn.getAll('.popup').forEach(async popup => {
        popup.css('display', 'block');
        await nn.sleep(10);
        popup.css('opacity', 0);
    })

    nn.get('#backButton').css('display', 'none');
    await nn.sleep(10);
    nn.get('#backButton').css('opacity', 0);
    // alert('thie function ran');
  }

// function zoomIn(x, y, z) {
//     // Work out the final orientation using a throwaway camera
//     const end = camera.clone();
//     end.position.set(x, y, z + 1);
//     end.lookAt(lookTarget);
//     console.log("in zoom: ", lookTarget);

//     const start = camera.quaternion.clone();
//     const progress = { t: 0 };

//     gsap.timeline({ defaults: { duration: 2, ease: 'power2.inOut', overwrite: 'auto' } })
//         .to(camera.position, { x, y, z: z + 1 }, 0)
//         .to(progress, {
//             t: 1,
//             onUpdate: () => camera.quaternion.slerpQuaternions(start, end.quaternion, progress.t),
//         }, 0);
// }




function goBack(event) {
    if (event.key === 'Escape') {
        zoomOut();
    }
}
window.addEventListener('keydown', goBack, false);

async function handlePopup(objectName) {
    if (objectName in dict) {
        nn.get('#' + dict[objectName]).css('display', 'block');
        await nn.sleep(10);
        nn.get('#' + dict[objectName]).css('opacity', 1);
        console.log("popup handled: ", objectName);
    } else {
        console.log("popup not handled for ", objectName);
    }   
    nn.get('#backButton').css('display', 'block');
    await nn.sleep(10);
    nn.get('#backButton').css('opacity', 1);
}