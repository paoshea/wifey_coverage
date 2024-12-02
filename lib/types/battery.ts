export interface BatteryConfig {
  minBatteryLevel: number;  // Minimum battery level to continue tracking (0-100)
  stopTrackingOnLowBattery: boolean;  // Whether to stop tracking when battery is low
  lowBatteryThreshold: number;  // Battery level considered "low" (0-100)
  reducedFrequencyOnLowBattery?: boolean;  // Whether to reduce tracking frequency on low battery
  lowBatteryUpdateInterval?: number;  // Update interval in ms when battery is low
}

export interface BatteryStatus {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}
