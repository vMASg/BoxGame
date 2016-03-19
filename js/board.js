"use strict";

/* global THREE */
/* exported Board */

function Board (numTilesX, numTilesY, tileSize) {
    this.mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(numTilesX, numTilesY, tileSize, tileSize),
        // new THREE.MeshLambertMaterial({color: 0xceceff, wireframe: false})
        new THREE.ShaderMaterial({
            uniforms: {
                N: { type: 'f', value: 8.0 }
            },
            // attributes: {},
            // defines: {},

            vertexShader: [
                'varying vec2 vUv;',
                '',
                'void main() {',
                '    vUv = uv;',
                '',
                '    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
            ].join('\n'),


            fragmentShader: [
                'uniform float N;',
                'varying vec2 vUv;',
                '',
                'vec4 checker(vec2 tex, vec4 color0, vec4 color1) {',
                '    if ( mod(floor(tex.s*N), 2.0) + mod(floor(tex.t*N), 2.0) == 1.0 )',
                '        return color0;',
                '    else',
                '        return color1;',
                '}',
                '',
                'void main() {',
                '    gl_FragColor = checker(vUv, vec4(0, 0, 0, 1), vec4(1, 1, 1, 1));',
                '}'
            ].join('\n')
        })
    );

    this.render = function (scene) {
        scene.add(this.mesh);
    };
}