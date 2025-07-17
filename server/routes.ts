import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, type GenerationProgress } from "@shared/schema";
import { z } from "zod";

interface GenerationStream {
  id: string;
  prompt: string;
  variations: Map<string, GenerationProgress>;
  userId?: number;
}

const activeGenerations = new Map<string, GenerationStream>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time generation updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleWebSocketMessage(ws, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  function handleWebSocketMessage(ws: WebSocket, message: any) {
    switch (message.type) {
      case 'subscribe_generation':
        // Subscribe to generation updates
        ws.send(JSON.stringify({
          type: 'subscribed',
          generationId: message.generationId
        }));
        break;
    }
  }

  function broadcastGenerationUpdate(generationId: string, update: GenerationProgress) {
    if (wss.readyState === WebSocket.OPEN) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'generation_update',
            generationId,
            update
          }));
        }
      });
    }
  }

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const userId = parseInt(req.body.userId);
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const project = await storage.createProject({ ...projectData, userId });
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const updates = req.body;
      
      const project = await storage.updateProject(projectId, updates);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Code generation route
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, userId } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const generationId = Math.random().toString(36).substr(2, 9);
      const variations = new Map<string, GenerationProgress>();
      
      // Initialize 5 variations
      for (let i = 1; i <= 5; i++) {
        const variationId = `var_${i}`;
        variations.set(variationId, {
          variationId,
          status: 'pending',
          progress: 0
        });
      }

      const generation: GenerationStream = {
        id: generationId,
        prompt,
        variations,
        userId
      };

      activeGenerations.set(generationId, generation);

      // Start generation process (simulate with timeout for now)
      setTimeout(() => {
        processGeneration(generationId, broadcastGenerationUpdate);
      }, 100);

      res.json({ generationId, status: 'started' });
    } catch (error) {
      res.status(500).json({ message: "Generation failed to start" });
    }
  });

  app.get("/api/generation/:id", async (req, res) => {
    try {
      const generationId = req.params.id;
      const generation = activeGenerations.get(generationId);
      
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }

      const variationsArray = Array.from(generation.variations.values());
      res.json({
        id: generation.id,
        prompt: generation.prompt,
        variations: variationsArray
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch generation" });
    }
  });

  async function processGeneration(
    generationId: string, 
    broadcastUpdate: (id: string, update: GenerationProgress) => void
  ) {
    const generation = activeGenerations.get(generationId);
    if (!generation) return;

    // Process each variation
    for (const [variationId, progress] of generation.variations) {
      // Update status to generating
      const updatedProgress: GenerationProgress = {
        ...progress,
        status: 'generating',
        progress: 10
      };
      generation.variations.set(variationId, updatedProgress);
      broadcastUpdate(generationId, updatedProgress);

      // Simulate generation progress
      for (let p = 20; p <= 90; p += 20) {
        setTimeout(() => {
          const currentProgress = generation.variations.get(variationId);
          if (currentProgress) {
            const newProgress: GenerationProgress = {
              ...currentProgress,
              progress: p
            };
            generation.variations.set(variationId, newProgress);
            broadcastUpdate(generationId, newProgress);
          }
        }, (p - 10) * 100);
      }

      // Complete generation
      setTimeout(() => {
        const styles = ['Brutalist', 'Minimalist', 'Gradient', 'Neumorphism', 'Experimental'];
        const styleIndex = parseInt(variationId.split('_')[1]) - 1;
        
        const mockCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${styles[styleIndex]} Component</title>
    <style>
        .component {
            /* ${styles[styleIndex]} styling */
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 50vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'Arial', sans-serif;
        }
    </style>
</head>
<body>
    <div class="component">
        <h1>${generation.prompt} - ${styles[styleIndex]} Style</h1>
    </div>
</body>
</html>`;

        const finalProgress: GenerationProgress = {
          variationId,
          status: 'completed',
          progress: 100,
          code: mockCode
        };
        
        generation.variations.set(variationId, finalProgress);
        broadcastUpdate(generationId, finalProgress);
      }, 1000 + (parseInt(variationId.split('_')[1]) * 200));
    }
  }

  return httpServer;
}
