<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  text: String,
  delay: { type: Number, default: 0.5 }, // Tiempo entre cada palabra
});

const sentence = computed(() => props.text.split(" "));

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * props.delay },
  }),
};
</script>

<template>
  <div class="flex justify-center items-center h-screen bg-black text-5xl ">
    <div class="flex flex-col items-center space-y-4">
      <div class="words-container">
        <span v-for="(word, index) in sentence" 
        :key="index" 
        class="word"
        :style="{ animationDelay: `${index * 0.5}s` }"        >
        {{ word }}
      </span>
    </div>    
    <div class="mt-5 btn">
      <svg id="Capa_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 86 86" class="fill-[#DD0031] w-[86px] h-[86px]">
        <path class="cls-1" d="M43,0C19.25,0,0,19.25,0,43s19.25,43,43,43,43-19.25,43-43S66.75,0,43,0ZM66.6,44.06c-4.38,4.38-8.75,8.75-13.13,13.13-1.37,1.37-3.49-.75-2.12-2.12,3.52-3.52,7.04-7.05,10.57-10.57H20.46c-1.93,0-1.93-3,0-3h41.46c-3.52-3.52-7.05-7.05-10.57-10.57-1.37-1.37.75-3.49,2.12-2.12,4.38,4.38,8.75,8.75,13.13,13.13.57.57.57,1.55,0,2.12Z"/>
      </svg>
    </div>
  </div>
    <div class="hand">
      <img src="/images/hand.png" alt="Imagen" class="w-full h-auto rounded-lg shadow-lg"/>
  </div>
</div>
</template>

<style scoped>
.words-container {
  display: inline-flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 60%;
}

.word {
  opacity: 0;
  animation: fadeInUp   6s ease-out infinite;
  margin-right: 0.5rem;
}

.hand {
  /* animation: fadeInUp 2s ease-out infinite; */
  margin-left: -15%;

}

.btn {
  animation: scaleBounce   1s ease-in infinite;
}

@keyframes scaleBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}


@keyframes fadeInUp {
  0% {
    opacity: 0;
    /* transform: translateY(10px); */
  }
  50% {
    opacity: 1;
    /* transform: translateY(0); */
  }
  100% {
    opacity: 0;
    /* transform: translateY(-10px); */
  }
}
</style>