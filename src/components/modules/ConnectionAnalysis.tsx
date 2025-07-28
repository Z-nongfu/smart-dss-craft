import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Network, 
  Zap, 
  Edit3, 
  Eye, 
  Play,
  GitBranch,
  ArrowRight 
} from "lucide-react";

interface Connection {
  id: string;
  from: string;
  to: string;
  fromType: string;
  toType: string;
  busName: string;
  confidence: number;
}

interface ConnectionAnalysisProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ConnectionAnalysis = ({ onNext, onPrevious }: ConnectionAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // 模拟连接数据
  const mockConnections: Connection[] = [
    { id: "c1", from: "电源_s1", to: "断路器_b1", fromType: "电源", toType: "断路器", busName: "母线_001", confidence: 0.95 },
    { id: "c2", from: "断路器_b1", to: "变压器_t1", fromType: "断路器", toType: "变压器", busName: "母线_002", confidence: 0.92 },
    { id: "c3", from: "变压器_t1", to: "节点_n1", fromType: "变压器", toType: "节点", busName: "母线_003", confidence: 0.88 },
    { id: "c4", from: "节点_n1", to: "PT变压器_pt1", fromType: "节点", toType: "PT变压器", busName: "母线_004", confidence: 0.85 },
    { id: "c5", from: "节点_n1", to: "开关_sw1", fromType: "节点", toType: "开关", busName: "母线_005", confidence: 0.90 }
  ];

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    
    // 模拟分析过程
    setTimeout(() => {
      setConnections(mockConnections);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-accent";
    if (confidence >= 0.8) return "text-primary";
    return "text-warning";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "电源": "bg-accent/10 text-accent",
      "变压器": "bg-primary/10 text-primary",
      "断路器": "bg-warning/10 text-warning",
      "节点": "bg-secondary text-secondary-foreground",
      "PT变压器": "bg-purple-100 text-purple-700",
      "开关": "bg-orange-100 text-orange-700"
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* 分析控制面板 */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            连接分析
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 分析状态 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">分析状态</span>
              <Badge variant={connections.length > 0 ? "default" : "outline"}>
                {connections.length > 0 ? "已完成" : "待分析"}
              </Badge>
            </div>

            {connections.length > 0 && (
              <div className="p-3 bg-primary-soft rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>检测到连接</span>
                  <span className="font-medium">{connections.length} 个</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>生成母线</span>
                  <span className="font-medium">{new Set(connections.map(c => c.busName)).size} 个</span>
                </div>
              </div>
            )}
          </div>

          {/* 分析算法说明 */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              分析算法
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• 基于几何位置的连接推理</p>
              <p>• 最小生成树算法优化</p>
              <p>• 母线自动命名生成</p>
              <p>• 连接置信度评估</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || connections.length > 0}
              className="w-full gap-2"
            >
              <Play className="w-4 h-4" />
              {isAnalyzing ? "分析中..." : "开始连接分析"}
            </Button>

            {connections.length > 0 && (
              <Button
                variant="outline"
                onClick={onNext}
                className="w-full gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                下一步：线路参数
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={onPrevious}
              className="w-full"
            >
              返回上一步
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 连接结果展示 */}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              连接关系图
            </span>
            {connections.length > 0 && (
              <Badge variant="outline">
                {connections.length} 个连接
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connections.length > 0 ? (
            <div className="space-y-6">
              {/* 网络拓扑可视化区域 */}
              <div className="bg-muted rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">网络拓扑图可视化</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    显示元件连接关系和母线结构
                  </p>
                </div>
              </div>

              {/* 连接关系列表 */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">连接关系详情</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>起始元件</TableHead>
                        <TableHead>目标元件</TableHead>
                        <TableHead>母线名称</TableHead>
                        <TableHead>置信度</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connections.map((connection) => (
                        <TableRow 
                          key={connection.id}
                          className={selectedConnection === connection.id ? "bg-muted" : ""}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getTypeColor(connection.fromType)}>
                                {connection.fromType}
                              </Badge>
                              <span className="text-sm">{connection.from}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getTypeColor(connection.toType)}>
                                {connection.toType}
                              </Badge>
                              <span className="text-sm">{connection.to}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{connection.busName}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${getConfidenceColor(connection.confidence)}`}>
                              {(connection.confidence * 100).toFixed(1)}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedConnection(
                                selectedConnection === connection.id ? null : connection.id
                              )}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              <div className="text-center">
                <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>点击"开始连接分析"进行元件连接关系分析</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};