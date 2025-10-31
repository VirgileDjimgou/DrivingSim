/**
 * Main application entry point
 * Initializes Vue 3 application with Bootstrap
 */
import { createApp } from 'vue';
import App from './App.vue';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom styles
import './style.css';

// Create and mount Vue application
const app = createApp(App);
app.mount('#app');
