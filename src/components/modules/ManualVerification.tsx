import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Eye, Edit, Trash2, Plus, Network, ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";

interface DetectionResult {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  id: string;
  verified?: boolean;
  corrected?: boolean;
}

interface ManualVerificationProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ManualVerification = ({ onNext, onPrevious }: ManualVerificationProps) => {
  // 模拟从上一步传来的检测结果
  const [results, setResults] = useState<DetectionResult[]>([
    {
      class: "变压器",
      confidence: 0.95,
      bbox: [100, 150, 200, 250],
      id: "t1",
      verified: false
    },
    {
      class: "断路器",
      confidence: 0.88,
      bbox: [300, 200, 350, 280],
      id: "b1",
      verified: false
    },
    {
      class: "节点",
      confidence: 0.92,
      bbox: [450, 180, 470, 200],
      id: "n1",
      verified: false
    },
    {
      class: "电源",
      confidence: 0.96,
      bbox: [50, 100, 120, 140],
      id: "s1",
      verified: false
    },
    {
      class: "PT变压器",
      confidence: 0.83,
      bbox: [500, 300, 580, 350],
      id: "pt1",
      verified: false
    },
    {
      class: "开关",
      confidence: 0.79,
      bbox: [250, 350, 290, 380],
      id: "sw1",
      verified: false
    }
  ]);

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [newComponentType, setNewComponentType] = useState("变压器");
  const imageRef = useRef<HTMLDivElement>(null);

  // 模拟图片URL
  const imageUrl = "/lovable-uploads/8a7707f8-31a0-4b32-a8ae-a45e9ddf5e66.png";

  const componentTypes = [
    "电源",
    "变压器",
    "PT变压器", 
    "断路器",
    "开关",
    "节点"
  ];

  const componentColors = {
    "电源": "#ef4444",
    "变压器": "#3b82f6", 
    "PT变压器": "#8b5cf6",
    "断路器": "#f59e0b",
    "开关": "#10b981",
    "节点": "#ec4899"
  };

  const handleVerify = (id: string) => {
    setResults(prev => prev.map(result => 
      result.id === id ? { ...result, verified: true } : result
    ));
  };

  const handleCorrectType = (id: string, newType: string) => {
    setResults(prev => prev.map(result => 
      result.id === id ? { 
        ...result, 
        class: newType, 
        corrected: true,
        verified: true 
      } : result
    ));
  };

  const handleDelete = (id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
  };

  const handleVerifyAll = () => {
    setResults(prev => prev.map(result => ({ ...result, verified: true })));
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingComponent) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    const newResult: DetectionResult = {
      id: `manual_${Date.now()}`,
      class: newComponentType,
      confidence: 1.0,
      bbox: [x - 25, y - 25, x + 25, y + 25],
      verified: false,
      corrected: true
    };
    
