<template>
    <div>
        <div ref="globeContainer"></div>
        <div @click="toggleAnimation()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <!-- Ícono de Play -->
                <path id="play" d="M8 5v14l11-7z" fill="currentColor" v-if="!animating" @click="pauseAnimation()"/>
                <!-- Ícono de Pausa -->
                <path id="pause" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" v-if="animating" @click="resumeAnimation()"/>
            </svg>
        </div>
    </div>
</template>
<script>

import Globe from 'globe.gl';
import * as THREE from 'https://esm.sh/three';
import { nextTick } from 'vue';


export default{
    
    props: ['width', 'height', 'zoom', 'locations'],
    data(){
        return{
            globeInstance:null,
            animating :true,
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
                //this.setMarkers();
                
            },

            toggleAnimation(){
                this.animating = !this.animating;
                this.globeInstance.pauseAnimation();
                if (this.animating)
                {
                    this.globeInstance.resumeAnimation()
                }
            },

            pauseAnimation(){
                this.animating = false;
                this.globeInstance.pauseAnimation();
            },
            
            resumeAnimation(){
                this.animating = true;
                this.globeInstance.resumeAnimation();
            },
            
            clearMarkers(){
                this.globeInstance.htmlElementsData([]);
            },

            setMarkers(markers){
                this.globeInstance.htmlElementsData([]);

                const markerSvg = `<svg viewBox="-4 0 36 36">
                <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
                <circle fill="black" cx="14" cy="14" r="7"></circle>
                </svg>`;
                    
                    
                    this.globeInstance
                    .htmlElementsData(markers)
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.innerHTML = markerSvg;
                        el.style.color = d.color;
                        //el.style.width = `${d.size}px`;
                        el.style.width = `40px`;
                        
                        el.style['pointer-events'] = 'auto';
                        el.style.cursor = 'pointer';
                        el.onclick = () => this.$emit("markerSelect", d);
                        return el;
                    });

                    this.globeInstance.resumeAnimation();
                    if (!this.animating){
                        this.$nextTick(() => {
                            this.globeInstance.pauseAnimation();
                        });
                    }
            },
            
            
        }
    }
</script>