"use strict";

/* global THREE */
/* exported Board */

function Board (numTilesX, numTilesY, tileSize) {
    this.mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(numTilesX, numTilesY, tileSize, tileSize),
        new THREE.MeshLambertMaterial({color: 0xceceff, wireframe: false})
    );

    this.render = function (scene) {
        scene.add(this.mesh);
    };
}