    setResults(prev => [...prev, newResult]);
    setIsAddingComponent(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));

  const verifiedCount = results.filter(r => r.verified).length;
  const correctedCount = results.filter(r => r.corrected).length;
  const allVerified = results.length > 0 && verifiedCount === results.length;

  const getStatusBadge = (result: DetectionResult) => {
    if (result.verified && result.corrected) {
      return <Badge variant="outline" className="bg-warning text-warning-foreground">已修正</Badge>;
    }
    if (result.verified) {
      return <Badge variant="outline" className="bg-accent text-accent-foreground">已验证</Badge>;
    }
    return <Badge variant="outline" className="bg-muted text-muted-foreground">待验证</Badge>;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* 左侧工具面板 */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            人工校验工具
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 校验统计 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>检测元件总数：</span>
              <Badge variant="outline">{results.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>已验证元件：</span>
              <Badge variant="outline" className="bg-accent text-accent-foreground">
                {verifiedCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>已修正元件：</span>
              <Badge variant="outline" className="bg-warning text-warning-foreground">
                {correctedCount}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* 添加元件工具 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">添加元件</h4>
            <div className="space-y-2">
              <Select
                value={newComponentType}
                onValueChange={setNewComponentType}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {componentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant={isAddingComponent ? "default" : "outline"}
                size="sm" 
                className="w-full gap-2"
                onClick={() => setIsAddingComponent(!isAddingComponent)}
              >
                <Plus className="w-4 h-4" />
                {isAddingComponent ? "取消添加" : "点击图片添加"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* 图像控制 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">图像控制</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center text-sm py-1">
                {Math.round(zoom * 100)}%
              </div>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* 批量操作 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">批量操作</h4>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleVerifyAll}
              disabled={allVerified}
            >
              <CheckCircle className="w-4 h-4" />
              全部验证通过
            </Button>
          </div>

          <Separator />

          {/* 校验进度 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>校验进度：</span>
              <span className="font-medium">
                {results.length > 0 ? Math.round((verifiedCount / results.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ 
                  width: `${results.length > 0 ? (verifiedCount / results.length) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          <Separator />

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              onClick={onPrevious} 
              className="w-full gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回图像检测
            </Button>
            
            <Button 
              onClick={onNext} 
              disabled={!allVerified}
              className="w-full gap-2"
            >
              <Network className="w-4 h-4" />
              下一步：连接分析
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 右侧图像区域 */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              电力单线图校验
            </span>
            <div className="flex items-center gap-2">
              {isAddingComponent && (
                <Badge variant="default" className="gap-1">
                  <Plus className="w-3 h-3" />
                  点击图片添加 {newComponentType}
                </Badge>
              )}
              <Badge variant="outline">
                {verifiedCount}/{results.length} 已验证
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-[600px] overflow-auto border border-border">
            <div
              ref={imageRef}
              className="relative inline-block min-w-full min-h-full"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                cursor: isAddingComponent ? 'crosshair' : 'default'
              }}
              onClick={handleImageClick}
            >
              <img
                src={imageUrl}
                alt="电力单线图"
                className="w-full h-auto"
                draggable={false}
              />
              
              {/* 检测框叠加 */}
              {results.map((result) => {
                const [x1, y1, x2, y2] = result.bbox;
                const color = componentColors[result.class as keyof typeof componentColors] || "#6b7280";
                
                return (
                  <div
                    key={result.id}
                    className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                      selectedComponent === result.id ? 'border-4' : 'border-2'
                    } ${result.verified ? 'opacity-80' : 'opacity-100'}`}
                    style={{
                      left: x1,
                      top: y1,
                      width: x2 - x1,
                      height: y2 - y1,
                      borderColor: color,
                      backgroundColor: `${color}20`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComponent(selectedComponent === result.id ? null : result.id);
                    }}
                  >
                    {/* 标签 */}
                    <div
                      className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded"
                      style={{ backgroundColor: color }}
                    >
                      {result.class} {result.id}
                    </div>
                    
                    {/* 删除按钮 */}
                    {selectedComponent === result.id && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(result.id);
                          setSelectedComponent(null);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 右侧元件列表 */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            检测元件列表
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-[500px] overflow-y-auto space-y-3">
            {results.map((result) => (
              <div 
                key={result.id}
                className={`p-3 border rounded-lg space-y-2 cursor-pointer transition-colors ${
                  selectedComponent === result.id 
                    ? 'bg-accent border-primary' 
                    : 'border-border hover:bg-accent/50'
                }`}
                onClick={() => setSelectedComponent(selectedComponent === result.id ? null : result.id)}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: `${componentColors[result.class as keyof typeof componentColors] || "#6b7280"}20`,
                      color: componentColors[result.class as keyof typeof componentColors] || "#6b7280"
                    }}
                  >
                    {result.class}
                  </span>
                  {getStatusBadge(result)}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  ID: {result.id}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  置信度: {(result.confidence * 100).toFixed(1)}%
                </div>

                <div className="space-y-1">
                  <Select
                    value={result.class}
                    onValueChange={(value) => handleCorrectType(result.id, value)}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {componentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerify(result.id);
                    }}
                    disabled={result.verified}
                    className="flex-1 gap-1 h-7 text-xs"
                  >
                    <CheckCircle className="w-3 h-3" />
                    验证
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(result.id);
                    }}
                    className="gap-1 h-7 text-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">暂无检测结果</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};