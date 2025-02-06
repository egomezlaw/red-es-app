<template>
    <div ref="globeContainer"></div>
</template>
<script>

import Globe from 'globe.gl';
import * as THREE from 'https://esm.sh/three';


export default{

    props: ['width', 'height', 'zoom'],
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
                this.globeInstance = Globe()(this.$refs.globeContainer, { animateIn: true })
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
                .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
                .backgroundColor('#000')
                .width(this.width)
                .height(this.height);
                //.width(960);
                
                // Puedes agregar más configuraciones aquí
                
                this.globeInstance.controls().autoRotate = true;
                this.globeInstance.controls().autoRotateSpeed = 0.35;
                this.globeInstance.camera().position.z = this.zoom;

                const CLOUDS_IMG_URL = '/images/clouds.png';
                const CLOUDS_ALT = 0.004;
                const CLOUDS_ROTATION_SPEED = -0.016; // deg/frame
                
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
        },
        

      
    }
}
</script>