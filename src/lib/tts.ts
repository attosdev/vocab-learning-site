// Text-to-Speech functionality with fallback
export class TTSManager {
  private static instance: TTSManager
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis
      this.loadVoices()
    }
  }

  static getInstance(): TTSManager {
    if (!TTSManager.instance) {
      TTSManager.instance = new TTSManager()
    }
    return TTSManager.instance
  }

  private loadVoices() {
    if (!this.synth) return

    const loadVoicesImpl = () => {
      this.voices = this.synth!.getVoices()
    }

    loadVoicesImpl()
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoicesImpl
    }
  }

  private getEnglishVoice(): SpeechSynthesisVoice | null {
    const englishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en') && voice.localService
    )
    
    // Prefer high-quality voices
    const preferredVoices = englishVoices.filter(voice =>
      voice.name.includes('Enhanced') || 
      voice.name.includes('Premium') ||
      voice.name.includes('Neural')
    )

    return preferredVoices[0] || englishVoices[0] || this.voices[0] || null
  }

  async speakWord(text: string, audioUrl?: string): Promise<boolean> {
    // Try audio file first if available
    if (audioUrl) {
      try {
        const success = await this.playAudioFile(audioUrl)
        if (success) return true
      } catch (error) {
        console.warn('Audio file failed, falling back to TTS:', error)
      }
    }

    // Fallback to Web Speech API
    return this.speakWithTTS(text)
  }

  private playAudioFile(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const audio = new Audio(url)
      audio.onloadeddata = () => {
        audio.play()
          .then(() => resolve(true))
          .catch(() => resolve(false))
      }
      audio.onerror = () => resolve(false)
      audio.load()
    })
  }

  private speakWithTTS(text: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve(false)
        return
      }

      // Cancel any ongoing speech
      this.synth.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const voice = this.getEnglishVoice()
      
      if (voice) {
        utterance.voice = voice
      }

      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => resolve(true)
      utterance.onerror = () => resolve(false)

      this.synth.speak(utterance)
    })
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel()
    }
  }

  isSupported(): boolean {
    return !!(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang.startsWith('en'))
  }
}