"use strict";

/* global THREE */
/* exported BoxElement */

function BoxElement (size) {
	this.mesh = new THREE.Mesh(
		new THREE.BoxGeometry(size, size, size),
		new THREE.MeshPhongMaterial({
			color: 0xeeeeee,
			specular: 0xffffff,
			shininess: 30
		})
	);

	this.render = function (scene) {
		scene.add(this.mesh);
	};
}