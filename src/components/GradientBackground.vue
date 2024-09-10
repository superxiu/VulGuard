<template>
  <div ref="backgroundContainer" class="background-container"></div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: 'GradientBackground',
  mounted() {
    this.initThreeJS();
  },
  methods: {
    initThreeJS() {
      const container = this.$refs.backgroundContainer;

      // Create scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      // Create geometry and material
      const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec2 resolution;

          // Function to generate random values
          float random (in vec2 st) {
              return fract(sin(dot(st.xy,
                                   vec2(12.9898,78.233)))*
                          43758.5453123);
          }

          // Function to generate noise
          float noise (in vec2 st) {
              vec2 i = floor(st);
              vec2 f = fract(st);

              // Four corners in 2D of a tile
              float a = random(i);
              float b = random(i + vec2(1.0, 0.0));
              float c = random(i + vec2(0.0, 1.0));
              float d = random(i + vec2(1.0, 1.0));

              // Smooth Interpolation

              // Cubic Hermine Curve.  Same as SmoothStep()
              vec2 u = f*f*(3.0-2.0*f);
              // u = smoothstep(0.0,1.0,f);

              // Mix 4 corners percentages
              return mix(a, b, u.x) +
                      (c - a)* u.y * (1.0 - u.x) +
                      (d - b) * u.x * u.y;
          }

          void main() {
              vec2 st = gl_FragCoord.xy/resolution.xy*3.0;

              vec3 color = vec3(0.0);
              vec2 pos = vec2(st*5.0);

              // Scale the coordinate system to see
              // some noise in action
              float n = noise(pos + time*0.1);

              // Assign color based on noise value
              color = vec3(n*0.5+0.5, n*0.5, 1.0-n*0.5);

              gl_FragColor = vec4(color,1.0);
          }
        `
      });

      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      camera.position.z = 1;

      function animate() {
        requestAnimationFrame(animate);
        material.uniforms.time.value += 0.01;
        renderer.render(scene, camera);
      }

      animate();

      // Handle window resize
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      });
    }
  }
}
</script>

<style>
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1; /* Ensure background is behind other elements */
}
</style>
