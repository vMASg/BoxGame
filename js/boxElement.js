"use strict";

/* global THREE, console */
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

	this._pointCoords = null;
	this.route = [];
	this.speed = 1; // tiles / s
	this.previousPosition = undefined;
	this.currentPosition = undefined;

	this.render = function (scene) {
		scene.add(this.mesh);
	};

	this.setPointCoordsFunction = function (f) {
		this._pointCoords = f;
	};

	this.teleportTo = function (x, y) {
		this.previousPosition = [x, y];
		this.currentPosition = [x, y];
		var coords = this._pointCoords([x, y]);
		this.mesh.position.set(coords[0], 2, coords[1]);
	};

	this.moveTo = function (x, y) {
		// compute fastest route
		this.route = this._planRoute([x, y]);
		// translate to coordinates
		// var coords = [];
		// for (var i = 0; i < route.length; ++i) {
		// 	coords.push(this._pointCoords(route[i]));
		// }
		// this.route = coords;
	};

	this._planRoute = function (destination) {
		var destX = destination[0];
		var destY = destination[1];
		var currX = this.currentPosition[0];
		var currY = this.currentPosition[1];
		var route = [];

		if (currX < destX) {		
			for (currX; currX < destX; ++currX)
				route.push([currX + 1, currY]);
		} else if (currX > destX) {
			for (currX; currX > destX; --currX)
				route.push([currX - 1, currY]);
		}

		if (currY < destY) {		
			for (currY; currY < destY; ++currY)
				route.push([currX, currY + 1]);
		} else if (currY > destY) {
			for (currY; currY > destY; --currY)
				route.push([currX, currY - 1]);
		}

		console.log(route);
		return route;
	};

	this.updatePosition = function (delta) {

		var reachedDestination = function (prevX, prevY, currX, currY, nextX, nextY) {
			if (prevY == nextY){
				return Math.abs(currX - prevX) >= Math.abs(nextX - prevX);
			} else {
				return Math.abs(currY - prevY) >= Math.abs(nextY - prevY);
			}
		};

		// if any route
		while (this.route.length > 0 && delta > 0) {
			var prevX = this.previousPosition[0];
			var prevY = this.previousPosition[1];

			var currX = this.currentPosition[0];
			var currY = this.currentPosition[1];

			var nextX = this.route[0][0];
			var nextY = this.route[0][1];

			var directionX = prevX <= nextX ? 1 : -1;
			var directionY = prevY <= nextY ? 1 : -1;

			var currentCoordinates = this.mesh.position;

			// compute time to reach destination
			var distanceTravelled = delta * this.speed;
			var timeToDestination;
			if (prevY == nextY) {
				timeToDestination = Math.abs(currX - nextX) / this.speed;
				currX += directionX * distanceTravelled;
			} else {
				timeToDestination = Math.abs(currY - nextY) / this.speed;
				currY += directionY * distanceTravelled;
			}

			// if arrived to destination
			if (reachedDestination(prevX, prevY, currX, currY, nextX, nextY)) {
				this.currentPosition = this.previousPosition = this.route.shift();
				delta -= timeToDestination;
			} else {
				this.currentPosition[0] = currX;
				this.currentPosition[1] = currY;
				delta = 0;
			}

			// update final coordinates
			var coords = this._pointCoords([this.currentPosition[0], this.currentPosition[1]]);
			currentCoordinates.x = coords[0];
			currentCoordinates.z = coords[1];
		}
	};
}
