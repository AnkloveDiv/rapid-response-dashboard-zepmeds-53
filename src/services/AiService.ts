
class AiService {
  private static instance: AiService;
  private apiKey: string | null = null;
  
  private constructor() {}
  
  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public getApiKey(): string | null {
    return this.apiKey;
  }

  public async generateResponse(prompt: string): Promise<string> {
    if (!this.apiKey) {
      return "API key not set. Please configure your API key in the settings.";
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "Sorry, I couldn't generate a response. Please try again.";
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "An error occurred while generating a response. Please try again later.";
    }
  }
}

export default AiService.getInstance();
