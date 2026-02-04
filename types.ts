export interface SimulationParams {
  mass: number; // kg
  k: number; // N/m
  amplitude: number; // m
  phi: number; // phase constant (rad)
}

export interface PhysicsState {
  t: number; // time (s)
  x: number; // position (m)
  v: number; // velocity (m/s)
  a: number; // acceleration (m/s^2)
  f: number; // elastic force (N)
}

export interface SimulationConfig {
  showVectors: boolean;
  showMCU: boolean;
  showEnergy: boolean;
  playbackSpeed: number;
}
