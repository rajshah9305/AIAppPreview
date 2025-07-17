// Soul of RAJAI system prompt
export const SOUL_OF_RAJAI_PROMPT = `You are a world-class digital artist and lead frontend architect, renowned for creating award-winning, innovative web experiences. Your work is regularly featured on sites like Awwwards and FWA for its originality and flawless execution.

Your mission for this request is to interpret the user's prompt and generate one single, hyper-creative, and technically flawless variation of the requested component. This variation will be compared against four others generated under the same mission, and it is imperative that yours stands out.

Core Directives for This Variation:

1. **Radical Uniqueness:** Your primary goal is to create a variation that is profoundly different from any standard or predictable interpretation. Deliberately choose a unique layout, an unconventional interaction model, a striking and harmonious color palette, and a distinct typographic style. Do not create the "obvious" version.

2. **Aesthetic & Experiential Excellence:** The design must be 'Awwwards.com worthy'. Every detail matters—spacing, alignment, visual hierarchy, and micro-interactions must be impeccable. The user experience should be intuitive yet delightful. The design should feel intentional, polished, and premium.

3. **Technical Purity & Portability:**
   - The final output must be a single, complete, runnable HTML file.
   - All necessary HTML, CSS, and JavaScript must be included within this single file.
   - You must not use any external libraries or frameworks. This means no React, Vue, jQuery, Tailwind CSS, Bootstrap, or external font files. Use standard browser APIs and vanilla JavaScript/CSS.

Your Anti-Goal:
Avoid creating anything that looks like a common template, a generic component library, or a tutorial example. Your response will be considered a failure if it is generic. Your purpose is to defy convention and showcase a truly unique artistic and technical vision. Surprise and impress the user with your originality.`;

export interface CerebrasGenerationParams {
  prompt: string;
  apiKey: string;
  onProgress?: (progress: number) => void;
  onComplete?: (code: string) => void;
  onError?: (error: string) => void;
}

export async function generateWithCerebras({
  prompt,
  apiKey,
  onProgress,
  onComplete,
  onError
}: CerebrasGenerationParams): Promise<string> {
  try {
    // For now, we'll simulate the Cerebras API call
    // In a real implementation, you would use the Cerebras SDK here
    
    // Simulate progress updates
    const progressSteps = [10, 25, 45, 60, 75, 90, 100];
    
    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 200));
      onProgress?.(step);
    }

    // Generate mock HTML code based on the prompt
    const mockCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Component</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .component {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
            transform: perspective(1000px) rotateX(5deg);
            transition: transform 0.3s ease;
        }
        
        .component:hover {
            transform: perspective(1000px) rotateX(0deg) scale(1.02);
        }
        
        .component h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ff6b6b, #ffd93d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .component p {
            font-size: 1.1rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .floating {
            animation: float 3s ease-in-out infinite;
        }
    </style>
</head>
<body>
    <div class="component floating">
        <h1>Generated Component</h1>
        <p>This component was created based on: "${prompt}"</p>
        <p>Featuring modern glassmorphism design with 3D transforms and animations.</p>
    </div>
    
    <script>
        // Add some interactive behavior
        document.querySelector('.component').addEventListener('click', function() {
            this.style.transform = 'perspective(1000px) rotateY(180deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'perspective(1000px) rotateY(0deg) scale(1)';
            }, 600);
        });
    </script>
</body>
</html>`;

    onComplete?.(mockCode);
    return mockCode;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Generation failed';
    onError?.(errorMessage);
    throw error;
  }
}

export function validateApiKey(apiKey: string): boolean {
  // Basic validation - in real implementation, you'd validate against Cerebras API
  return apiKey.length > 0 && apiKey.startsWith('csk-');
}
