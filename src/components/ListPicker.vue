<template>
  <div class="flex flex-row items-center gap-2">
    
    <div class="flex flex-row items-center grow">
      <!-- Label -->
      <span class="text-lg font-medium text-right mr-5"><slot></slot></span>
      <!-- Icono de flecha -->
      <svg class="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
    
    <div 
    class="relative w-160 h-40 overflow-hidden grow"
    @touchstart="onTouchStart" 
    @touchmove="onTouchMove" 
    @touchend="onTouchEnd">
    <ul 
    ref="listRef"
    class="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-left transition-transform duration-500 ease-out"
    @wheel.prevent="onScroll"
    >
    <li v-for="(item, index) in visibleItems" :key="index" class="p-2 text-lg transition-opacity duration-500 ease-out " :class="[index == 1 ? 'opacity-100 font-bold':'opacity-50']">
      {{item }}
    </li>
  </ul>
  <div class="absolute top-1/2 left-0 right-0 h-10 bg-opacity-50 pointer-events-none"></div>
    </div>

</div>


</template>

<script setup>
import { ref, computed, onMounted, defineProps } from 'vue';

const emit = defineEmits(['change'])

const model = defineModel()

const props = defineProps({
  items: {
    type:Array,
    required:true
  } 
});


const listRef = ref(null);
const selectedIndex = ref(0);
const itemHeight = 40;
const visibleCount = 3; 
let startY = 0;
let deltaY = 0;


const visibleItems = computed(() => {
  const extendedItems = [...props.items, ...props.items, ...props.items];
  const start = selectedIndex.value + props.items.length - Math.floor(visibleCount / 2);
  return extendedItems.slice(start, start + visibleCount);
});

//const translateY = computed(() => -Math.floor(visibleCount / 2) * itemHeight);
const translateY = 0;

const onScroll = (event) => {
  if (event.deltaY > 0) {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
  } else {
    selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length;
  }
  model.value = props.items[selectedIndex.value];
  emit('change');
};

const onTouchStart = (event) => {
  startY = event.touches[0].clientY;
  console.log("onTouchStart", startY);
};

const onTouchMove = (event) => {
  deltaY = event.touches[0].clientY - startY;
};

const onTouchEnd = () => {
  if (deltaY > 10) {
    selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length;
  } else if (deltaY < -10) {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
  }
  model.value = props.items[selectedIndex.value];
  deltaY = 0;
  this.$emit("change");
};  
</script>

<style scoped>

</style>
