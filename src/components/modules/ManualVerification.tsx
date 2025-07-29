import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Eye, Edit, Trash2, Plus, Network, ArrowLeft } from "lucide-react";

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

  const componentTypes = [
    "变压器",
    "PT变压器", 
    "断路器",
    "开关",
    "节点",
    "电源"
  ];

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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 校验工具面板 */}
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

          {/* 批量操作 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">批量操作</h4>
            <div className="space-y-2">
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
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2"
                disabled
              >
                <Plus className="w-4 h-4" />
                手动添加元件
              </Button>
            </div>
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

      {/* 校验结果展示 */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              元件校验列表
            </span>
            <Badge variant="outline">
              {verifiedCount}/{results.length} 已验证
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div 
                key={result.id} 
                className="p-4 border border-border rounded-lg space-y-3 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">
                      ID: {result.id}
                    </span>
                    {getStatusBadge(result)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerify(result.id)}
                      disabled={result.verified}
                      className="gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      验证
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(result.id)}
                      className="gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      删除
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">元件类型</label>
                    <Select
                      value={result.class}
                      onValueChange={(value) => handleCorrectType(result.id, value)}
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
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">置信度</label>
                    <div className="h-8 px-3 border rounded-md flex items-center text-sm bg-muted">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">检测位置 (x1, y1, x2, y2)</label>
                  <div className="h-8 px-3 border rounded-md flex items-center text-sm bg-muted">
                    [{result.bbox.join(', ')}]
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无检测结果需要校验</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};