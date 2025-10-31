/**
 * Core base class for lifecycle management
 * Provides animation loop and lifecycle methods for the application
 */
export abstract class Core {
  protected name: string;
  protected processId: number | null = null;

  constructor(name: string = '') {
    this.name = name;
  }

  /**
   * Greeting message for debugging
   */
  public greeting(): void {
    console.log(`Hi! I am ${this.name} =)))`);
  }

  /**
   * Initialize the core system
   */
  public abstract init(): void;

  /**
   * Pre-start initialization before the animation loop
   */
  public abstract preStart(): void;

  /**
   * Start the animation loop
   */
  public run(): void {
    this.preStart();
    this.cycle();
  }

  /**
   * Animation cycle using requestAnimationFrame
   */
  protected cycle(): void {
    this.update();
    this.processId = requestAnimationFrame(() => {
      this.cycle();
    });
  }

  /**
   * Update method called every frame
   */
  public abstract update(dt?: number): void;

  /**
   * Post-start cleanup and finalization
   */
  public abstract postStart(): void;

  /**
   * Stop the animation loop
   */
  public stop(): void {
    this.postStart();
    if (this.processId !== null) {
      cancelAnimationFrame(this.processId);
    }
  }

  /**
   * Get the name of this core instance
   */
  public getName(): string {
    return this.name;
  }
}
