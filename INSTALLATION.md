# DrivingSim Installation and Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** version 18.0 or higher
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Edge, Safari)
- **Git** (optional, for version control)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd DrivingSim
npm install
```

This will install all required packages:

- Vue 3
- TypeScript
- Three.js
- Cannon-ES
- Bootstrap 5
- dat.GUI
- Vite

### 2. Copy Assets

**IMPORTANT**: Before running the project, you need to copy the assets from the original demo project.

Copy the following folders from `../demo/assets/` to `./public/assets/`:

- `env/` - Environment cubemaps
- `gltf/` - 3D vehicle model
- `ground/` - Terrain textures
- `head/` - Headlight flares
- `sceneBox/` - Skybox textures
- `texture/` - Miscellaneous textures

```bash
# On Windows (PowerShell)
xcopy /E /I "..\demo\assets" "public\assets"

# On macOS/Linux
cp -r ../demo/assets/* public/assets/
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173/`

## 📦 Project Status

### ✅ Completed

- Project structure setup
- Core architecture (Core, Film classes)
- Physics system (PhysicsCore, VehicleWorld)
- Base actor classes (GObject, Ground, Wheel, Body)
- Utility classes (Timer, GraphicsLoader)
- TypeScript type definitions
- Vue 3 integration
- Bootstrap 5 integration
- README and documentation

### 🚧 In Progress / To Complete

The following files need to be created to complete the project:

1. **Vehicle.ts** - Main vehicle class with full physics integration
2. **GraphicsCore.ts** - Three.js rendering engine
3. **VehicleScene.ts** - Scene setup with camera, lights
4. **UIController.ts** - dat.GUI controls
5. **VehicleFilm.ts** - Film subclass for vehicle simulation
6. **App.ts** - Top-level application manager

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run build

# Lint code (if configured)
npm run lint
```

## 📁 Asset Structure

```
public/assets/
├── env/
│   └── v1/
│       ├── px.jpg, nx.jpg
│       ├── py.jpg, ny.jpg
│       └── pz.jpg, nz.jpg
├── gltf/
│   └── amg_e63.glb
├── ground/
│   └── Tiles/
│       ├── paint-texture_21.jpg
│       ├── paint-texture_18_n.jpg
│       └── paint-texture_18_r.jpg
├── head/
│   └── flareHead.jpg
├── sceneBox/
│   └── sky3/
│       ├── px.png, nx.png
│       ├── py.png, ny.png
│       └── pz.png, nz.png
└── texture/
    └── planeBake.jpg
```

## 🐛 Troubleshooting

### TypeScript Errors

If you see TypeScript errors after installation:

```bash
npm install --save-dev @types/events
```

### Assets Not Loading

- Ensure assets are copied to `public/assets/`
- Check browser console for 404 errors
- Verify file paths in `assets.ts`

### Performance Issues

- Lower physics frequency in PhysicsCore (default: 60Hz)
- Reduce graphics quality settings
- Check browser hardware acceleration is enabled

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

## 🏗️ Completing the Project

To finish the implementation, you need to create the remaining core files. Here's the recommended order:

### 1. Complete Vehicle System

Create `Vehicle.ts` with:

- RaycastVehicle integration
- Steering, acceleration, braking logic
- Turn signals and lights
- Speed control system

### 2. Graphics System

Create `GraphicsCore.ts` with:

- Three.js renderer setup
- Asset loading integration
- Resize handling
- Animation loop

Create `VehicleScene.ts` with:

- Camera setup (OrbitControls)
- Lighting (directional, hemisphere)
- Ground and vehicle integration
- Material management

### 3. UI System

Create `UIController.ts` with:

- dat.GUI folder structure
- Parameter controls
- Real-time updates

### 4. Integration

Create `VehicleFilm.ts`:

- Extends Film class
- Connects graphics and physics
- Keyboard event handling

Create `App.ts`:

- Top-level manager
- Lifecycle coordination

### 5. Vue Integration

Update `App.vue` to:

- Initialize the simulation
- Handle canvas container
- Display loading progress

## 📖 Architecture Overview

```
App.ts (Manager)
    ↓
VehicleFilm.ts (Coordinator)
    ├─→ GraphicsCore.ts
    │      ├─→ VehicleScene.ts
    │      │      ├─→ Vehicle (Body + Wheels)
    │      │      └─→ Ground
    │      └─→ GraphicsLoader.ts
    └─→ PhysicsCore.ts
           └─→ VehicleWorld.ts
```

## 🎯 Next Steps

1. **Copy assets** from demo project
2. **Complete remaining TypeScript files** (see list above)
3. **Test the simulation** in development mode
4. **Fine-tune parameters** using dat.GUI
5. **Build for production** when ready

## 📚 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Cannon-ES GitHub](https://github.com/pmndrs/cannon-es)
- [Vue 3 Guide](https://vuejs.org/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

## ⚠️ Important Notes

1. **Assets are required** - The simulation won't work without the 3D models and textures
2. **TypeScript strict mode** - All code must be properly typed
3. **Modern browsers only** - Requires WebGL 2.0 support
4. **Performance** - Physics simulation is CPU-intensive

## 🤝 Contributing

When completing the project:

- Follow TypeScript best practices
- Add JSDoc comments to all public methods
- Keep functions small and focused
- Use meaningful variable names
- Test thoroughly before committing

## 📝 License

MIT License - Same as original project
