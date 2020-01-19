const app = document.querySelector('#app')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
app.appendChild( renderer.domElement );


var starsGeometry = new THREE.Geometry();
for ( var i = 0; i < 10000; i ++ ) {
    var star = new THREE.Vector3();
    star.x = THREE.Math.randFloatSpread( 2000 );
    star.y = THREE.Math.randFloatSpread( 2000 );
    star.z = THREE.Math.randFloatSpread( 5000 );
    starsGeometry.vertices.push( star );
}

var starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
var starField = new THREE.Points( starsGeometry, starsMaterial );


starField.name = 'teset'
scene.add( starField );

let oldTime = Date.now();


const traveDistance = 0.001;

const updateStars = (deltaTime) => {
    starsGeometry.vertices.forEach((el) => {
        if ( el.x > 400) {
            el.x = Math.random() * -400;
        } else {
            el.x = el.x + traveDistance * deltaTime;
        }
        if ( el.y > 400) {
            el.y = Math.random() *  -400;
        } else {
            el.y = el.y + traveDistance * deltaTime;
        }
    })
    starsGeometry.verticesNeedUpdate = true;
}

const animate = function () {
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;
    updateStars(deltaTime);
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};
animate();