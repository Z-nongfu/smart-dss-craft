import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  Settings2, 
  Cable, 
  Edit, 
  Save,
  ArrowRight,
  Copy,
  Zap
} from "lucide-react";

interface LineParameter {
  id: string;
  from: string;
  to: string;
  length: number;
  type: string;
  r1: number; // 正序阻抗实部
  x1: number; // 正序阻抗虚部
  r0: number; // 零序阻抗实部
  x0: number; // 零序阻抗虚部
  c1: number; // 正序电容
  c0: number; // 零序电容
  ampacity: number; // 载流量
}

interface LineParametersProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const LineParameters = ({ onNext, onPrevious }: LineParametersProps) => {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [lineParams, setLineParams] = useState<LineParameter[]>([
    {
      id: "line1",
      from: "母线_001",
      to: "母线_002",
      length: 1.5,
      type: "架空线",
      r1: 0.0648,
      x1: 0.3378,
      r0: 0.2580,
      x0: 1.0170,
      c1: 13.5,
      c0: 9.5,
      ampacity: 400
    },
    {
      id: "line2", 
      from: "母线_002",
      to: "母线_003",
      length: 2.0,
      type: "电缆",
      r1: 0.0324,
      x1: 0.0845,
      r0: 0.0972,
      x0: 0.2535,
      c1: 280,
      c0: 230,
      ampacity: 600
    },
    {
      id: "line3",
      from: "母线_003", 
      to: "母线_004",
      length: 0.8,
      type: "架空线",
      r1: 0.0648,
      x1: 0.3378,
      r0: 0.2580,
      x0: 1.0170,
      c1: 13.5,
      c0: 9.5,
      ampacity: 400
    }
  ]);

  const lineTypes = [
    { value: "架空线", label: "架空线" },
    { value: "电缆", label: "电缆" },
    { value: "母线", label: "母线" }
  ];

  const lineTemplates = {
    "架空线_10kV": { r1: 0.0648, x1: 0.3378, r0: 0.2580, x0: 1.0170, c1: 13.5, c0: 9.5, ampacity: 400 },
    "电缆_10kV": { r1: 0.0324, x1: 0.0845, r0: 0.0972, x0: 0.2535, c1: 280, c0: 230, ampacity: 600 },
    "母线_10kV": { r1: 0.0100, x1: 0.0500, r0: 0.0300, x0: 0.1500, c1: 500, c0: 400, ampacity: 1000 }
  };

  const updateLineParameter = (lineId: string, field: keyof LineParameter, value: number | string) => {
    setLineParams(prev => prev.map(line => 
      line.id === lineId ? { ...line, [field]: value } : line
    ));
  };

  const applyTemplate = (lineId: string, templateKey: string) => {
    const template = lineTemplates[templateKey as keyof typeof lineTemplates];
    if (template) {
      setLineParams(prev => prev.map(line => 
        line.id === lineId ? { ...line, ...template } : line
      ));
    }
  };

  const copyParameters = (fromLineId: string, toLineId: string) => {
    const fromLine = lineParams.find(l => l.id === fromLineId);
    if (fromLine) {
      setLineParams(prev => prev.map(line => 
        line.id === toLineId ? { 
          ...line, 
          type: fromLine.type,
          r1: fromLine.r1,
          x1: fromLine.x1,
          r0: fromLine.r0,
          x0: fromLine.x0,
          c1: fromLine.c1,
          c0: fromLine.c0,
          ampacity: fromLine.ampacity
        } : line
      ));
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* 参数设置面板 */}
      <Card className="xl:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            线路参数
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedLine && (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">选中线路</Label>
                  <Badge variant="outline" className="mt-1 block w-fit">
                    {selectedLine}
                  </Badge>
                </div>

                {(() => {
                  const line = lineParams.find(l => l.id === selectedLine);
                  if (!line) return null;
                  
                  return (
                    <div className="space-y-4">
                      {/* 基本参数 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">基本参数</Label>
                        
                        <div>
                          <Label className="text-xs">长度 (km)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={line.length}
                            onChange={(e) => updateLineParameter(selectedLine, 'length', parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">线路类型</Label>
                          <Select
                            value={line.type}
                            onValueChange={(value) => updateLineParameter(selectedLine, 'type', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {lineTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      {/* 电气参数 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">电气参数</Label>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">R1 (Ω/km)</Label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={line.r1}
                              onChange={(e) => updateLineParameter(selectedLine, 'r1', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">X1 (Ω/km)</Label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={line.x1}
                              onChange={(e) => updateLineParameter(selectedLine, 'x1', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">R0 (Ω/km)</Label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={line.r0}
                              onChange={(e) => updateLineParameter(selectedLine, 'r0', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">X0 (Ω/km)</Label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={line.x0}
                              onChange={(e) => updateLineParameter(selectedLine, 'x0', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">载流量 (A)</Label>
                          <Input
                            type="number"
                            value={line.ampacity}
                            onChange={(e) => updateLineParameter(selectedLine, 'ampacity', parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <Separator />

                      {/* 快速模板 */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">参数模板</Label>
                        <div className="space-y-2">
                          {Object.keys(lineTemplates).map(template => (
                            <Button
                              key={template}
                              variant="outline"
                              size="sm"
                              onClick={() => applyTemplate(selectedLine, template)}
                              className="w-full text-xs"
                            >
                              {template}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* 操作按钮 */}
          <div className="space-y-3">
            <Button
              onClick={onNext}
              className="w-full gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              下一步：变压器负荷
            </Button>

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

      {/* 线路参数表格 */}
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Cable className="w-5 h-5" />
              线路参数配置
            </span>
            <Badge variant="outline">
              {lineParams.length} 条线路
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>线路</TableHead>
                  <TableHead>起点</TableHead>
                  <TableHead>终点</TableHead>
                  <TableHead>长度(km)</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>R1(Ω/km)</TableHead>
                  <TableHead>X1(Ω/km)</TableHead>
                  <TableHead>R0(Ω/km)</TableHead>
                  <TableHead>X0(Ω/km)</TableHead>
                  <TableHead>载流量(A)</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineParams.map((line) => (
                  <TableRow 
                    key={line.id}
                    className={selectedLine === line.id ? "bg-primary/5" : ""}
                    onClick={() => setSelectedLine(line.id)}
                  >
                    <TableCell>
                      <Badge variant="secondary">{line.id}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{line.from}</TableCell>
                    <TableCell className="text-sm">{line.to}</TableCell>
                    <TableCell>{line.length}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          line.type === "架空线" ? "bg-blue-50 text-blue-700" :
                          line.type === "电缆" ? "bg-green-50 text-green-700" :
                          "bg-orange-50 text-orange-700"
                        }
                      >
                        {line.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{line.r1.toFixed(4)}</TableCell>
                    <TableCell className="font-mono text-xs">{line.x1.toFixed(4)}</TableCell>
                    <TableCell className="font-mono text-xs">{line.r0.toFixed(4)}</TableCell>
                    <TableCell className="font-mono text-xs">{line.x0.toFixed(4)}</TableCell>
                    <TableCell>{line.ampacity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLine(line.id);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // 复制到其他线路的逻辑
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 批量操作 */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              批量操作
            </h4>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                批量设置长度
              </Button>
              <Button variant="outline" size="sm">
                批量应用模板
              </Button>
              <Button variant="outline" size="sm">
                导入参数文件
              </Button>
              <Button variant="outline" size="sm">
                导出参数文件
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};