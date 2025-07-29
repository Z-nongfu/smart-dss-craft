import { useState } from "react";
import { Header } from "@/components/Header";
import { ProcessFlow } from "@/components/ProcessFlow";
import { ImageDetection } from "@/components/modules/ImageDetection";
import { ManualVerification } from "@/components/modules/ManualVerification";
import { ConnectionAnalysis } from "@/components/modules/ConnectionAnalysis";
import { LineParameters } from "@/components/modules/LineParameters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  FileText, 
  Clock, 
  CheckCircle,
  Download,
  Settings2,
  Network
} from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "步骤完成",
        description: `第${currentStep}步已完成，进入第${currentStep + 1}步`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNewProject = () => {
    setCurrentStep(1);
    toast({
      title: "新建项目",
      description: "已创建新的分析项目",
    });
  };

  const handleOpenProject = () => {
    toast({
      title: "打开项目",
      description: "请选择项目文件",
    });
  };

  const handleSaveProject = () => {
    toast({
      title: "保存项目",
      description: "项目已保存成功",
    });
  };

  const handleSettings = () => {
    toast({
      title: "系统设置",
      description: "打开系统设置面板",
    });
  };

  const renderCurrentModule = () => {
    switch (currentStep) {
      case 1:
        return <ImageDetection onNext={handleNext} />;
      case 2:
        return <ManualVerification onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <ConnectionAnalysis onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <LineParameters onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <TransformerLoadModule onNext={handleNext} onPrevious={handlePrevious} />;
      case 6:
        return <ModelGeneration onPrevious={handlePrevious} />;
      default:
        return <ImageDetection onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <Header
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        onSettings={handleSettings}
      />

      {/* 主内容区域 */}
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* 流程导航 */}
        <ProcessFlow currentStep={currentStep} onStepClick={handleStepClick} />

        {/* 当前模块内容 */}
        <div className="min-h-[600px]">
          {renderCurrentModule()}
        </div>

        {/* 状态栏 */}
        <div className="bg-card border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Clock className="w-3 h-3" />
                状态：就绪
              </Badge>
              <span className="text-sm text-muted-foreground">
                当前步骤：第 {currentStep} 步 / 共 6 步
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">进度：</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {Math.round((currentStep / 6) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// 临时占位组件
const TransformerLoadModule = ({ onNext, onPrevious }: { onNext: () => void; onPrevious: () => void }) => (
  <Card className="p-6">
    <CardContent className="text-center space-y-4">
      <Zap className="w-16 h-16 text-muted-foreground mx-auto" />
      <h3 className="text-lg font-medium">变压器与负荷参数模块</h3>
      <p className="text-muted-foreground">配置变压器参数和负荷分布</p>
      <div className="flex gap-3 justify-center">
        <Button variant="ghost" onClick={onPrevious}>返回上一步</Button>
        <Button onClick={onNext} className="gap-2">
          <CheckCircle className="w-4 h-4" />
          下一步：生成模型
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ModelGeneration = ({ onPrevious }: { onPrevious: () => void }) => (
  <Card className="p-6">
    <CardContent className="text-center space-y-4">
      <FileText className="w-16 h-16 text-muted-foreground mx-auto" />
      <h3 className="text-lg font-medium">OpenDSS模型生成</h3>
      <p className="text-muted-foreground">生成标准OpenDSS仿真模型文件</p>
      <div className="flex gap-3 justify-center">
        <Button variant="ghost" onClick={onPrevious}>返回上一步</Button>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          下载模型文件
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default Index;