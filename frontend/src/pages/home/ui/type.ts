export interface ISpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

export interface ISpeechRecognition {
  lang: string
  interimResults: boolean
  onstart: () => void
  onresult: (event: ISpeechRecognitionEvent) => void
  onerror: (event: Event) => void
  onend: () => void
  start: () => void
  stop: () => void
}
