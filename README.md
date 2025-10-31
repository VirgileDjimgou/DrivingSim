# DrivingSim - Vehicle Physics Simulation

A modern, TypeScript-based vehicle simulation built with Vue 3, Three.js, and Cannon-ES.

## 🚗 Project Overview

DrivingSim is a complete rewrite of the original demo project using modern web technologies:

- **Vue 3** with Composition API
- **TypeScript** for type safety and better development experience
- **Three.js** for 3D rendering
- **Cannon-ES** for physics simulation
- **Bootstrap 5** for UI components
- **dat.GUI** for real-time parameter controls
- **Vite** for fast development and optimized builds

## 🎮 Controls

### Movement

- **W** - Forward / **S** - Brake/Reverse / **A** - Turn Left / **D** - Turn Right
- **Space** - Handbrake / **B** - Toggle handbrake lock
- **E** - Cruise control (W/S to adjust) / **F** - Fix steering angle
- **L** - Toggle headlights / **R** - Reset vehicle / **V** - Toggle UI

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

Modular, clean architecture with separation of concerns:

- `src/core/` - Engine lifecycle management
- `src/physics/` - Cannon-ES physics
- `src/graphics/` - Three.js rendering
- `src/actors/` - Game objects (Vehicle, Ground)
- `src/ui/` - dat.GUI controls
- `src/utils/` - Utilities (Loader, Timer)
- `src/types/` - TypeScript definitions

## 🚀 Features

- Realistic vehicle physics with suspension
- Multiple drive types (FWD, RWD, AWD)
- Dynamic lighting and headlights
- Turn signals and brake lights
- Heightfield terrain
- Real-time parameter tuning
- PBR materials with environment mapping

For complete documentation, see the full README in the project.
