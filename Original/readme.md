
# Physic vehicle simulation 

Vehicle driving application displaying the basic physical and visual properties of the vehicle. It is used as a physics engine [Cannon.js](https://schteppe.github.io/cannon.js/), for graphics - [Three.js](https://threejs.org/) . 
The world is presented by uneven surfaces and a free-flowing vehicle. Editing the properties of the physical world, scene and car in the available UI.

## Recommendations: 
- Use the scene settings to: change the environment (on / off fog mode and change fog and background color using "background"); changing the scene lighting settings.
- Depending on the desired view mode (driving, vehicle view etc.), change parameters "cameraMaxDist" and "cameraMaxAngle" at your discretion.
- In the settings of the physical world ("World") there is an opportunity to play with gravity; manage the modes of operation of both the graphical "stopAnimation" and the physical engine "pausePhysic"; change the frequency of the physical world (by default 1/60 like the graphics).
- Car settings make it possible to control: maximum traction force on wheels "maxEngineForce"; maximum braking force "maxBreakForce"; friction between the wheel and the surface; select the type of drive. The settings for headlights, suspension and materials are also available in the corresponding sections.

## Functions:
1. Object controls (WASD);
2. Space - handbrake;
3. B - set/reset handbrake;
4. E - turn on/off cruise control (Activate speed control where "W" - add, "S" - subtract speed;
5. F - fix/unfix current steering angle; 
6. L - turn on/off headlights;
7. R - reset vehicle;
8. V - visible/invisible ui

# Demo 
 <p align="center">
<img src="/gif/intro.gif" width="80%" height="80%"></p>
<h2 align="center"><a  href="https://physical-vehicle.netlify.app">DEMO</a></h2>
 
# Usage 
From root project install modules:

    npm run install
    
To run dev server use: 

    npm run start

# Structure 
Application flow chart:
 <p align="center">
<img src="/gif/vehicleFlow.png" width="100%" height="100%"></p>

# Docs 

- [Three.js](https://threejs.org/) 
- [Cannon.js](https://schteppe.github.io/cannon.js/)
