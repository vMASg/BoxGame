"use strict";

/* global document, window, Board, THREE */
/* exported app */

var app = {
    main: function (id_canvas_container) {
        this.canvas = document.getElementById(id_canvas_container);
        this.board = new Board(40, 40, 10);
        this.initScene();
        this.board.render(this.scene);
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
        this.canvas.appendChild( this.renderer.domElement );
        // Scene, camera, clock setup
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60.0, window.innerWidth / window.innerHeight, 10*Math.SQRT2, 80*Math.SQRT2);
        this.camera.position.set( 0, 40*Math.SQRT2, 20 );
        this.cameraControls = new THREE.OrbitAndPanControls( this.camera, this.renderer.domElement );
        this.cameraControls.target.set( 0, 0, 0 );
        this.camera.updateProjectionMatrix();

        // Adding some ambient lights
        this.scene.add( new THREE.AmbientLight(0x222222) );

        this.dlight = new THREE.DirectionalLight( 0xffffff, 0.7 );
        this.dlight.position.set( 20, -50, 50 );
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