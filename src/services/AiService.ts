
class AiService {
  private static instance: AiService;
  private apiKey: string = "AIzaSyDO_PR2yYpJFhbyRSHp_teJSks8ESrBWhw"; // Default API key
  private graphhopperApiKey: string = "5c028556-515b-45b3-91bf-8d697aa5c114"; // GraphHopper API key
  
  private constructor() {}
  
  public static getInstance(): AiService {
    if (!AiService.instance) {
      AiService.instance = new AiService();
    }
    return AiService.instance;
  }

  public static setApiKey(key: string) {
    AiService.getInstance().apiKey = key;
  }

  public static getApiKey(): string {
    return AiService.getInstance().apiKey;
  }
  
  public static getGraphhopperApiKey(): string {
    return AiService.getInstance().graphhopperApiKey;
  }

  public static async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AiService.getInstance().apiKey}`,
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

// Export as a static service, to be used as AiService.method() rather than AiService.getInstance().method()
export default AiService;
