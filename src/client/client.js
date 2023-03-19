import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';

import { GUI } from 'dat.gui';
import { recordDef } from './record.js';

let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
const params = {
    exportToObj: exportToObj
};

let stamenCount = 12;

let cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
cubeRenderTarget.texture.type = THREE.HalfFloatType;

let cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);


let controls = new OrbitControls(camera, renderer.domElement);

function init() {

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    renderer.setAnimationLoop(animation);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.getElementById("remote").appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResized);

    camera.position.z = 75;

    scene.rotation.y = 0.5; // avoid flying objects occluding the sun

    new RGBELoader()
        .setPath('asset/texture/')
        .load('quarry_01_1k.hdr', function (texture) {

            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.background = texture;
            scene.environment = texture;

        });

    /* GUI */
    const gui = new GUI();
    gui.add(params, 'exportToObj').name('Export OBJ');
    controls.autoRotate = false;

    /* FLOWER */

    /* 1. PETAL */
    const shape = new THREE.Shape();

    const curve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0, 0.5),
        new THREE.Vector2(-1, 1),
        new THREE.Vector2(-1, 2)
    );

    const curve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(-1, 2),
        new THREE.Vector2(-1, 3),
        new THREE.Vector2(-0.5, 4),
        new THREE.Vector2(0, 4)
    );

    const curve3 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 4),
        new THREE.Vector2(0.5, 4),
        new THREE.Vector2(1, 3),
        new THREE.Vector2(1, 2)
    );

    const curve4 = new THREE.CubicBezierCurve(
        new THREE.Vector2(1, 2),
        new THREE.Vector2(1, 1),
        new THREE.Vector2(0, 0.5),
        new THREE.Vector2(0, 0)
    );

    shape.curves.push(curve1, curve2, curve3, curve4);


    // 创建一个3D mesh
    var geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.3, // 花瓣厚度
        // bevelEnabled: false, //倒角
        // bevelThickness: 2, //倒角厚度值（默认6）
        // bevelSize:2, //距离形状轮廓多远的斜面距离（默认为 2）
        // bevelSegments:3, //斜角步数（默认3）
        // steps: 20,
        bevelEnabled: false,
        // extrudePath: path,
        // taper: function (u) {
        //     return 1 - Math.sin(u * Math.PI) * 0.5; // Taper the extrusion along the curve
        // },
    });

    // 创建纹理
    var petalTexture = new THREE.TextureLoader().load('./asset/texture/fabric/Fabric_BaseColor.png');
    var petalRoughness = new THREE.TextureLoader().load('./asset/texture/fabric/Fabric_Roughness.png');
    var petalNormal = new THREE.TextureLoader().load('./asset/texture/fabric/Fabric_Normal.png');
    petalTexture.wrapS = THREE.RepeatWrapping;
    petalTexture.wrapT = THREE.RepeatWrapping;
    petalTexture.repeat.set(10, 10);
    petalRoughness.wrapS = THREE.RepeatWrapping;
    petalRoughness.wrapT = THREE.RepeatWrapping;
    petalRoughness.repeat.set(10, 10);
    // petalNormal.wrapS = THREE.RepeatWrapping;
    // petalNormal.wrapT = THREE.RepeatWrapping;
    // petalNormal.repeat.set(10, 10);

    // 创建材质
    var material = new THREE.MeshStandardMaterial({
        map: petalTexture, // 纹理贴图
        roughnessMap: petalRoughness, // 纹理粗糙度
        normalMap: petalNormal, // 纹理粗糙度
        // color: "pink", // 颜色
        side: THREE.DoubleSide,
    });

    // 创建花瓣mesh
    var petal = new THREE.Mesh(geometry, material);
    let rotx = document.getElementById('remote').innerHTML;
    console.log(rotx);
    const petalGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const petalClone = petal.clone();
        //rotation.x是set to哪里, rotateX是基于当前rotate多少
        console.log(petalClone.rotation);
        petalClone.rotation.x = -Math.PI / 2; // 旋转90度，使其处于水平状态
        console.log(petalClone.rotation);
        petalClone.rotateZ((Math.PI / 3) * i); // 控制花瓣复制时以Z为旋转轴的旋转角度，即使上面已经旋转了，仍沿用初始状态时的坐标系\    
        console.log(petalClone.rotation);
        petalClone.rotateX(Math.PI / 2); // 控制花瓣开合程度，2花苞，20基本完全开放.对应accelerometer z=0垂直于地面，z=1平行于地面
        console.log(petalClone.rotation);
        petalClone.position.y = 0;
        petalGroup.add(petalClone);
        console.log("asdf")
    }
    petalGroup.name = "petals";
    console.log("petalGroup:", petalGroup);


    /* 2. SEPAL */
    // Create a group to hold the sepal parts
    const sepalGroup = new THREE.Group();

    // Create the sepal
    const sepalShape = new THREE.Shape();
    // Define the curves
    const sepalCurve1 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(-0.2, 1),
        new THREE.Vector2(-1, 2),
        new THREE.Vector2(-1.2, 4)
    );

    const sepalCurve2 = new THREE.CubicBezierCurve(
        new THREE.Vector2(-1.2, 4),
        new THREE.Vector2(-1, 5),
        new THREE.Vector2(0, 6),
        new THREE.Vector2(0.8, 5)
    );

    const sepalCurve3 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0.8, 5),
        new THREE.Vector2(1, 4),
        new THREE.Vector2(0.5, 2),
        new THREE.Vector2(0, 0)
    );

    const sepalCurve4 = new THREE.CubicBezierCurve(
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.2, -1),
        new THREE.Vector2(1, -2),
        new THREE.Vector2(1.2, -4)
    );

    // Add the curves to the shape
    sepalShape.curves.push(sepalCurve1, sepalCurve2, sepalCurve3, sepalCurve4);
    const sepalGeometry = new THREE.ExtrudeGeometry(sepalShape, { depth: 0.5, bevelEnabled: false });
    const sepalMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const sepalMesh = new THREE.Mesh(sepalGeometry, sepalMaterial);
    // sepalMesh.rotation.x = -Math.PI / 2; // 旋转90度，使其处于水平状态
    // sepalMesh.rotateY(-Math.PI / 5); 
    // sepalGroup.add(sepalMesh);

    for (let i = 0; i < 6; i++) {
        const sepalMeshClone = sepalMesh.clone();
        //rotation.x是set to哪里, rotateX是基于当前rotate多少
        sepalMeshClone.rotation.x = -Math.PI / 2; // 旋转90度，使其处于水平状态
        sepalMeshClone.rotateZ((Math.PI / 3) * i); // 控制花萼复制时以Z为旋转轴的旋转角度，即使上面已经旋转了，仍沿用初始状态时的坐标系
        // sepalMeshClone.rotateY(-Math.PI / 20);
        sepalMeshClone.rotateY(-Math.PI / 5); //控制花萼开合程度，5适合花苞，20适合基本完全开放.对应accelerometer z=0垂直于地面，z=1平行于地面
        sepalMeshClone.position.y = 0;
        sepalGroup.add(sepalMeshClone);
    }
    sepalGroup.position.set(0, -1, 0);
    sepalGroup.name = "sepals";
    console.log("sepalGroup:", sepalGroup);

    /* 3. STEM */
    const stemGeometry = new THREE.CylinderGeometry(0.2, 0.3, 10);
    const stemMesh = new THREE.Mesh(stemGeometry, new THREE.MeshStandardMaterial({ color: "green" }));
    stemMesh.position.y = -5;

    stemMesh.name = "stem";
    console.log("stemMesh:", stemMesh)


    /* 4. PISTIL */
    // Create a group to hold the pistil parts
    const pistilGroup = new THREE.Group();

    // Create the stigma
    const stigmaGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const stigmaMaterial = new THREE.MeshStandardMaterial({ color: "yellow" });
    const stigmaMesh = new THREE.Mesh(stigmaGeometry, stigmaMaterial);
    stigmaMesh.position.set(0, 5, 0); // move the style down to the base of the stigma
    pistilGroup.add(stigmaMesh);
    stigmaMesh.name = "stigma";

    // Create the style
    const styleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
    const styleMaterial = new THREE.MeshStandardMaterial({ color: "green" });
    const styleMesh = new THREE.Mesh(styleGeometry, styleMaterial);
    styleMesh.position.set(0, 3, 0); // move the style down to the base of the stigma
    pistilGroup.add(styleMesh);
    styleMesh.name = "style";

    // Create the ovary
    const ovaryGeometry = new THREE.SphereGeometry(1, 16, 16);
    const ovaryMaterial = new THREE.MeshStandardMaterial({ color: "green" });
    const ovaryMesh = new THREE.Mesh(ovaryGeometry, ovaryMaterial);
    ovaryMesh.position.set(0, 1, 0); // move the ovary down from the style
    pistilGroup.add(ovaryMesh);
    ovaryMesh.name = "ovary";

    pistilGroup.name = "pistil";
    console.log("pistilGroup:", pistilGroup);



    /* 5. STAMEN */
    const oneStamenGroup = new THREE.Group();
    const stamenGroup = new THREE.Group();

    // Create the filament
    const filamentGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
    filamentGeometry.translate(0, 4 / 2, 0); // 改变几何的中心点geometry.translate( 0, cylinderHeight/2, 0 );
    const filamentMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const filamentMesh = new THREE.Mesh(filamentGeometry, filamentMaterial);
    oneStamenGroup.add(filamentMesh);

    // Create the anther
    const antherGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.6);
    const antherMaterial = new THREE.MeshStandardMaterial({ color: "pink" });
    const antherMesh = new THREE.Mesh(antherGeometry, antherMaterial);
    antherMesh.position.set(0, 4, 0);
    oneStamenGroup.add(antherMesh);
    stamenGroup.add(oneStamenGroup);

    // stamenGroup.rotateX(Math.PI / 20); // 控制雄蕊开合程度（除得很大的时候会出现很多蕊。。）
    console.log("Before loop: ", stamenGroup.children.length);

    stamenCount = 12;
    for (let i = 0; i < stamenCount; i++) {
        const oneStamenGroupClone = oneStamenGroup.clone();
        //rotation.x是set to哪里, rotateX是基于当前rotate多少
        oneStamenGroupClone.rotation.x = -Math.PI / 4; // 旋转90度，使其处于水平状态
        oneStamenGroupClone.rotation.y = 0; // 旋转90度，使其处于水平状态
        oneStamenGroupClone.rotation.z = 0; // 旋转90度，使其处于水平状态
        oneStamenGroupClone.rotateZ((Math.PI * 2 / stamenCount * i)); // 控制雄蕊复制时以Z为旋转轴的旋转角度，即使上面已经旋转了，仍沿用初始状态时的坐标系
        oneStamenGroupClone.rotateX(Math.PI / 4); // 控制雄蕊开合程度（除得很大的时候会出现很多蕊。。）
        stamenGroup.add(oneStamenGroupClone);
    }

    console.log("Number of stamen groups:", stamenGroup.children.length);
    // Set the position and rotation of the stamen group
    stamenGroup.position.set(0, 1, 0); // move the stamen up from the flower
    stamenGroup.rotation.set(-Math.PI / 4, 0, 0); // rotate the stamen to face upwards; was 4

    stamenGroup.name = "stamens";
    console.log("stamenGroup:", stamenGroup);




    /* ADD AND ADJUST ALL COMPONENTS */
    petalGroup.scale.set(2, 2, 2);
    sepalGroup.position.set(0, -0.3, 0);
    // pistilGroup.scale.set(0.5, 0.5, 0.5);
    scene.add(petalGroup);
    scene.add(sepalGroup);
    scene.add(stemMesh);
    scene.add(pistilGroup);
    scene.add(stamenGroup);

}

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function save(blob, filename) {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
function saveString(text, filename) {
    save(new Blob([text], { type: 'text/plain' }), filename);
}
function exportToObj() {
    const exporter = new OBJExporter();
    const result = exporter.parse(scene);
    saveString(result, 'object.obj');
}

function onWindowResized() {

    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

}



function animation(msTime) {

    const time = msTime / 1000;

    cubeCamera.update(renderer, scene);

    controls.update();

    renderer.render(scene, camera);
    
    let rotx = parseFloat(document.getElementById("remote").innerHTML);
    rotx = Math.min(Math.max(rotx, 0), 1);


    if (!isNaN(rotx)) {
        for (const group of scene.children) {
            if (group.name != "petals") continue;
            if (group.name == "petals") {
                let i = 0;
                for (const petal of group.children) {
                    //rotation.x是set to哪里, rotateX是基于当前rotate多少
                    petal.rotation.set(-Math.PI / 2, 0, 0);
                    petal.rotateZ((Math.PI / 3) * i); // 控制花瓣复制时以Z为旋转轴的旋转角度，即使上面已经旋转了，仍沿用初始状态时的坐标系
                    petal.rotateX(Math.PI * (1 - rotx) / 2); // 控制花瓣开合程度，2花苞，20基本完全开放.对应accelerometer z=0垂直于地面，z=1平行于地面
                    petal.position.y = 0;
                    i++;
                }
            }
        }
        for (const group of scene.children) {
            if (group.name != "sepals") continue;
            if (group.name == "sepals") {
                let i = 0;
                for (const sepal of group.children) {
                    //rotation.x是set to哪里, rotateX是基于当前rotate多少
                    sepal.rotation.set(-Math.PI / 2, 0, 0);
                    sepal.rotateZ((Math.PI / 3) * i); // 控制花瓣复制时以Z为旋转轴的旋转角度，即使上面已经旋转了，仍沿用初始状态时的坐标系
                    sepal.rotateX(Math.PI * (1 - rotx) / 4); // 控制花瓣开合程度，2花苞，20基本完全开放.对应accelerometer z=0垂直于地面，z=1平行于地面
                    sepal.position.y = 0;
                    sepal.scale.set(0.75 + rotx / 4, 0.75 + rotx / 4, 0.75 + rotx / 4);
                    i++;
                }
            }
        }
        for (const group of scene.children) {
            if (group.name != "pistil") continue;
            if (group.name == "pistil") {
                group.scale.set(0.5 + rotx / 2, 0.5 + rotx / 2, 0.5 + rotx / 2); //0->0.5, 1->1
            }
        }
        for (const group of scene.children) {
            if (group.name != "stamens") continue;
            if (group.name == "stamens") {
                let i = 0;
                for (const stamen of group.children) {
                    stamen.rotation.set(-Math.PI / 4, 0, 0);
                    stamen.rotateZ((Math.PI * 2 / stamenCount * i));
                    stamen.rotateX(Math.PI * (1.2 - rotx) / 2);
                    stamen.position.y = 0;
                    stamen.scale.set(0.8 + rotx / 5, 0.8 + rotx / 5, 0.8 + rotx / 5);
                    i++;
                }
            }
        }

    }
}

init();
recordDef();