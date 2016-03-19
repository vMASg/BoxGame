"use strict";

/* global THREE */
/* exported Board */

function Board (numTilesX, numTilesY, tileSize, color0, color1) {
    this.color0 = color0 || new THREE.Vector4(0, 0, 0, 1);
    this.color1 = color1 || new THREE.Vector4(1, 1, 1, 1);

    this.mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(numTilesX, numTilesY, tileSize, tileSize),
        // new THREE.MeshLambertMaterial({color: 0xceceff, wireframe: false})
        new THREE.ShaderMaterial({
            uniforms: {
                N: { type: 'f', value: tileSize },
                color0: { type: 'v4', value: this.color0 },
                color1: { type: 'v4', value: this.color1 }
            },
            // attributes: {},
            // defines: {},
            // wireframe: true,

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
                'uniform vec4 color0;',
                'uniform vec4 color1;',
                'varying vec2 vUv;',
                '',
                'vec4 checker(vec2 tex, vec4 color0, vec4 color1) {',
                // '    float intra_pos = (tex.s - floor(tex.s*N) / N) * N;',
                '    if ( mod(floor(tex.s*N), 2.0) + mod(floor(tex.t*N), 2.0) == 1.0 ) {',
                // '        if (intra_pos <= 0.1)',
                // '            return mix(color0, color1, 0.5 + intra_pos*5.0);',
                // '        else if (intra_pos >= 0.9)',
                // '            return mix(color0, color1, intra_pos - 0.9);',
                '        return color0;',
                '    } else {',
                // '        if (intra_pos <= 0.1)',
                // '            return mix(color1, color0, 0.5 + intra_pos*5.0);',
                // '        else if (intra_pos >= 0.9)',
                // '            return mix(color1, color0, intra_pos - 0.9);',
                '        return color1;',
                '    }',
                '}',
                '',
                'void main() {',
                '    gl_FragColor = checker(vUv, color0, color1);',
                '}'
            ].join('\n')
        })
    );

    this.render = function (scene) {
        scene.add(this.mesh);
    };

    this.updateColor0 = function (r, g, b) {
        this.color0.set(r, g, b);
    };

    this.updateColor1 = function (r, g, b) {
        this.color1.set(r, g, b);
    };
}