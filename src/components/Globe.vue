<template>
    <div ref="globeContainer" class="max-w-0.5"></div>
</template>
<script>

import Globe from 'globe.gl';
import * as THREE from 'https://esm.sh/three';


export default{
    
    data(){
        return{
            globeInstance:null,
        }
    },    
    
    mounted() {
        this.initGlobe();
    },
    
    methods: {
        initGlobe(){
            if (this.$refs.globeContainer) {
                this.globeInstance = Globe()(this.$refs.globeContainer, { animateIn: false })
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
                .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
                .backgroundColor('#000');
                
                // Puedes agregar más configuraciones aquí
                
                this.globeInstance.controls().autoRotate = true;
                this.globeInstance.controls().autoRotateSpeed = 0.35;

                const CLOUDS_IMG_URL = '/images/clouds.png';
                const CLOUDS_ALT = 0.004;
                const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame
                
                new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
                    const clouds = new THREE.Mesh(
                    new THREE.SphereGeometry(this.globeInstance.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
                    new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
                    );
                    
                    this.globeInstance.scene().add(clouds);
                    
                    (function rotateClouds() {
                        clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
                        requestAnimationFrame(rotateClouds);
                    })();
                });
                
            }
        }
    }
}
</script>