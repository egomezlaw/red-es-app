<template>
    <div>
        <div class="text-center" ref="globeContainer"></div>
        <div class="flex items-center justify-center w-[960px]">
            <h1 class="text-center text-2xl text-white ">{{ selectedLocation }}</h1>
        </div>
    </div>
</template>
<script>

import Globe from 'globe.gl';
import * as THREE from 'https://esm.sh/three';
import { nextTick } from 'vue';


export default{
    
    props: ['width', 'height', 'zoom', 'locations', 'type'],
    data(){
        return{
            globeInstance:null,
            selectedMarker:null,
            selectedLocation:'',
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
                if (!markers){
                    return;
                }

                this.globeInstance.htmlElementsData([]);
                this.selectedLocation = '';

                const markerSvg = `<svg viewBox="-4 0 36 36" class="pointer-events-none">
                <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
                <circle fill="black" cx="14" cy="14" r="7"></circle>
                </svg>`;
                    
                    
                    this.globeInstance
                    .htmlElementsData(markers)
                    .htmlElement(d => {
                        const el = document.createElement('div');
                        el.classList.add('click-option');
                        el.innerHTML = markerSvg;
                        el.data = d;
                        el.style.color = d.color;
                        //el.style.width = `${d.size}px`;
                        el.style.width = `40px`;
                        
                        el.style['pointer-events'] = 'auto';
                        el.style.cursor = 'pointer';
                        el.onclick = event => {
                            if (this.selectedMarker){
                                this.selectedMarker.style.width = `40px`;
                                this.selectedMarker.style.color = this.selectedMarker.data.color;
                            }
                            event.target.style.width = `70px`;
                            event.target.style.color = 'orange';
                            this.selectedLocation = d.location;
                            this.selectedMarker = event.target;
                            this.$emit("markerSelect", d);
                        };
                        return el;
                    });

                    this.globeInstance.controls().autoRotateSpeed = 0.35;

                    if (markers.length){
                        this.globeInstance.resumeAnimation();
                        this.globeInstance.pointOfView( {lat:markers[0].lat, lng:markers[0].lng}, 300);                    
                        this.globeInstance.controls().autoRotateSpeed = 0;
                    }


                    if (this.type == 'static'){
                        setTimeout(() => {
                            this.globeInstance.pauseAnimation();
                        }, 400);

                    }

            },
            
            
        }
    }
</script>
<style scoped>
h1 {
  text-transform: lowercase;
}
h1:first-line{
  text-transform: capitalize;
}
</style>