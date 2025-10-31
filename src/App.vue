<script setup lang="ts">
/**
 * Main App Component
 * Entry point for the DrivingSim application
 */
import { ref, onMounted } from "vue";
import VehicleSimulator from "./components/VehicleSimulator.vue";

const isLoading = ref(true);
const loadingProgress = ref(0);
const errorMessage = ref<string | null>(null);

onMounted(() => {
  // Initialize application
  initializeApp();
});

async function initializeApp() {
  try {
    // Simulate initialization with slight delay for effect
    for (let i = 0; i <= 100; i += 10) {
      loadingProgress.value = i;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    isLoading.value = false;
    console.log("DrivingSim initialized successfully!");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    errorMessage.value =
      "Failed to load the simulation. Please refresh the page.";
    isLoading.value = false;
  }
}

function reloadPage() {
  window.location.reload();
}
</script>

<template>
  <div id="app-container">
    <!-- Loading Screen -->
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <h1 class="text-white mb-4">DrivingSim</h1>
        <div class="progress" style="width: 300px">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            :style="{ width: loadingProgress + '%' }"
            :aria-valuenow="loadingProgress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {{ loadingProgress }}%
          </div>
        </div>
        <p class="text-white-50 mt-3">Loading assets...</p>
      </div>
    </div>

    <!-- Error Screen -->
    <div v-else-if="errorMessage" class="error-screen">
      <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Error!</h4>
        <p>{{ errorMessage }}</p>
        <hr />
        <button class="btn btn-danger" @click="reloadPage">Reload Page</button>
      </div>
    </div>

    <!-- Main Application -->
    <div v-else class="main-app">
      <VehicleSimulator />
      <div class="info-overlay">
        <h2 class="text-white">DrivingSim</h2>
        <p class="text-white-50 small">3D Vehicle Simulation</p>
        <p class="text-white-50 small">Controls coming soon...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.loading-screen,
.error-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-content {
  text-align: center;
}

.error-screen {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2rem;
}

.main-app {
  width: 100%;
  height: 100%;
  position: relative;
}

.info-overlay {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  pointer-events: none;
}

.info-overlay h2 {
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin-bottom: 0.5rem;
}

.info-overlay p {
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
</style>
