## Potential systems

### Sprite Animator

Description:

- Animates sprites based on given data

Takes:

- Image or draw function
- FrameX, FrameY, MaxFrame
- X, Y
- FPS -> FrameInterval, FrameTimer, DeltaTime
- SpriteWidth, SpriteHeight
- Width, Height

### Entity Lifecycle

Description:

- Spawns and cleans up entities.
- Creates and deletes entities based on criteria:
- - Time
- - Pattern
- - Game state or other logic
- Does this include particles as well as enemies? Or just some things?

Takes:

- Spawn criteria (function)
- Deletion criteria (function)
- Entity to spawn (function)

### Powerups

Extra lives
Invulnerability for a few seconds

### Levels

Description:

- Loads and plays level spawners
- Reset & Next level functionality

### Pause

### Particle animator

## Architectural improvements

### Entity Component System (ECS) Pattern

For larger games, consider separating data (components) from logic (systems) and using entities as IDs. This makes adding new features (like powerups, status effects, etc.) much easier and more modular.

### Event System / Pub-Sub

Implement an event bus or observer pattern for decoupling game logic. For example, when the player picks up a powerup or collides with an enemy, fire an event rather than calling methods directly. This makes it easier to add effects, UI feedback, or analytics later.

### Resource/Asset Management

Centralize loading and management of images, sounds, and other assets. This can help with preloading, error handling, and swapping assets for different themes or levels.

### Game State Management

Use a state machine for the overall game state (e.g., MainMenu, Playing, Paused, GameOver, LevelComplete). This keeps update/draw logic clean and prevents bugs from state confusion.

### Separation of UI and Game Logic

Keep UI rendering and logic (menus, overlays, buttons) separate from core game logic. This makes it easier to add new UI features or port the game to other platforms.

## 2

Entity System/Inheritance Cleanup:
Ensure all game objects (player, enemies, powerups, particles) inherit from a common Entity or GameObject base class. This makes update/draw/collision logic more consistent and extensible.

Component-Based Design (optional, advanced):
For more flexibility, consider a component system (e.g., movement, render, collision components), but this is more complex and not always necessary for smaller games.

Centralized Game State Management:
Make sure all state transitions (level, pause, game over, etc.) are handled in a single place (the Game class), and that UI, input, and gameplay logic respond to state changes cleanly.

Event System:
Implement a simple event system (pub/sub or observer pattern) for decoupling systems (e.g., when the player dies, emit an event instead of directly calling game over logic).

Resource Management:
Centralize loading and management of assets (images, sounds) to avoid duplication and improve performance.

Configuration/Data-Driven Design:
Move as much configuration (enemy stats, level data, key bindings) to external JSON or JS files for easier tweaking and future expansion.

Recommended order:
Start with (1) Entity system cleanup, then (3) centralized state management, then (6) configuration/data-driven design. These will give you the most flexibility and maintainability for future features like powerups, new enemies, or UI improvements.

## Centralised game state management

Here’s a step-by-step plan for your project:

Define Game States:
Create an enum or object for all possible game states (e.g., MAIN_MENU, PLAYING, PAUSED, GAME_OVER, LEVEL_COMPLETE).

Add a gameState Property to the Game Class:
Store the current state in a single property (e.g., this.gameState).

Replace Boolean Flags:
Replace flags like this.paused, this.gameOver, this.levelComplete with checks against this.gameState.

Centralize State Transitions:
Add methods to the Game class for changing state (e.g., setGameState(newState)), and ensure all transitions go through these methods.

Update Input, UI, and Logic:
Refactor input handling, UI, and update/draw logic to respond to the current game state, using this.gameState instead of multiple flags.

(Optional) State Machine Pattern:
For more complex games, you can use a state machine class, but for your current scope, a single property and transition methods are sufficient.

## TypeScript migration

The best files to start adding types to are your core game logic files—especially those with the most TypeScript errors or that define your main classes. This will quickly reduce error noise and make the rest of the codebase easier to type.

### Recommended order:

Base classes and shared types:

GameEntity.ts (base for entities)
SpriteData.ts (used by many entities)
Any shared types/interfaces (e.g., config files)
Core game loop and state:

Main.ts (entry/game loop)
GameSession.ts (game state/session)
UI.ts (UI logic)
Entities:

Player.ts
Enemy.ts
Particles.ts
CollisionAnimation.ts
FloatingMessages.ts
Systems and state:

SpriteAnimator.ts
ParticleAnimator.ts
SpawnStrategy.ts
PlayingState.ts, GameStates.ts, etc.
UI and input:

InputHandler.ts
KeyBindings.ts
Button.ts
Data/config files:

GameConfig.ts
LevelData.ts
KeyBindingsData.ts

Tip:
Start with files that are imported by many others (base classes, config, shared types), then move to files with the most errors or that are most central to your game logic.

## Event madness - use events for everything

## Component-Based Design

For more flexibility, consider a component system (e.g., movement, render, collision components), but this is more complex and not always necessary for smaller games.

To begin introducing Component-Based Design into your game architecture, follow these steps:

1. Define a minimal Component interface or class.

Example: Each component holds data and/or logic (e.g., PositionComponent, RenderComponent, MovementComponent).
2. Refactor your base entity (e.g., GameEntity.ts) to hold a collection of components.

Entities become containers for components, not logic-heavy classes.
3. Create a simple ComponentManager or add/remove/get methods on entities.

Allow adding/removing components at runtime.
4. Start with a few simple components:

PositionComponent (x, y)
SpriteComponent (image, frame info)
MovementComponent (velocity, acceleration)
CollisionComponent (bounding box)
5. Refactor one or two entity types (e.g., Player, Enemy) to use components instead of inheritance for some behaviors.

6. Update systems (e.g., rendering, movement, collision) to operate on entities with the relevant components.

7. Iterate: Gradually migrate more logic from inheritance to components as needed.

### Notes

The CollisionSystem detects collisions and records them (e.g., by adding collision events or components to entities).

The InteractionSystem should only process the collision events or data produced by the CollisionSystem and apply game logic (score, state changes, etc.).

## Start heading towards a generic game engine foundation upon which any kind of game can be built

## Use that game engine foundation for multiple prototypes of different kinds of games

- Towers of Hanoi
- Clicker
- Pong (physics)
- ??
