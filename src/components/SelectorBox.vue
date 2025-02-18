<template>
  <div class="relative flex flex-row items-center gap-2 border-4 mb-3 border-white p-2 w-full shadow-md inset-shadow rounded-lg mr-2 glow opacity-50"
    :class="{'opacity-100': modelValue !== ''}">
    <div class="absolute top-1 right-1 z-50" @click="moveIndex(-1)">
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="miter" stroke-linejoin="miter" stroke-width="4" d="M5 15l7-7 7 7"></path>
    </svg>
  </div>
  <div class="absolute bottom-1 right-1 z-50" @click="moveIndex(1)">
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="miter" stroke-linejoin="miter" stroke-width="4" d="M19 9l-7 7-7-7"></path>
    </svg>
  </div>
    <div class="flex flex-row items-center">
      <!-- Label -->
      <span 
        class="text-sm font-medium text-right mr-5 opacity-50 select-none capitalize"
        :class="{'opacity-100': modelValue !== ''}"
        @click="select()"
        ><slot></slot>
      </span>
      <!-- Icono de flecha -->
      <svg class="w-8 h-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="miter" stroke-linejoin="miter" stroke-width="4" d="M9 5l7 7-7 7" />
      </svg>
    </div>
    
    <div
      v-if="props.items.length > 2  " 
      class="relative w-full h-40 overflow-hidden grow"
      :style="{ width: maxWidth + 'px' }"
      @touchstart="onStart" 
      @touchmove="onMove" 
      @touchend="onEnd"
      @mousedown="onStart" 
      @mousemove="onMove" 
      @mouseup="onEnd"
      @mouseleave="onEnd"
    >
      <ul 
        ref="listRef"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-10 flex flex-col items-center gap-2 w-xl"
        :style="{ transform: `translateY(${currentTranslateY}px)`, width: maxWidth + 'px' }"
        v-if="props.items.length > 1"
      >
        <li v-for="(item, index) in visibleItems" :key="index"         
          class="p-2 text-xl opacity-50 transition-opacity duration-500 ease-out  whitespace-nowrap select-none capitalize" 
          :class="{ 'opacity-100 font-bold': (index === Math.floor(visibleCount / 2) && modelValue !== '') }"
          @click="selectItem(index)">
          {{ item }}
        </li>
      </ul>
      <div class="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 right-0 h-10 bg-opacity-50 pointer-events-none"></div>
    </div>
    <div v-else class="w-full">
      <div
        v-if="props.items.length == 1"
        class="p-2 text-lg opacity-100 font-bold transition-opacity duration-500 ease-out  whitespace-nowrap select-none items-center w-full">
        {{oneItem()}}
      </div>
      <div v-else>
        <div v-for="(item, index) in props.items" :key="index"
        class="p-2 text-lg opacity-50 transition-opacity duration-500 ease-out  whitespace-nowrap select-none capitalize"
        :class="{ 'opacity-100 font-bold': (item == modelValue) }"
        @click="selectItem(index)">
        {{item}}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, onMounted, nextTick, watch } from 'vue';

const emit = defineEmits(['change'])

const model = defineModel()

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  }
});

watch(() => props.items, () => {
  selectedIndex.value = 0;
  currentTranslateY.value = translateY.value;
  nextTick(() => calculateMaxWidth());
});


const listRef = ref(null);
const selectedIndex = ref(0);
const itemHeight = 40;
const visibleCount = 5;
const maxWidth = ref(0);
const currentTranslateY = ref(0);
let startY = 0;
let deltaY = 0;
let isDragging = false;


const visibleItems = computed(() => {
  if (props.items.length == 0){
    return [];    
  }
  
  const extendeditems = [...props.items, ...props.items, ...props.items];
  //console.log(extendeditems);
  const start = selectedIndex.value + props.items.length - Math.floor(visibleCount / 2)  > 0 ? selectedIndex.value + props.items.length - Math.floor(visibleCount / 2) : visibleCount;
  return extendeditems.slice(start, start + visibleCount);
});

const translateY = computed(() => -Math.floor(visibleCount / 2) * itemHeight);


const calculateMaxWidth = () => {
  nextTick(() => {
    if (listRef.value) {
      maxWidth.value = Math.max(...Array.from(listRef.value.children).map(el => el.offsetWidth));
    }
  });
};

onMounted(() => {
  calculateMaxWidth();
  currentTranslateY.value = translateY.value;
});

function oneItem(){
  if (model.value !== props.items[0]){
    model.value = props.items[0];
    emit("change");
  }
  return props.items[0];
} 


function select(){
  selectItem(Math.floor(visibleCount / 2));
}

const onStart = (event) => {
  if(props.items.length < 4) return;
  isDragging = true;
  startY = event.touches ? event.touches[0].clientY : event.clientY;
};

const onMove = (event) => {
  if (!isDragging || props.items.length < 4) return;
  event.preventDefault(); // Evita el desplazamiento de la página
  deltaY = (event.touches ? event.touches[0].clientY : event.clientY) - startY;
  currentTranslateY.value = translateY.value + deltaY;
};

function onEnd(){
    if (!isDragging) return;
    isDragging = false;
    if (deltaY > 10) {
      selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length;
    } else if (deltaY < -10) {
      selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
    }
    currentTranslateY.value = translateY.value;
    deltaY = 0;

    if (model.value !== props.items[selectedIndex.value]){
      model.value = props.items[selectedIndex.value];
      emit("change");
    } 
};

const selectItem = (index) => {
  //console.log("selectItem", index, props.items.length);
  if (props.items.length > 2)
    {
      selectedIndex.value = index + selectedIndex.value - Math.floor(visibleCount / 2);
      currentTranslateY.value = translateY.value;
    }
    else{
      selectedIndex.value = index;
    }

    if (selectedIndex.value < 0){
      selectedIndex.value = props.items.length - 1; 
    }

    if(selectedIndex.value > props.items.length - 1){
      selectedIndex.value = 0;
    }

    if (model.value !== props.items[selectedIndex.value]){
      model.value = props.items[selectedIndex.value];
      emit("change");
    } 
};

const moveIndex = (index) => {
  if (selectedIndex.value + index  < 0){
    selectedIndex.value = props.items.length - 1;
  }else if(selectedIndex.value + index >= props.items.length){
    selectedIndex.value = 0;
  }else{
    selectedIndex.value = (selectedIndex.value + index );
  }
  
  if (model.value !== props.items[selectedIndex.value]){
    model.value = props.items[selectedIndex.value];
    emit("change");
  }
};

</script>

<style scoped>
.glow {
  -webkit-box-shadow:0px 0px 5px 3px rgba(255,255,255,0.9);
-moz-box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.9);
box-shadow: 0px 0px 5px 3px rgba(255,255,255,0.9);
}

span,
li,
div {
  text-transform: lowercase;
}
span:first-line,
li:first-line,
div:first-line {
  text-transform: capitalize;
}
</style>
