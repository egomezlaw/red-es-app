<template>
    <div class="relative w-40 h-40 overflow-hidden top-40"
        @touchstart="onTouchStart" 
        @touchmove="onTouchMove" 
        @touchend="onTouchEnd">
      <ul 
        ref="listRef"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-transform duration-300"
        :style="{ transform: `translateY(${translateY}px)` }"
        @wheel.prevent="onScroll"
      >
        <li v-for="(month, index) in visibleMonths" :key="index" class="p-2 text-lg" :class="[index == 1 ? 'opacity-100 font-bold':'opacity-60  ']">
          {{ month }}
        </li>
      </ul>
      <div class="absolute top-1/2 left-0 right-0 h-10 bg-opacity-50 pointer-events-none"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const listRef = ref(null);
  const selectedIndex = ref(0);
  const itemHeight = 20;
  const visibleCount = 3;
  
  const visibleMonths = computed(() => {
    const extendedMonths = [...months, ...months, ...months];
    const start = selectedIndex.value + months.length - Math.floor(visibleCount / 2);
    return extendedMonths.slice(start, start + visibleCount);
  });
  
  const translateY = computed(() => -Math.floor(visibleCount / 2) * itemHeight);
  
  const onScroll = (event) => {
    if (event.deltaY > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % months.length;
    } else {
      selectedIndex.value = (selectedIndex.value - 1 + months.length) % months.length;
    }
  };

  const onTouchStart = (event) => {
     startY = event.touches[0].clientY;
    };

    const onTouchMove = (event) => {
    deltaY = event.touches[0].clientY - startY;
    };

    const onTouchEnd = () => {
    if (deltaY > 10) {
        selectedIndex.value = (selectedIndex.value - 1 + months.length) % months.length;
    } else if (deltaY < -10) {
        selectedIndex.value = (selectedIndex.value + 1) % months.length;
    }
    deltaY = 0;
    };  
  </script>
  
  <style scoped>

  </style>
  