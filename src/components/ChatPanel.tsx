import { useState, useRef, useEffect } from "react";
import { Message, ArchitectureData } from "./CloudArchitecturePlanner";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Send, User, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { generateMockArchitecture } from "../utils/mockArchitecture";
import aiAssistantIcon from "figma:asset/876d10c7ac11789ece817be7e9397640e2c93a0b.png";

interface ChatPanelProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setArchitectureData: (data: ArchitectureData) => void;
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
}

export function ChatPanel({
  messages,
  setMessages,
  setArchitectureData,
  selectedProvider,
  setSelectedProvider,
}: ChatPanelProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expectedLoad, setExpectedLoad] = useState("");
  const [avgUsers, setAvgUsers] = useState("");
  const [storageNeeds, setStorageNeeds] = useState("");
  const [region, setRegion] = useState("us-east-1");
  const [hasGeneratedArchitecture, setHasGeneratedArchitecture] =
    useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsGenerating(true);

    // Auto-close config panel on first message
    if (messages.length === 0) {
      setIsConfigOpen(false);
    }

    // Simulate AI processing
    setTimeout(() => {
      // Check if this is the first architecture generation request
      const shouldGenerateArchitecture = !hasGeneratedArchitecture;

      let assistantMessage: Message;

      if (shouldGenerateArchitecture) {
        const architectureData = generateMockArchitecture(
          selectedProvider,
          expectedLoad,
          avgUsers,
          storageNeeds
        );
        setArchitectureData(architectureData);
        setHasGeneratedArchitecture(true);

        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I've generated a cloud architecture based on your requirements:\n\n• **Cloud Provider**: ${selectedProvider.toUpperCase()}\n• **Expected Load**: ${
            expectedLoad || "Standard"
          }\n• **Average Users**: ${
            avgUsers || "Not specified"
          }\n• **Storage Needs**: ${
            storageNeeds || "Standard"
          }\n• **Region**: ${region}\n\nThe architecture includes:\n${architectureData.nodes
            .map((n) => `- ${n.data.label}`)
            .join("\n")}\n\nEstimated monthly cost: **${
            architectureData.totalCost
          }**\n\nThe diagram on the left shows how these services connect. You can view detailed pricing or deploy the architecture using the buttons below the diagram. Feel free to ask me any questions!`,
          timestamp: new Date(),
        };
      } else {
        // Generate a helpful response for follow-up questions
        assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateFollowUpResponse(inputMessage, selectedProvider),
          timestamp: new Date(),
        };
      }

      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const generateFollowUpResponse = (
    question: string,
    provider: string
  ): string => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("cost") ||
      lowerQuestion.includes("price") ||
      lowerQuestion.includes("pricing")
    ) {
      return "You can view the detailed cost breakdown by clicking the 'View Pricing' button below the diagram. The pricing includes estimates for all services in your architecture. Keep in mind these are estimates and actual costs may vary based on usage.";
    }

    if (lowerQuestion.includes("scale") || lowerQuestion.includes("scaling")) {
      return "This architecture is designed to scale automatically. The auto-scaling groups and serverless components will adjust based on demand. You can modify the scaling parameters in the configuration panel if you need different thresholds.";
    }

    if (
      lowerQuestion.includes("security") ||
      lowerQuestion.includes("secure")
    ) {
      return "The architecture includes several security best practices: IAM for access control, Cognito for authentication, and VPC isolation for containers. I recommend enabling encryption at rest for databases and in-transit encryption for all data transfers.";
    }

    if (
      lowerQuestion.includes("deploy") ||
      lowerQuestion.includes("deployment")
    ) {
      return (
        "To deploy this architecture, click the 'Deploy Architecture' button below the diagram. This will initiate the deployment process to your " +
        provider.toUpperCase() +
        " account. Make sure you have the necessary credentials configured."
      );
    }

    if (
      lowerQuestion.includes("change") ||
      lowerQuestion.includes("modify") ||
      lowerQuestion.includes("update")
    ) {
      return "You can modify the architecture by adjusting the configuration parameters in the panel above, or you can describe the changes you'd like to make and I'll help you update the design.";
    }

    return "I'm here to help! You can ask me about costs, scaling, security, deployment, or any modifications you'd like to make to the architecture. What would you like to know more about?";
  };

  return (
    <div className='h-full flex flex-col bg-white'>
      {/* Header */}
      <div
        className='border-b border-slate-200 bg-gradient-to-r from-[#ff9a6e] to-[#ff7a4d] text-white px-6'
        style={{ paddingTop: "8px", paddingBottom: "8px" }}
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-5 h-5' />
          <div>
            <h2 className='text-base font-semibold'>
              AI Architecture Assistant
            </h2>
            <p className='text-xs text-orange-100 mt-0.5'>
              Powered by intelligent cloud planning
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <div className='border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-3'>
          <CollapsibleTrigger asChild>
            <Button
              variant='ghost'
              className='w-full flex items-center justify-between p-2 hover:bg-slate-100 rounded-md'
            >
              <h3 className='text-sm text-slate-700'>
                Configuration Parameters
              </h3>
              {isConfigOpen ? (
                <ChevronUp className='w-4 h-4 text-slate-500' />
              ) : (
                <ChevronDown className='w-4 h-4 text-slate-500' />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className='border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <Label htmlFor='provider' className='text-xs text-slate-600'>
                  Cloud Provider
                </Label>
                <Select
                  value={selectedProvider}
                  onValueChange={setSelectedProvider}
                >
                  <SelectTrigger id='provider' className='mt-1 h-9'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='aws'>Amazon Web Services</SelectItem>
                    <SelectItem value='azure'>Microsoft Azure</SelectItem>
                    <SelectItem value='gcp'>Google Cloud Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='region' className='text-xs text-slate-600'>
                  Region
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger id='region' className='mt-1 h-9'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='us-east-1'>
                      US East (N. Virginia)
                    </SelectItem>
                    <SelectItem value='us-west-2'>US West (Oregon)</SelectItem>
                    <SelectItem value='eu-west-1'>EU (Ireland)</SelectItem>
                    <SelectItem value='ap-southeast-1'>
                      Asia Pacific (Singapore)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='load' className='text-xs text-slate-600'>
                  Expected Load
                </Label>
                <Input
                  id='load'
                  placeholder='e.g., 10k req/min'
                  value={expectedLoad}
                  onChange={(e) => setExpectedLoad(e.target.value)}
                  className='mt-1 h-9'
                />
              </div>
              <div>
                <Label htmlFor='users' className='text-xs text-slate-600'>
                  Avg. Concurrent Users
                </Label>
                <Input
                  id='users'
                  placeholder='e.g., 5000'
                  value={avgUsers}
                  onChange={(e) => setAvgUsers(e.target.value)}
                  className='mt-1 h-9'
                />
              </div>
              <div className='col-span-2'>
                <Label htmlFor='storage' className='text-xs text-slate-600'>
                  Storage Requirements
                </Label>
                <Input
                  id='storage'
                  placeholder='e.g., 500GB, High I/O'
                  value={storageNeeds}
                  onChange={(e) => setStorageNeeds(e.target.value)}
                  className='mt-1 h-9'
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto px-6 py-4'>
        <div className='space-y-4'>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                  <img
                    src={aiAssistantIcon}
                    alt='AI Assistant'
                    className='w-full h-full object-cover'
                  />
                </div>
              )}
              <Card
                className={`max-w-[80%] px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[#ff9a6e] text-white border-[#ff9a6e]"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div
                  className={`text-sm whitespace-pre-wrap ${
                    message.role === "user" ? "text-white" : "text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-orange-100"
                      : "text-slate-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </Card>
              {message.role === "user" && (
                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-[#ff9a6e] to-[#ff7a4d] flex items-center justify-center flex-shrink-0'>
                  <User className='w-5 h-5 text-white' />
                </div>
              )}
            </div>
          ))}
          {isGenerating && (
            <div className='flex gap-3'>
              <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                <img
                  src={aiAssistantIcon}
                  alt='AI Assistant'
                  className='w-full h-full object-cover'
                />
              </div>
              <Card className='max-w-[80%] px-4 py-3 bg-slate-50 border-slate-200'>
                <div className='flex gap-1'>
                  <div
                    className='w-2 h-2 rounded-full bg-slate-400 animate-bounce'
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className='w-2 h-2 rounded-full bg-slate-400 animate-bounce'
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className='w-2 h-2 rounded-full bg-slate-400 animate-bounce'
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className='border-t border-slate-200 bg-white px-6 py-4'>
        <div className='flex gap-3'>
          <Textarea
            placeholder={
              hasGeneratedArchitecture
                ? "Ask me anything about your architecture..."
                : "Describe your project requirements... (e.g., 'I need a scalable web application with user authentication and file storage')"
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isGenerating}
            className='resize-none'
            rows={3}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isGenerating}
            className='h-auto bg-gradient-to-r from-[#ff9a6e] to-[#ff7a4d] hover:from-[#ff8a5e] hover:to-[#ff6a3d]'
          >
            <Send className='w-5 h-5' />
          </Button>
        </div>
        <p className='text-xs text-slate-400 mt-2'>
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
