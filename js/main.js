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
        var board = this.board;
        this.boxElement = new BoxElement(4);
        this.boxElement.setPointCoordsFunction(function (point) {
            return board.getTileCoords(point[0], point[1]);
        });

        this.boxElement.teleportTo(0, 0);
        // this.boxElement.moveTo(3, 3);

        this.initScene();
        this.board.render(this.scene);
        this.boxElement.render(this.scene);

        this.render.call(this);
        var that = this;
        window.addEventListener('resize', function () {
            that.resize(window.innerWidth, window.innerHeight);
        }, false);

        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();

        document.addEventListener('mousemove', function (event) {
            event.preventDefault();

            mouse.x = ( event.clientX / that.renderer.domElement.clientWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / that.renderer.domElement.clientHeight ) * 2 + 1;

            raycaster.setFromCamera( mouse, that.camera );
            var intersects = raycaster.intersectObject( that.board.mesh );

            if (intersects.length > 0) {
                var p = that.board.getTileFromCoords(intersects[0].point.x, intersects[0].point.z);
                that.board.updateSelectedTile(p[0], p[1]);
            } else {
                that.board.updateSelectedTile(-1, -1);
            }
        });

        document.addEventListener('mousedown', function () {
            if (that.board.selectedTile.x > -1) {
                that.boxElement.moveTo(that.board.selectedTile.x, that.board.selectedTile.y);
            }
        });
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
        this.camera.position.set( 0, 20, -40*Math.SQRT2 );
        this.cameraControls = new THREE.OrbitAndPanControls( this.camera, this.renderer.domElement );
        this.cameraControls.target.set( 0, 0, 0 );
        this.camera.updateProjectionMatrix();

        // Adding some ambient lights
        this.scene.add( new THREE.AmbientLight(0x222222) );

        this.plights = [
            // new THREE.PointLight( 0xb30000, 1, 60 ),
            // new THREE.PointLight( 0x0000b3, 1, 60 ),
            // new THREE.PointLight( 0x00b300, 1, 60 ),
            // new THREE.PointLight( 0xb3b300, 1, 60 )
            new THREE.PointLight( 0xbcbcbc, 1, 60 ),
            new THREE.PointLight( 0xbcbcbc, 1, 60 ),
            new THREE.PointLight( 0xbcbcbc, 1, 60 ),
            new THREE.PointLight( 0xbcbcbc, 1, 60 )
        ];
        this.plights[0].position.set( -20, 10, -20 );
        this.plights[1].position.set( -20, 10, 20 );
        this.plights[2].position.set( 20, 10, 20 );
        this.plights[3].position.set( 20, 10, -20 );
        for (var i = 0; i < this.plights.length; ++i) {
            this.scene.add( this.plights[i] );
            this.scene.add(new THREE.PointLightHelper(this.plights[i], 1));
        }
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
        this.boxElement.updatePosition( delta );
        this.renderer.render( this.scene, this.camera );
    }
};
