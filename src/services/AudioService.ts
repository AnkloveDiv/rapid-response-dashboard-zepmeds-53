
class AudioService {
  private static instance: AudioService;
  private alertSound: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  private constructor() {
    // Create audio element for emergency alerts
    if (typeof window !== 'undefined') {
      this.alertSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      this.alertSound.volume = 0.7;
      // Add event listener to track when sound has ended
      this.alertSound.addEventListener('ended', () => {
        this.isPlaying = false;
      });
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public playEmergencyAlert(durationInSeconds: number = 5): void {
    if (!this.alertSound || this.isPlaying) return;
    
    // Stop any already playing sound
    this.alertSound.pause();
    this.alertSound.currentTime = 0;
    
    // Set playing state
    this.isPlaying = true;
    
    // Play the sound
    this.alertSound.play().catch(err => {
      console.error("Failed to play emergency alert sound:", err);
      this.isPlaying = false;
    });
    
    // Stop after specified duration
    setTimeout(() => {
      if (this.alertSound) {
        this.alertSound.pause();
        this.alertSound.currentTime = 0;
        this.isPlaying = false;
      }
    }, durationInSeconds * 1000);
  }
  
  public isAlertPlaying(): boolean {
    return this.isPlaying;
  }
}

export default AudioService.getInstance();
