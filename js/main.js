// ============ SETUP========================

function setup() {
    createScene();
    loadModel();

    console.log('Scene setup complete');
}

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

  window.addEventListener('load', setup)
  window.addEventListener('load', animate)