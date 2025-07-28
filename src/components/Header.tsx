import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, Settings, FileText, Save, FolderOpen, Plus } from "lucide-react";

interface HeaderProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSettings: () => void;
}

export const Header = ({ onNewProject, onOpenProject, onSaveProject, onSettings }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 标题和Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-primary">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">电力单线图智能分析系统</h1>
              <p className="text-sm text-muted-foreground">Power Single Line Diagram Analysis System v1.0</p>
            </div>
          </div>

          {/* 工具栏按钮 */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onNewProject}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              新建项目
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenProject}
              className="gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              打开项目
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveProject}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              保存项目
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              设置
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};