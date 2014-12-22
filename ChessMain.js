/// <reference path="../DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="../DefinitelyTyped/threejs/three-trackballcontrols.d.ts" />
/// <reference path="../DefinitelyTyped/dat-gui/dat-gui.d.ts" />
/// <reference path="ChessPiece.ts" />
/// <reference path="ChessBoard.ts" />
(function () {
    'use strict';
    var scene;
    var camera;
    var meshes = [];
    var pieces = [];
    var edge;
    var renderer;
    var quaternion;
    var container;
    var controls;
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var nFloor = 8;
    var floorWidth = 2.0;
    var pieceNames = ["Empty", "King", "Queen", "Bishop", "Knight", "Rook", "Pawn"];
    var chessBoard = new Chess.Board();
    initThree();
    initPieces();
    animate();
    function initThree() {
        container = document.createElement("div");
        document.body.appendChild(container);
        scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 5, 50);
        camera = new THREE.PerspectiveCamera(45.0, SCREEN_WIDTH / SCREEN_HEIGHT, 1.0, 100.0);
        camera.position.set(10, 10, 10);
        camera.up.set(0, 0, 1);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        // Renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapType = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        // Add trackball control
        // controls = new THREE.TrackballControls(camera, renderer.domElement);
        var ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1.00);
        directionalLight.position.set(-10, 10, 10);
        directionalLight.castShadow = true;
        directionalLight.shadowMapWidth = 2048;
        directionalLight.shadowMapHeight = 2048;
        directionalLight.shadowDarkness = 0.5;
        directionalLight.shadowCameraVisible = false;
        var dist = 50;
        directionalLight.shadowCameraRight = dist;
        directionalLight.shadowCameraLeft = -dist;
        directionalLight.shadowCameraTop = dist;
        directionalLight.shadowCameraBottom = -dist;
        directionalLight.shadowCameraFar = 3.0 * dist;
        directionalLight.shadowCameraNear = 1.0;
        scene.add(directionalLight);
        for (var i = -nFloor / 2; i < nFloor / 2; i++) {
            for (var j = -nFloor / 2; j < nFloor / 2; j++) {
                var plane = null;
                if ((i + j) % 2 == 0) {
                    var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(floorWidth, floorWidth, 1, 1), new THREE.MeshPhongMaterial({ color: 0xcccccc }));
                }
                else {
                    var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(floorWidth, floorWidth, 1, 1), new THREE.MeshPhongMaterial({ color: 0x333333 }));
                }
                plane.position.x = j * floorWidth;
                plane.position.y = i * floorWidth;
                plane.receiveShadow = true;
                scene.add(plane);
            }
        }
        var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        plane.position.z = -0.01;
        plane.receiveShadow = true;
        scene.add(plane);
        document.addEventListener("mousedown", onMouseDown, false);
        document.addEventListener("resize", onWindowResize, false);
    }
    function onMouseDown(e) {
        var materials = new Array(pieces.length);
        for (var i = 0; i < pieces.length; i++) {
            materials[i] = pieces[i].mesh.material;
            var color = 255 << 16 | i << 8;
            pieces[i].mesh.material = new THREE.MeshBasicMaterial({ color: color, fog: false });
        }
        renderer.render(scene, camera);
        var gl = renderer.getContext();
        var pixels = new Uint8Array(SCREEN_WIDTH * SCREEN_HEIGHT * 4);
        gl.readPixels(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        var pixelX = e.clientX;
        var pixelY = SCREEN_HEIGHT - e.clientY - 1;
        var red = pixels[(pixelY * SCREEN_WIDTH + pixelX) * 4 + 0];
        var green = pixels[(pixelY * SCREEN_WIDTH + pixelX) * 4 + 1];
        var blue = pixels[(pixelY * SCREEN_WIDTH + pixelX) * 4 + 2];
        var alpha = pixels[(pixelY * SCREEN_WIDTH + pixelX) * 4 + 3];
        if (red == 255) {
            console.log("piece " + green + " selected.");
            console.log("this piece is " + pieceNames[pieces[green].pieceKind] + " at (" + pieces[green].x + ", " + pieces[green].y + ")");
        }
        for (var i = 0; i < pieces.length; i++) {
            pieces[i].mesh.material = materials[i];
        }
        renderer.render(scene, camera);
    }
    function onWindowResize() {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
    }
    function ChessPieceMeshLoader(pieceId, px, py) {
        var color = 0xffffff;
        var rotY = 0.0;
        if (pieceId < 0) {
            pieceId = -pieceId;
            rotY = Math.PI;
            color = 0x333333;
        }
        var filename = pieceNames[pieceId] + ".js";
        new THREE.JSONLoader().load("Pieces/" + filename, function (geometry) {
            var pieceMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, ambient: color, diffuse: color }));
            pieceMesh.position.set((px - chessBoard.rows / 2) * floorWidth, (py - chessBoard.cols / 2) * floorWidth, 0.0);
            pieceMesh.rotation.set(Math.PI / 2.0, rotY, 0.0);
            pieceMesh.scale.set(0.1, 0.1, 0.1);
            pieceMesh.castShadow = true;
            pieceMesh.receiveShadow = false;
            pieces.push(new Chess.Piece(pieceId, px, py, pieceMesh));
            scene.add(pieceMesh);
        });
    }
    function initPieces() {
        for (var i = 0; i < chessBoard.rows; i++) {
            for (var j = 0; j < chessBoard.cols; j++) {
                var pieceId = chessBoard.getPiece(i, j);
                if (pieceId != 0) {
                    ChessPieceMeshLoader(pieceId, i, j);
                }
            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        // controls.update();
        renderer.render(scene, camera);
    }
    function getShaderFromName(name) {
        var material = new THREE.ShaderMaterial({
            fragmentShader: document.getElementById(name + "-fs").innerHTML,
            vertexShader: document.getElementById("vs").innerHTML,
            attributes: {},
            uniforms: {
                lightPosition: {
                    type: 'v3',
                    value: new THREE.Vector3(5, 5, 5)
                },
                lightPositionSub: {
                    type: 'v3',
                    value: new THREE.Vector3(-5, -5, -5)
                }
            }
        });
        material.side = THREE.DoubleSide;
        return material;
    }
}());
