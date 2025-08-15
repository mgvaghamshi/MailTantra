"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, 
  Save, 
  Eye, 
  Code, 
  Type, 
  Palette,
  Layout,
  Plus,
  Trash2,
  Move,
  Loader2
} from "lucide-react";
import { Template, emailTrackerAPI } from "@/lib/emailtracker-api";

interface TemplateBuilderModalProps {
  children: React.ReactNode;
  onTemplateCreated?: (template: Template) => void;
  initialTemplate?: Partial<Template>;
  defaultFolderId?: string;
}

interface BuilderBlock {
  id: string;
  type: 'header' | 'text' | 'button' | 'image' | 'spacer';
  content: string;
  styles: {
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
  };
}

export function TemplateBuilderModal({ children, onTemplateCreated, initialTemplate, defaultFolderId }: TemplateBuilderModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  
  const [templateData, setTemplateData] = useState({
    name: initialTemplate?.name || '',
    subject: initialTemplate?.subject || '',
    description: initialTemplate?.description || '',
    type: initialTemplate?.type || 'marketing',
    status: initialTemplate?.status || 'draft'
  });

  const [blocks, setBlocks] = useState<BuilderBlock[]>([
    {
      id: '1',
      type: 'header',
      content: 'Your Email Title',
      styles: {
        textAlign: 'center',
        fontSize: '24px',
        color: '#333333',
        padding: '20px'
      }
    },
    {
      id: '2',
      type: 'text',
      content: 'Hello {{first_name}},\n\nThis is your email content. You can customize it however you like.',
      styles: {
        textAlign: 'left',
        fontSize: '16px',
        color: '#666666',
        padding: '15px'
      }
    }
  ]);

  const [customHTML, setCustomHTML] = useState('');

  const addBlock = (type: BuilderBlock['type']) => {
    const newBlock: BuilderBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: BuilderBlock['type']): string => {
    switch (type) {
      case 'header': return 'New Header';
      case 'text': return 'Your text content here...';
      case 'button': return 'Click Here';
      case 'image': return 'https://via.placeholder.com/600x200';
      case 'spacer': return '';
      default: return '';
    }
  };

  const getDefaultStyles = (type: BuilderBlock['type']) => {
    switch (type) {
      case 'header':
        return { textAlign: 'center' as const, fontSize: '24px', color: '#333333', padding: '20px' };
      case 'text':
        return { textAlign: 'left' as const, fontSize: '16px', color: '#666666', padding: '15px' };
      case 'button':
        return { textAlign: 'center' as const, backgroundColor: '#4F46E5', color: '#ffffff', padding: '12px 24px' };
      case 'image':
        return { textAlign: 'center' as const, padding: '10px' };
      case 'spacer':
        return { padding: '20px' };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, field: string, value: string | number | boolean) => {
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, [field]: value }
        : block
    ));
  };

  const updateBlockStyle = (id: string, styleProp: string, value: string) => {
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, styles: { ...block.styles, [styleProp]: value } }
        : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;
    
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setBlocks(newBlocks);
  };

  const generateHTML = (): string => {
    if (activeTab === 'code' && customHTML) {
      return customHTML;
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateData.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; max-width: 600px;">
          ${blocks.map(block => generateBlockHTML(block)).join('')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const generateBlockHTML = (block: BuilderBlock): string => {
    const styleString = Object.entries(block.styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');

    switch (block.type) {
      case 'header':
        return `
          <tr>
            <td style="${styleString}">
              <h1 style="margin: 0; font-size: ${block.styles.fontSize}; color: ${block.styles.color}; text-align: ${block.styles.textAlign};">
                ${block.content}
              </h1>
            </td>
          </tr>`;
      
      case 'text':
        return `
          <tr>
            <td style="${styleString}">
              <p style="margin: 0; font-size: ${block.styles.fontSize}; color: ${block.styles.color}; text-align: ${block.styles.textAlign}; line-height: 1.6;">
                ${block.content.replace(/\n/g, '<br>')}
              </p>
            </td>
          </tr>`;
      
      case 'button':
        return `
          <tr>
            <td style="padding: ${block.styles.padding}; text-align: ${block.styles.textAlign};">
              <a href="#" style="background-color: ${block.styles.backgroundColor}; color: ${block.styles.color}; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                ${block.content}
              </a>
            </td>
          </tr>`;
      
      case 'image':
        return `
          <tr>
            <td style="${styleString}">
              <img src="${block.content}" alt="Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
            </td>
          </tr>`;
      
      case 'spacer':
        return `
          <tr>
            <td style="height: ${block.styles.padding || '20px'};">
              &nbsp;
            </td>
          </tr>`;
      
      default:
        return '';
    }
  };

  const generateTextContent = (): string => {
    return blocks
      .filter(block => block.type !== 'spacer' && block.type !== 'image')
      .map(block => block.content)
      .join('\n\n');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const template = await emailTrackerAPI.createTemplate({
        name: templateData.name,
        subject: templateData.subject,
        description: templateData.description,
        type: templateData.type as "newsletter" | "promotional" | "transactional",
        status: templateData.status,
        html_content: generateHTML(),
        text_content: generateTextContent(),
        folder_id: defaultFolderId
      });
      
      if (onTemplateCreated) {
        onTemplateCreated(template);
      }
      
      alert('Template created successfully!');
      setOpen(false);
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const renderVisualEditor = () => (
    <div className="grid grid-cols-4 gap-4 h-96">
      {/* Blocks Palette */}
      <div className="border-r pr-4">
        <h3 className="font-medium mb-3">Add Blocks</h3>
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={() => addBlock('header')}
          >
            <Type className="h-4 w-4 mr-2" />
            Header
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={() => addBlock('text')}
          >
            <Type className="h-4 w-4 mr-2" />
            Text
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={() => addBlock('button')}
          >
            <Layout className="h-4 w-4 mr-2" />
            Button
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={() => addBlock('image')}
          >
            <Layout className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-start"
            onClick={() => addBlock('spacer')}
          >
            <Layout className="h-4 w-4 mr-2" />
            Spacer
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="col-span-2 border rounded-lg p-4 bg-gray-50 overflow-y-auto">
        <div className="space-y-2">
          {blocks.map((block, index) => (
            <div key={block.id} className="border bg-white rounded p-3 group hover:shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {block.type}
                </Badge>
                <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveBlock(block.id, 'up')}
                    disabled={index === 0}
                  >
                    <Move className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveBlock(block.id, 'down')}
                    disabled={index === blocks.length - 1}
                  >
                    <Move className="h-3 w-3 rotate-180" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteBlock(block.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="text-sm">
                {block.type === 'spacer' ? (
                  <div className="h-4 bg-gray-200 rounded"></div>
                ) : (
                  <div style={block.styles}>
                    {block.content.substring(0, 50)}
                    {block.content.length > 50 && '...'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="border-l pl-4">
        <h3 className="font-medium mb-3">Properties</h3>
        {blocks.length > 0 && (
          <div className="text-sm text-gray-500">
            Select a block to edit its properties
          </div>
        )}
      </div>
    </div>
  );

  const renderCodeEditor = () => (
    <div className="h-96">
      <Textarea
        value={customHTML || generateHTML()}
        onChange={(e) => setCustomHTML(e.target.value)}
        className="h-full font-mono text-sm"
        placeholder="Enter your HTML code here..."
      />
    </div>
  );

  const renderPreview = () => (
    <div className="h-96 border rounded-lg overflow-hidden">
      <iframe
        srcDoc={generateHTML()}
        className="w-full h-full border-0"
        title="Template Preview"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>Template Builder</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Info */}
          <div className="grid grid-cols-4 gap-4">
            <Input
              placeholder="Template name"
              value={templateData.name}
              onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
            />
            <Input
              placeholder="Email subject"
              value={templateData.subject}
              onChange={(e) => setTemplateData({...templateData, subject: e.target.value})}
            />
            <select
              value={templateData.type}
              onChange={(e) => setTemplateData({...templateData, type: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="marketing">Marketing</option>
              <option value="newsletter">Newsletter</option>
              <option value="promotional">Promotional</option>
              <option value="welcome">Welcome</option>
              <option value="transactional">Transactional</option>
            </select>
            <select
              value={templateData.status}
              onChange={(e) => setTemplateData({...templateData, status: e.target.value as "draft" | "published" | "archived"})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'visual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('visual')}
            >
              <Layout className="h-4 w-4 mr-1" />
              Visual
            </Button>
            <Button
              variant={activeTab === 'code' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('code')}
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'visual' && renderVisualEditor()}
            {activeTab === 'code' && renderCodeEditor()}
            {activeTab === 'preview' && renderPreview()}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !templateData.name}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
