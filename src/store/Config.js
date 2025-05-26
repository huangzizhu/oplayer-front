import { defineStore } from "pinia";
import { reactive } from "vue";
export const useConfigStore = defineStore("config", () => {
  const mainVisualStyle = reactive({
    primaryColor: 'rgb(68, 170, 221)',
    gradientColors: ['rgba(68, 170, 221, 0.6)',
      'rgba(255, 102, 171, 0.3)',
      'rgba(0, 0, 0, 0)'
    ],
    bottom: '0px',
    width: '100vw',
    height: '120px',
    opacity: 0.90,
    mode: 'bars' // 'bars' 或 'curve'
  });

  const playerContainerStyle = reactive({
    position: 'relative',
    top: '0px',
    right: '0px',
    width: '100%',
    background: 'rgba(0, 0, 0, 0)',
    borderTop: '1px solid rgba(255, 255, 255, 0.0)',
    padding: '0px 0',
  });



  return {
    mainVisualStyle,
    playerContainerStyle,
    
  }
});