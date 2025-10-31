/**
 * Timer utility class
 * Provides periodic pulses for turn signals and other timed events
 */
import type { TimerPulse } from '../types';

export class Timer {
  private mainPrev: number;
  public pulseHerz: {
    _1_: TimerPulse; // 1 second pulse
    _2_: TimerPulse; // 0.5 second pulse
  };

  constructor() {
    this.mainPrev = window.performance.now();
    this.pulseHerz = {
      _1_: {
        pulse: false,
        prev: this.mainPrev
      },
      _2_: {
        pulse: false,
        prev: this.mainPrev
      }
    };
  }

  /**
   * Pre-start initialization
   */
  public preStart(): void {
    this.mainPrev = window.performance.now();
    this.pulseHerz._1_.prev = this.mainPrev;
    this.pulseHerz._2_.prev = this.mainPrev;
  }

  /**
   * Update timer pulses
   */
  public update(): void {
    this.checkHerz(500, this.pulseHerz._2_); // 2Hz (500ms)
    this.checkHerz(1000, this.pulseHerz._1_); // 1Hz (1000ms)
  }

  /**
   * Check if the specified time has elapsed and set pulse
   * @param time - Time interval in milliseconds
   * @param herz - Pulse object to update
   */
  private checkHerz(time: number, herz: TimerPulse): void {
    if (window.performance.now() - herz.prev >= time) {
      herz.prev = window.performance.now();
      herz.pulse = true;
    } else {
      herz.pulse = false;
    }
  }

  /**
   * Post-start cleanup
   */
  public postStart(): void {
    this.pulseHerz._1_.pulse = false;
    this.pulseHerz._2_.pulse = false;
  }

  /**
   * Stop the timer
   */
  public stop(): void {
    // Timer stop logic if needed
  }
}
