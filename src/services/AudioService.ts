
class AudioService {
  private static instance: AudioService;
  private alertSound: HTMLAudioElement | null = null;

  private constructor() {
    // Create audio element for emergency alerts
    if (typeof window !== 'undefined') {
      this.alertSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      this.alertSound.volume = 0.7;
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public playEmergencyAlert(durationInSeconds: number = 5): void {
    if (!this.alertSound) return;
    
    // Stop any already playing sound
    this.alertSound.pause();
    this.alertSound.currentTime = 0;
    
    // Play the sound
    this.alertSound.play().catch(err => {
      console.error("Failed to play emergency alert sound:", err);
    });
    
    // Stop after specified duration
    setTimeout(() => {
      if (this.alertSound) {
        this.alertSound.pause();
        this.alertSound.currentTime = 0;
      }
    }, durationInSeconds * 1000);
  }
}

export default AudioService.getInstance();
