<template>
    <div ref="globeContainer"></div>
    <button class="bg-red rounded-2xl p-5" @click="clearMarkers">Limpiar</button>
</template>
<script>

import Globe from 'globe.gl';
import * as THREE from 'https://esm.sh/three';


export default{
    
    props: ['width', 'height', 'zoom', 'locations'],
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
                //this.setMarkers();
                
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
                    
                    // Gen random data
                    /*const N = 30;
                    const markers = [...Array(N).keys()].map(() => ({
                        lat: (Math.random() - 0.5) * 180,
                        lng: (Math.random() - 0.5) * 360,
                        size: 7 + Math.random() * 30,
                        color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
                    }));*/
                    
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
                        el.onclick = () => console.info(d);
                        return el;
                    });
            },
            
            
        }
    }
</script>