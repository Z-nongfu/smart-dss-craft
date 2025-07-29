import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Network, 
  Settings2, 
  Zap, 
  FileOutput,
  CheckCircle,
  Clock,
  Circle
} from "lucide-react";

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "completed" | "current" | "pending";
}

interface ProcessFlowProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const ProcessFlow = ({ currentStep, onStepClick }: ProcessFlowProps) => {
  const steps: ProcessStep[] = [
    {
      id: 1,
      title: "图像检测",
      description: "YOLO模型元件识别",
      icon: Camera,
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "current" : "pending"
    },
    {
      id: 2,
      title: "人工校验",
      description: "元件识别结果校验",
      icon: CheckCircle,
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "current" : "pending"
    },
    {
      id: 3,
      title: "连接分析",
      description: "电气连接关系分析",
      icon: Network,
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "current" : "pending"
    },
    {
      id: 4,
      title: "线路参数设置",
      description: "线路电气参数配置",
      icon: Settings2,
      status: currentStep > 4 ? "completed" : currentStep === 4 ? "current" : "pending"
    },
    {
      id: 5,
      title: "变压器负荷参数设置",
      description: "变压器和负荷参数",
      icon: Zap,
      status: currentStep > 5 ? "completed" : currentStep === 5 ? "current" : "pending"
    },
    {
      id: 6,
      title: "生成模型",
      description: "OpenDSS模型输出",
      icon: FileOutput,
      status: currentStep > 6 ? "completed" : currentStep === 6 ? "current" : "pending"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case "current":
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-accent text-accent-foreground";
      case "current":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="p-6 bg-gradient-secondary border-0 shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">处理流程</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            步骤 {currentStep} / {steps.length}
          </Badge>
          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-primary transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative">
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-full w-full h-0.5 bg-muted z-0">
                  <div 
                    className={cn(
                      "h-full bg-gradient-primary transition-all duration-500",
                      step.status === "completed" ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
              
              {/* 步骤卡片 */}
              <div
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "relative z-10 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer",
                  "hover:shadow-lg hover:scale-105",
                  step.status === "completed" && "border-accent bg-accent/5",
                  step.status === "current" && "border-primary bg-primary/5 shadow-primary",
                  step.status === "pending" && "border-border bg-background"
                )}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    getStatusColor(step.status)
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className={cn(
                      "font-medium text-sm",
                      step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};