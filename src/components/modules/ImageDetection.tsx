import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Upload, Play, Eye, Settings, Cpu, Image as ImageIcon } from "lucide-react";
interface DetectionResult {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  id: string;
}
interface ImageDetectionProps {
  onNext: () => void;
}
export const ImageDetection = ({
  onNext
}: ImageDetectionProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.5]);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setResults([]);
    }
  };
  const handleStartDetection = async () => {
    if (!imageFile) return;
    setIsProcessing(true);
    setProgress(0);

    // 模拟检测过程
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          // 模拟检测结果
          setResults([{
            class: "变压器",
            confidence: 0.95,
            bbox: [100, 150, 200, 250],
            id: "t1"
          }, {
            class: "断路器",
            confidence: 0.88,
            bbox: [300, 200, 350, 280],
            id: "b1"
          }, {
            class: "节点",
            confidence: 0.92,
            bbox: [450, 180, 470, 200],
            id: "n1"
          }, {
            class: "电源",
            confidence: 0.96,
            bbox: [50, 100, 120, 140],
            id: "s1"
          }, {
            class: "PT变压器",
            confidence: 0.83,
            bbox: [500, 300, 580, 350],
            id: "pt1"
          }, {
            class: "开关",
            confidence: 0.79,
            bbox: [250, 350, 290, 380],
            id: "sw1"
          }]);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-accent";
    if (confidence >= 0.8) return "bg-primary";
    if (confidence >= 0.7) return "bg-warning";
    return "bg-destructive";
  };
  const filteredResults = results.filter(r => r.confidence >= confidenceThreshold[0]);
  return <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 图像上传和设置 */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            图像输入
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 文件上传 */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                点击或拖拽上传单线图图像
              </p>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="image-upload" />
              <Button variant="outline" size="sm" onClick={() => document.getElementById('image-upload')?.click()}>
                选择文件
              </Button>
            </div>

            {imageFile && <div className="p-3 bg-primary-soft rounded-lg">
                <p className="text-sm font-medium text-foreground">{imageFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>}
          </div>

          <Separator />

          {/* 检测设置 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="font-medium text-sm">检测设置</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">置信度阈值: {confidenceThreshold[0]}</label>
                <Slider value={confidenceThreshold} onValueChange={setConfidenceThreshold} max={1} min={0.1} step={0.05} className="mt-2" />
              </div>
            </div>
          </div>

          <Separator />

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Button onClick={handleStartDetection} disabled={!imageFile || isProcessing} className="w-full gap-2">
              <Cpu className="w-4 h-4" />
              {isProcessing ? "检测中..." : "开始检测"}
            </Button>

            {isProcessing && <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  正在进行YOLO模型检测... {progress}%
                </p>
              </div>}

            {results.length > 0 && <Button variant="outline" onClick={onNext} className="w-full gap-2">
                <Eye className="w-4 h-4" />
                下一步：人工校验
              </Button>}
          </div>
        </CardContent>
      </Card>

      {/* 检测结果展示 */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              检测结果
            </span>
            {results.length > 0 && <Badge variant="outline">
                检测到 {filteredResults.length} 个元件
              </Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {imageFile ? <div className="space-y-6">
              {/* 图像预览区域 */}
              <div className="bg-muted rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                {imageFile && <img src={URL.createObjectURL(imageFile)} alt="单线图" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg" />}
              </div>

              {/* 检测结果列表 */}
              {filteredResults.length > 0}
            </div> : <div className="flex items-center justify-center h-96 text-muted-foreground">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>请先上传单线图图像</p>
              </div>
            </div>}
        </CardContent>
      </Card>
    </div>;
};