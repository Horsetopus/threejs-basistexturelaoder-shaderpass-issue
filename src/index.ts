
import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    sRGBEncoding,
    WebGLRenderer
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { BasisTextureLoader } from "three/examples/jsm/loaders/BasisTextureLoader";


const canvas:HTMLCanvasElement = document.createElement( "canvas" );
canvas.style.width = "100%";
canvas.style.height = "100%";
document.body.appendChild( canvas );

const context:WebGL2RenderingContext = canvas.getContext( "webgl2" );

const renderer:WebGLRenderer = new WebGLRenderer( { canvas: canvas, context: context } );
renderer.setClearColor( "lightgrey" );
renderer.outputEncoding = sRGBEncoding;

const composer:EffectComposer = new EffectComposer( renderer );

const scene:Scene = new Scene();

const camera:PerspectiveCamera = new PerspectiveCamera( 45, 1, 1, 1000 );
camera.position.setZ( 260 );
scene.add( camera );

composer.addPass( new RenderPass( scene, camera) );

const basisTextureLoader:BasisTextureLoader = new BasisTextureLoader();
basisTextureLoader.setTranscoderPath("/lib/");
basisTextureLoader.detectSupport(renderer);



const cube:Mesh = new Mesh(
    new BoxGeometry(100, 100, 100),
    new MeshBasicMaterial({color: "green"})
);
scene.add( cube );

basisTextureLoader.load("/assets/test.basis", (texture) => {

    let shaderPass = new ShaderPass( {

        vertexShader:   `   varying vec2 vUv;
                            
                            void main() {
                                
                                vUv = uv;
                                vec4 modelViewPosition = modelViewMatrix * vec4( position, 1.0 );
                                gl_Position = projectionMatrix * modelViewPosition;
                            }`,
        fragmentShader: `   varying vec2 vUv;                            
                            uniform sampler2D tDiffuse;
                            uniform sampler2D tTexture;
                            
                            void main() {
                                gl_FragColor = texture2D( tTexture, vUv );
                            }`,
        uniforms: {
            'tDiffuse': { value: null },
            'tTexture': { value: texture }
        }
    } );

    shaderPass.uniforms[ "tTexture" ].value = texture;

    composer.addPass( shaderPass );
} );

function render():void {

    if ( !cube ) return;

    cube.rotateX(0.01);
    cube.rotateY(0.03);
    composer.render();

    requestAnimationFrame( () => render() );
}
render();

function resize():void {

    let bounds:DOMRect = document.body.getBoundingClientRect();
    let width:number = bounds.width;
    let height:number = bounds.height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height, false );
    composer.setSize( width, height );
}
resize();
