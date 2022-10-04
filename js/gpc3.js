import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {BrazoRobotico} from "./brazo_robotico.js";

// Variables estandar
let renderer, scene, camera, cameraOrtho, cameraControls, cameraHelper;
const L =90;

// Otras globales
let robot, insetWidth, insetHeight;
let angulo = 0;

// Acciones
init();
loadScene();
render();

function setCameras(ar){
    let camaraOrtografica;
    if(ar>1)
        
        camaraOrtografica = new THREE.OrthographicCamera(-L*ar, L*ar, L,-L,1,1000);
    else
        camaraOrtografica = new THREE.OrthographicCamera(-L, L, L/ar,-L/ar,1,1000);
    //perspective camera
    camera = new THREE.PerspectiveCamera( 70, ar, 0.01, 1000);
    camera.position.y = 340;
    camera.position.z = 200;

    //cameraOrtho
    cameraOrtho = camaraOrtografica.clone();
    cameraOrtho.position.set(L,0,0);
    //cameraOrtho.lookAt(0,50,0);

    //ayudante de camara
    cameraHelper = new THREE.CameraHelper(camera);

    camera.add(cameraOrtho);
}

function init()
{
    //Inicializacion de camaras
    const ar = window.innerWidth / window.innerHeight;
    setCameras(ar);

    //Inicializacion de la escena
    scene = new THREE.Scene();
    scene.add(camera);
    //scene.add(cameraOrtho)
    
    //Inicializacion del motor de render
    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );
    //renderer.setClearColor(0x7c7b82);
    //renderer.autoClear = false;

    //Inicializacion del control de camara
    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.minDistance = 300;
    cameraControls.maxDistance = 900;
    cameraControls.target.set(0,1,0);

    //Inicializacion de eventos
    window.addEventListener('resize',onWindowResize);
}

function onWindowResize(){
    //actualizamos la matriz de proyeccion de la camara
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    //actualizamos las dimesiones del render
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    const minDim = Math.min( window.innerWidth, window.innerHeight );
    insetWidth = minDim / 4;
    insetHeight = minDim / 4;
    
    //actualizamos la matriz de proyeccion de la camaraOrtografica
    cameraOrtho.aspect = insetWidth / insetHeight;
    cameraOrtho.updateProjectionMatrix();
}

function loadScene()
{
    const sueloMaterial = new THREE.MeshNormalMaterial({wireframe:false, flatShading: true});
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(1000,1000, 20,20), sueloMaterial );
    suelo.rotation.x = -Math.PI/2;
    suelo.position.y = -0.2;
    suelo.position.z= 0;
    scene.add(suelo);
    robot =  new BrazoRobotico(false)
    scene.add( robot.model());
}

function render()
{
    requestAnimationFrame(render);
    //renderer.clear();

    renderer.setClearColor(0x7c7b82);
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
    renderer.render(scene,camera);

    renderer.setClearColor(0x7c79c9);
    renderer.clearDepth();

    //let dim = Math.min(window.innerWidth, window.innerHeight)/4;
    renderer.setScissorTest( true );
    renderer.setScissor( 0, window.innerHeight - insetHeight, insetWidth, insetHeight );

    renderer.setViewport( 0, window.innerHeight - insetHeight, insetWidth, insetHeight );
    renderer.render( scene, cameraOrtho );

    renderer.setScissorTest( false );
}