import { useState } from "react";
import { DiagramPanel } from "./DiagramPanel";
import { ChatPanel } from "./ChatPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ArchitectureData } from "./types";

export interface CloudProvider {
  id: string;
  name: string;
  color: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ArchitectureNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; icon: string; iconUrl?: string; description?: string };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
}

export interface PricingItem {
  service: string;
  description: string;
  cost: string;
}

export function CloudArchitecturePlanner() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! 👋 I'm your AI Cloud Architecture helper. Tell me about your project requirements, and I'll design an optimal cloud architecture for you. You can specify parameters like expected load, number of users, and choose your preferred cloud provider.",
      timestamp: new Date(),
    },
  ]);
  
  const [architectureData, setArchitectureData] = useState<ArchitectureData | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>("aws");

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60} minSize={30}>
          <DiagramPanel 
            architectureData={architectureData}
            selectedProvider={selectedProvider}
          />
        </ResizablePanel>
        <ResizableHandle className="w-1 bg-slate-300 hover:bg-[#ff9a6e] transition-colors" />
        <ResizablePanel defaultSize={40} minSize={30}>
          <ChatPanel
            messages={messages}
            setMessages={setMessages}
            setArchitectureData={setArchitectureData}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
