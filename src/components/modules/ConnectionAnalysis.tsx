import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Network, ArrowLeft, Settings2, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface DetectionResult {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  id: string;
  verified?: boolean;
  corrected?: boolean;
}

interface ConnectionAnalysisProps {
  onNext: () => void;
  onPrevious: () => void;
}

// 模拟从人工校验步骤传来的元件数据
const mockDetectionResults: DetectionResult[] = [
  { class: "电源", confidence: 0.96, bbox: [50, 100, 120, 140], id: "s1", verified: true },
  { class: "变压器", confidence: 0.95, bbox: [100, 150, 200, 250], id: "t1", verified: true },
  { class: "断路器", confidence: 0.88, bbox: [300, 200, 350, 280], id: "b1", verified: true },
  { class: "节点", confidence: 0.92, bbox: [450, 180, 470, 200], id: "n1", verified: true },
  { class: "PT变压器", confidence: 0.83, bbox: [500, 300, 580, 350], id: "pt1", verified: true },
  { class: "开关", confidence: 0.79, bbox: [250, 350, 290, 380], id: "sw1", verified: true }
];

const componentColors = {
  "电源": "#ef4444",
  "变压器": "#3b82f6", 
  "PT变压器": "#8b5cf6",
  "断路器": "#f59e0b",
  "开关": "#10b981",
  "节点": "#ec4899"
};

// 初始节点数据
const initialNodes: Node[] = [
  {
    id: 's1',
    type: 'input',
    position: { x: 100, y: 50 },
    data: { label: '电源 S1', type: '电源' },
    style: { backgroundColor: '#ef444420', borderColor: '#ef4444', borderWidth: 2 }
  },
  {
    id: 't1',
    type: 'default',
    position: { x: 300, y: 150 },
    data: { label: '变压器 T1', type: '变压器' },
    style: { backgroundColor: '#3b82f620', borderColor: '#3b82f6', borderWidth: 2 }
  },
  {
    id: 'b1',
    type: 'default',
    position: { x: 500, y: 100 },
    data: { label: '断路器 B1', type: '断路器' },
    style: { backgroundColor: '#f59e0b20', borderColor: '#f59e0b', borderWidth: 2 }
  },
  {
    id: 'n1',
    type: 'default',
    position: { x: 700, y: 50 },
    data: { label: '节点 N1', type: '节点' },
    style: { backgroundColor: '#ec489920', borderColor: '#ec4899', borderWidth: 2 }
  },
  {
    id: 'pt1',
    type: 'default',
    position: { x: 500, y: 300 },
    data: { label: 'PT变压器 PT1', type: 'PT变压器' },
    style: { backgroundColor: '#8b5cf620', borderColor: '#8b5cf6', borderWidth: 2 }
  },
  {
    id: 'sw1',
    type: 'default',
    position: { x: 300, y: 350 },
    data: { label: '开关 SW1', type: '开关' },
    style: { backgroundColor: '#10b98120', borderColor: '#10b981', borderWidth: 2 }
  }
];

// 初始连接数据
const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: 's1',
    target: 't1',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#6b7280', strokeWidth: 2 }
  },
  {
    id: 'e2',
    source: 't1',
    target: 'b1',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#6b7280', strokeWidth: 2 }
  },
  {
    id: 'e3',
    source: 'b1',
    target: 'n1',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#6b7280', strokeWidth: 2 }
  },
  {
    id: 'e4',
    source: 't1',
    target: 'pt1',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#6b7280', strokeWidth: 2 }
  },
  {
    id: 'e5',
    source: 'sw1',
    target: 'pt1',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: '#6b7280', strokeWidth: 2 }
  }
];

export const ConnectionAnalysis = ({ onNext, onPrevious }: ConnectionAnalysisProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [autoAnalyzing, setAutoAnalyzing] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // 模拟图片URL
  const imageUrl = "/lovable-uploads/8a7707f8-31a0-4b32-a8ae-a45e9ddf5e66.png";

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#6b7280', strokeWidth: 2 }
    }, eds)),
    [setEdges],
  );

  const handleAutoAnalyze = () => {
    setAutoAnalyzing(true);
    // 模拟自动分析过程
    setTimeout(() => {
      setAutoAnalyzing(false);
    }, 2000);
  };

  const handleDeleteEdge = (edgeId: string) => {
    setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(selectedNode === node.id ? null : node.id);
  }, [selectedNode]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    handleDeleteEdge(edge.id);
  }, []);

  const connectionCount = edges.length;
  const nodeCount = nodes.length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* 左侧工具面板 */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            连接分析工具
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 分析统计 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>检测元件数：</span>
              <Badge variant="outline">{nodeCount}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>连接关系数：</span>
              <Badge variant="outline" className="bg-accent text-accent-foreground">
                {connectionCount}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>分析状态：</span>
              <Badge variant="outline" className="bg-primary text-primary-foreground">
                {autoAnalyzing ? "分析中..." : "已完成"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* 自动分析 */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">自动分析</h4>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleAutoAnalyze}
              disabled={autoAnalyzing}
            >
              <RefreshCw className={`w-4 h-4 ${autoAnalyzing ? 'animate-spin' : ''}`} />
              {autoAnalyzing ? "分析中..." : "重新分析连接"}
            </Button>
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

          {/* 连接操作提示 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">操作提示</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• 拖拽节点改变位置</p>
              <p>• 从节点拖出连线创建连接</p>
              <p>• 点击连线可删除连接</p>
              <p>• 点击节点查看详细信息</p>
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
              返回人工校验
            </Button>
            
            <Button 
              onClick={onNext} 
              className="w-full gap-2"
            >
              <Settings2 className="w-4 h-4" />
              下一步：线路参数
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 中间原始图片区域 */}
      <Card className="xl:col-span-1.5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              原始单线图
            </span>
            <Badge variant="outline">
              {nodeCount} 个元件
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-[500px] overflow-auto border border-border">
            <div
              ref={imageRef}
              className="relative inline-block min-w-full min-h-full"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left'
              }}
            >
              <img
                src={imageUrl}
                alt="电力单线图"
                className="w-full h-auto"
                draggable={false}
              />
              
              {/* 检测框叠加 */}
              {mockDetectionResults.map((result) => {
                const [x1, y1, x2, y2] = result.bbox;
                const color = componentColors[result.class as keyof typeof componentColors] || "#6b7280";
                const isSelected = selectedNode === result.id;
                
                return (
                  <div
                    key={result.id}
                    className={`absolute border-2 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-4 ring-2 ring-primary ring-opacity-50' : 'border-2'
                    }`}
                    style={{
                      left: x1,
                      top: y1,
                      width: x2 - x1,
                      height: y2 - y1,
                      borderColor: color,
                      backgroundColor: `${color}20`
                    }}
                    onClick={() => setSelectedNode(isSelected ? null : result.id)}
                  >
                    {/* 标签 */}
                    <div
                      className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded"
                      style={{ backgroundColor: color }}
                    >
                      {result.class} {result.id}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 右侧抽象连接关系图 */}
      <Card className="xl:col-span-1.5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              网络拓扑图
            </span>
            <Badge variant="outline">
              {connectionCount} 个连接
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-[500px] border border-border rounded-b-lg">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              fitView
              attributionPosition="bottom-right"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <Controls />
              <MiniMap 
                zoomable 
                pannable 
                style={{ backgroundColor: "#f1f5f9" }}
              />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1} 
                color="#e2e8f0"
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};