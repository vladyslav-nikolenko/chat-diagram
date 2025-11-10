import { ArchitectureData } from "./CloudArchitecturePlanner";
import { Building2, Layers, DollarSign, Rocket } from "lucide-react";
import { DiagramVisualization } from "./DiagramVisualization";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

interface DiagramPanelProps {
  architectureData: ArchitectureData | null;
  selectedProvider: string;
}

export function DiagramPanel({
  architectureData,
  selectedProvider,
}: DiagramPanelProps) {
  const providerNames: Record<string, string> = {
    aws: "AWS",
    azure: "Azure",
    gcp: "Google Cloud Platform",
  };

  const handleDeploy = () => {
    toast.success(
      "Deployment initiated! Your architecture is being deployed to " +
        providerNames[selectedProvider],
      {
        description:
          "This may take a few minutes. You'll receive a notification when complete.",
      }
    );
  };

  return (
    <div className='h-full flex flex-col bg-white'>
      {/* Header */}
      <div
        className='border-b border-slate-200 bg-gradient-to-r from-[#ff9a6e] to-[#ff7a4d] text-white px-6'
        style={{ paddingTop: "8px", paddingBottom: "8px" }}
      >
        <div className='flex items-center gap-3'>
          <Building2 className='w-5 h-5' />
          <div>
            <h1 className='text-base font-semibold'>
              Cloud Architecture Diagram
            </h1>
            <p className='text-xs text-orange-100 mt-0.5'>
              {providerNames[selectedProvider]} • Real-time Visualization
            </p>
          </div>
        </div>
      </div>

      {/* Diagram Area */}
      <div className='flex-1 relative overflow-hidden' style={{ minHeight: 0 }}>
        {architectureData ? (
          <DiagramVisualization
            architectureData={architectureData}
            selectedProvider={selectedProvider}
          />
        ) : (
          <div className='h-full flex items-center justify-center bg-slate-50'>
            <div className='text-center px-6'>
              <Layers
                className='w-16 h-16 mx-auto mb-4'
                style={{ color: "#ff9a6e" }}
              />
              <h2 className='text-xl font-semibold text-slate-700 mb-2'>
                Architecture Diagram
              </h2>
              <p className='text-base text-slate-600 max-w-md'>
                Your architecture diagram will appear here after you describe
                your requirements in the chat.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {architectureData && (
        <div className='border-t border-slate-200 bg-white px-6 py-4'>
          <div className='flex items-center gap-3'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' className='flex-1'>
                  <DollarSign className='w-4 h-4 mr-2' />
                  View Pricing
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-lg max-h-[85vh] flex flex-col'>
                <DialogHeader>
                  <DialogTitle>Estimated monthly cost</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col flex-1 min-h-0'>
                  {/* Pricing List - Scrollable */}
                  <div className='space-y-0 mb-4 overflow-y-auto max-h-[50vh] pr-2'>
                    {architectureData.pricing.map((item, index) => (
                      <div
                        key={index}
                        className='flex items-start justify-between py-2 border-b border-slate-100 last:border-b-0'
                      >
                        <div className='flex-1'>
                          <p className='text-sm text-slate-900'>
                            {item.service}
                          </p>
                          <p className='text-xs text-slate-500'>
                            {item.description}
                          </p>
                        </div>
                        <span className='text-sm text-slate-900 ml-4 flex-shrink-0'>
                          {item.cost}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total - Fixed at bottom */}
                  <div className='flex items-center justify-between pt-4 border-t-2 border-slate-200'>
                    <span className='text-slate-900'>Total</span>
                    <span className='text-lg text-blue-600'>
                      {architectureData.totalCost}
                    </span>
                  </div>

                  {/* Disclaimer */}
                  <p className='text-xs text-slate-400 mt-4'>
                    Region: US East (N. Virginia). Numbers are illustrative,
                    real bills depend on usage, region, and discounts.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleDeploy}
              className='flex-1 bg-gradient-to-r from-[#ff9a6e] to-[#ff7a4d] hover:from-[#ff8a5e] hover:to-[#ff6a3d]'
            >
              <Rocket className='w-4 h-4 mr-2' />
              Deploy Architecture
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
