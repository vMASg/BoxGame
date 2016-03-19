"use strict";

/* global document, window, Board, THREE, BoxElement */
/* exported app */

var app = {
    main: function (idCanvasContainer) {
        var convertColor = function (c) {
            return c.match(/[a-z0-9]{2}/gi).map(function (e) { return Number.parseInt(e, 16) / 255.0; });
        };
        this.canvasContainer = document.getElementById(idCanvasContainer);
        var col1 = convertColor('#00bfff');
        var col2 = convertColor('#0080ff');

        this.board = new Board(40, 10, new THREE.Vector3(col1[0], col1[1], col1[2]), new THREE.Vector3(col2[0], col2[1], col2[2]));
        this.boxElement = new BoxElement(4);
        // this.boxElement.mesh.position.set(2, 2, 2);
        var coords = this.board.getTileCoords(0, 0);
        this.boxElement.mesh.position.set(coords[0], coords[1], 2);
        this.initScene();

        this.board.render(this.scene);
        this.boxElement.render(this.scene);

        this.render.call(this);
        var that = this;
        window.addEventListener('resize', function () {
            that.resize(window.innerWidth, window.innerHeight);
        }, false);
    },

    initScene: function () {
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor( 0xAAAAAA );
        this.canvasContainer.appendChild( this.renderer.domElement );
        // Scene, camera, clock setup
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50.0, window.innerWidth / window.innerHeight, 10*Math.SQRT2, 80*Math.SQRT2);
        this.camera.position.set( 0, -40*Math.SQRT2, 20 );
        this.cameraControls = new THREE.OrbitAndPanControls( this.camera, this.renderer.domElement );
        this.cameraControls.target.set( 0, 0, 0 );
        this.camera.updateProjectionMatrix();

        // Adding some ambient lights
        this.scene.add( new THREE.AmbientLight(0x222222) );

        this.dlight = new THREE.PointLight( 0xdddddd, 1, 50 );
        this.dlight.position.set( 0, 20, 20 );
        this.scene.add( this.dlight );
    },

    resize: function (new_width, new_height) {
        this.camera.aspect = new_width / new_height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( new_width, new_height );
    },

    render: function () {
        window.requestAnimationFrame( this.render.bind(this) );
        var delta = this.clock.getDelta();
        this.cameraControls.update( delta );
        this.renderer.render( this.scene, this.camera );
    }
};