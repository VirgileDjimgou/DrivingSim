/**
 * VehicleSimulator Component
 * Main 3D simulation component with complete vehicle system
 */
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { App } from '../App';
import assets from '../../public/assets/assets';

export default defineComponent({
  name: 'VehicleSimulator',
  setup() {
    const canvasContainer = ref<HTMLDivElement>();
    let app: App | null = null;

    const initSimulation = () => {
      if (!canvasContainer.value) return;

      try {
        // Initialize the complete vehicle simulation
        app = new App(canvasContainer.value, assets);
        app.greeting();
        app.action();
        
        console.log('Vehicle simulation started successfully');
      } catch (error) {
        console.error('Failed to initialize simulation:', error);
      }
    };

    onMounted(() => {
      setTimeout(initSimulation, 100);
    });

    onUnmounted(() => {
      if (app) {
        app.stop();
      }
    });

    return {
      canvasContainer
    };
  }
});
