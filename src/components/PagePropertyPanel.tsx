import React from 'react';
import { 
  Type, 
  Palette, 
  Layout, 
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface PageElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'section' | 'heading' | 'column' | 'row' | 'card' | 'icon' | 'spacer' | 'divider' | 'container' | 'grid' | 'grid-item' | 'form' | 'input' | 'textarea' | 'list' | 'gallery' | 'topbar' | 'sidebar';
  content: string;
  children?: PageElement[];
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: string;
    width?: string;
    height?: string;
    display?: 'flex' | 'block' | 'inline-block' | 'grid' | 'inline-flex';
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    gap?: string;
    maxWidth?: string;
    minHeight?: string;
    minWidth?: string;
    border?: string;
    boxShadow?: string;
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
    zIndex?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridColumn?: string;
    gridRow?: string;
    gridArea?: string;
    listStyleType?: 'disc' | 'decimal' | 'none';
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundBlendMode?: string;
    textShadow?: string;
    lineHeight?: string | number;
    textDecoration?: string;
    fontStyle?: string;
    flex?: string;
    cursor?: string;
    transition?: string;
    transform?: string;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
    boxSizing?: 'border-box' | 'content-box';
    justifySelf?: 'flex-start' | 'center' | 'flex-end';
    columnSpan?: '1' | '2' | '3' | '4' | 'full';
    elementAlign?: 'left' | 'center' | 'right';
  };
  properties?: {
    href?: string;
    src?: string;
    alt?: string;
    columns?: number;
    rows?: number;
    icon?: string;
    hasIcon?: boolean;
    iconName?: string;
    iconPosition?: 'left' | 'right' | 'top' | 'bottom';
    iconSize?: string;
    iconColor?: string;
    target?: '_blank' | '_self';
    cardTitle?: string;
    cardSubtitle?: string;
    cardImage?: string;
    gridColumns?: number;
    gridRows?: number;
    responsive?: {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
    inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    placeholder?: string;
    required?: boolean;
    listItems?: string[];
    galleryImages?: string[];
    galleryColumns?: number;
    videoWidth?: string;
    videoHeight?: string;
    customWidth?: string;
    customHeight?: string;
    isFullscreen?: boolean;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundSize?: 'cover' | 'contain' | 'auto';
    backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    // Propriedades para TopBar
    logoSrc?: string;
    logoAlt?: string;
    logoPosition?: 'left' | 'center' | 'right';
    menuItems?: Array<{
      id: string;
      label: string;
      link: string;
      iconName?: string;
      hasDropdown?: boolean;
      dropdownItems?: Array<{
        label: string;
        link: string;
        iconName?: string;
      }>;
    }>;
    // Propriedades para Sidebar
    isCollapsible?: boolean;
    isCollapsed?: boolean;
    sidebarPosition?: 'left' | 'right';
    sidebarWidth?: string;
    collapsedWidth?: string;
  };
}

interface PagePropertyPanelProps {
  selectedElement: PageElement | null;
  onUpdate: (updates: Partial<PageElement>) => void;
}

export const PagePropertyPanel: React.FC<PagePropertyPanelProps> = ({ 
  selectedElement, 
  onUpdate 
}) => {
  if (!selectedElement) {
    return (
      <div className="w-64 bg-gray-900 shadow-xl p-4 border-l border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Propriedades</h2>
        <div className="text-center py-8">
          <Layout size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-sm text-gray-300 mb-2">
            Selecione um elemento para editar suas propriedades
          </p>
          <p className="text-xs text-gray-500">
            Clique em qualquer elemento na página para começar a personalizá-lo
          </p>
        </div>
      </div>
    );
  }

  const updateStyle = (property: string, value: any) => {
    onUpdate({
      styles: {
        ...selectedElement.styles,
        [property]: value
      }
    });
  };

  const updateContent = (content: string) => {
    onUpdate({ content });
  };

  const updateProperty = (property: string, value: any) => {
    onUpdate({
      properties: {
        ...selectedElement.properties,
        [property]: value
      }
    });
  };

  return (
    <div className="w-64 bg-gray-900 shadow-xl p-4 overflow-y-auto border-l border-gray-700">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white border-b border-gray-700 pb-3">
        <Layout size={20} />
        Propriedades
      </h2>

      {/* Tipo do elemento */}
      <div className="mb-6">
        <span className="inline-block bg-blue-600 text-blue-100 text-xs px-3 py-2 rounded-lg font-medium shadow-sm">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
        </span>
      </div>

      {/* Ações rápidas */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3 text-gray-200 uppercase tracking-wide">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              // Duplicar elemento
              const newElement = {
                ...selectedElement,
                id: Date.now().toString()
              };
              // Esta funcionalidade seria implementada no componente pai
            }}
            className="p-3 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg flex items-center gap-2 border border-gray-600 transition-all hover:border-gray-500"
            title="Duplicar elemento"
          >
            <Layout size={14} />
            Duplicar
          </button>
          <button
            onClick={() => {
              // Reset estilos
              onUpdate({
                styles: {}
              });
            }}
            className="p-3 text-xs bg-orange-800 hover:bg-orange-700 text-orange-100 rounded-lg flex items-center gap-2 border border-orange-600 transition-all hover:border-orange-500"
            title="Resetar estilos"
          >
            <Layout size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-gray-200 uppercase tracking-wide">Conteúdo</label>
        <textarea
          value={selectedElement.content}
          onChange={(e) => updateContent(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-sm resize-none text-gray-200 placeholder-gray-400 focus:border-blue-500 focus:bg-gray-750 transition-all"
          rows={3}
          placeholder="Digite o conteúdo aqui..."
        />
      </div>

      {/* Tipografia */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">
          <Type size={16} />
          Tipografia
        </h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-2 font-medium">Tamanho da Fonte</label>
            <input
              type="range"
              min="12"
              max="72"
              value={parseInt(selectedElement.styles?.fontSize?.replace('px', '')) || 16}
              onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>12px</span>
              <span className="text-blue-400 font-medium">{selectedElement.styles?.fontSize || '16px'}</span>
              <span>72px</span>
            </div>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Alinhamento</label>
            <div className="flex gap-2">
              <button
                onClick={() => updateStyle('textAlign', 'left')}
                className={`flex-1 p-2 rounded-md transition-all ${selectedElement.styles?.textAlign === 'left' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <AlignLeft size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => updateStyle('textAlign', 'center')}
                className={`flex-1 p-2 rounded-md transition-all ${selectedElement.styles?.textAlign === 'center' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <AlignCenter size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => updateStyle('textAlign', 'right')}
                className={`flex-1 p-2 rounded-md transition-all ${selectedElement.styles?.textAlign === 'right' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <AlignRight size={16} className="mx-auto" />
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Presets de Tipografia</label>
            <div className="space-y-2">
              <button
                onClick={() => onUpdate({
                  styles: {
                    ...selectedElement.styles,
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }
                })}
                className="w-full p-3 text-left text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-all border border-gray-600 hover:border-gray-500"
              >
                <span className="font-bold">Título Principal</span> <span className="text-gray-400">(48px)</span>
              </button>
              <button
                onClick={() => onUpdate({
                  styles: {
                    ...selectedElement.styles,
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#374151'
                  }
                })}
                className="w-full p-3 text-left text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-all border border-gray-600 hover:border-gray-500"
              >
                <span className="font-semibold">Subtítulo</span> <span className="text-gray-400">(32px)</span>
              </button>
              <button
                onClick={() => onUpdate({
                  styles: {
                    ...selectedElement.styles,
                    fontSize: '18px',
                    fontWeight: 'normal',
                    color: '#6b7280'
                  }
                })}
                className="w-full p-3 text-left text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-all border border-gray-600 hover:border-gray-500"
              >
                <span>Parágrafo</span> <span className="text-gray-400">(18px)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cores */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">
          <Palette size={16} />
          Cores
        </h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Cor do Texto</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer shadow-md hover:scale-105 transition-transform flex-shrink-0"
                style={{ backgroundColor: selectedElement.styles?.color || '#000000' }}
              />
              <input
                type="color"
                value={selectedElement.styles?.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer bg-transparent flex-shrink-0"
              />
              <input
                type="text"
                value={selectedElement.styles?.color || '#000000'}
                onChange={(e) => updateStyle('color', e.target.value)}
                className="flex-1 min-w-0 p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Cor de Fundo</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer shadow-md hover:scale-105 transition-transform flex-shrink-0"
                style={{ backgroundColor: selectedElement.styles?.backgroundColor || 'transparent' }}
              />
              <input
                type="color"
                value={selectedElement.styles?.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer bg-transparent flex-shrink-0"
              />
              <input
                type="text"
                value={selectedElement.styles?.backgroundColor || ''}
                onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                className="flex-1 min-w-0 p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Espaçamento */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">
          <Move size={16} />
          Espaçamento
        </h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-2 font-medium">Padding</label>
            <input
              type="text"
              value={selectedElement.styles?.padding || ''}
              onChange={(e) => updateStyle('padding', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
              placeholder="10px 20px"
            />
            <p className="text-xs text-gray-500 mt-1">Ex: 10px 20px (vertical horizontal)</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-2 font-medium">Margin</label>
            <input
              type="text"
              value={selectedElement.styles?.margin || ''}
              onChange={(e) => updateStyle('margin', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
              placeholder="10px 0px"
            />
            <p className="text-xs text-gray-500 mt-1">Ex: 10px 0px (vertical horizontal)</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-2 font-medium">Border Radius</label>
            <input
              type="range"
              min="0"
              max="50"
              value={parseInt(selectedElement.styles?.borderRadius?.replace('px', '')) || 0}
              onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0px</span>
              <span className="text-blue-400 font-medium">{selectedElement.styles?.borderRadius || '0px'}</span>
              <span>50px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dimensões */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Dimensões</h3>
        
        <div className="space-y-4">
          {/* Atalhos de Largura */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Largura Rápida</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => updateStyle('width', 'auto')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.width === 'auto' || !selectedElement.styles?.width ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📐 Auto
              </button>
              <button
                onClick={() => updateStyle('width', '100%')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.width === '100%' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📏 Container 100%
              </button>
              <button
                onClick={() => updateStyle('width', '50%')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.width === '50%' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📊 Metade (50%)
              </button>
              <button
                onClick={() => updateStyle('width', '300px')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.width === '300px' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📱 Fixo (300px)
              </button>
            </div>
            <label className="block text-xs text-gray-300 mb-2 font-medium">Largura Personalizada</label>
            <input
              type="text"
              value={selectedElement.styles?.width || ''}
              onChange={(e) => updateStyle('width', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
              placeholder="auto, 100px, 50%"
            />
            <p className="text-xs text-gray-500 mt-1">Ex: auto, 100px, 50%, 100%</p>
          </div>

          {/* Atalhos de Altura */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Altura Rápida</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => updateStyle('height', 'auto')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.height === 'auto' || !selectedElement.styles?.height ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📐 Auto
              </button>
              <button
                onClick={() => updateStyle('height', '100%')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.height === '100%' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📏 Container 100%
              </button>
              <button
                onClick={() => updateStyle('height', '200px')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.height === '200px' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📊 Média (200px)
              </button>
              <button
                onClick={() => updateStyle('height', '400px')}
                className={`p-2 text-xs rounded-md transition-all ${selectedElement.styles?.height === '400px' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📱 Alta (400px)
              </button>
            </div>
            <label className="block text-xs text-gray-300 mb-2 font-medium">Altura Personalizada</label>
            <input
              type="text"
              value={selectedElement.styles?.height || ''}
              onChange={(e) => updateStyle('height', e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
              placeholder="auto, 100px"
            />
            <p className="text-xs text-gray-500 mt-1">Ex: auto, 100px, 50vh</p>
          </div>
        </div>
      </div>

      {/* Alinhamento e Colunas - para todos os elementos */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Posicionamento</h3>
        
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Alinhamento Horizontal</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateStyle('elementAlign', 'left')}
                className={`p-3 text-sm rounded-md transition-all flex items-center justify-center ${selectedElement.styles?.elementAlign === 'left' || !selectedElement.styles?.elementAlign ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <AlignLeft size={16} />
              </button>
              <button
                onClick={() => updateStyle('elementAlign', 'center')}
                className={`p-3 text-sm rounded-md transition-all flex items-center justify-center ${selectedElement.styles?.elementAlign === 'center' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <AlignCenter size={16} />
              </button>
              <button
                onClick={() => updateStyle('elementAlign', 'right')}
                className={`p-3 text-sm rounded-md transition-all flex items-center justify-center ${selectedElement.styles?.elementAlign === 'right' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <AlignRight size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Posição do elemento na linha</p>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-3 font-medium">Largura do Elemento</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateStyle('columnSpan', '1')}
                className={`p-3 text-sm rounded-md transition-all ${selectedElement.styles?.columnSpan === '1' || !selectedElement.styles?.columnSpan ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📏 Largura Própria
              </button>
              <button
                onClick={() => updateStyle('columnSpan', 'full')}
                className={`p-3 text-sm rounded-md transition-all ${selectedElement.styles?.columnSpan === 'full' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                📐 Linha Completa
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Como o elemento ocupa o espaço</p>
          </div>
        </div>
      </div>

      {/* Layout Flexível - para elementos com layout flexível */}
      {(['section', 'row', 'column', 'container'].includes(selectedElement.type)) && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Layout Flexível</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Direção dos Elementos</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateStyle('flexDirection', 'row')}
                  className={`p-3 text-sm rounded-md transition-all ${selectedElement.styles?.flexDirection === 'row' || !selectedElement.styles?.flexDirection ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  → Lado a Lado
                </button>
                <button
                  onClick={() => updateStyle('flexDirection', 'column')}
                  className={`p-3 text-sm rounded-md transition-all ${selectedElement.styles?.flexDirection === 'column' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  ↓ Empilhado
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Alinhamento Horizontal</label>
              <select
                value={selectedElement.styles?.justifyContent || 'flex-start'}
                onChange={(e) => updateStyle('justifyContent', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 focus:border-blue-500 transition-all"
              >
                <option value="flex-start">⬅️ Início</option>
                <option value="center">🎯 Centro</option>
                <option value="flex-end">➡️ Fim</option>
                <option value="space-between">↔️ Espaço Entre</option>
                <option value="space-around">🔄 Espaço Ao Redor</option>
                <option value="space-evenly">⚖️ Espaço Uniforme</option>
              </select>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Alinhamento Vertical</label>
              <select
                value={selectedElement.styles?.alignItems || 'stretch'}
                onChange={(e) => updateStyle('alignItems', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 focus:border-blue-500 transition-all"
              >
                <option value="flex-start">Início</option>
                <option value="center">Centro</option>
                <option value="flex-end">Fim</option>
                <option value="stretch">Esticar</option>
              </select>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Espaçamento (Gap)</label>
              <input
                type="range"
                min="0"
                max="50"
                value={parseInt(selectedElement.styles?.gap?.replace('px', '')) || 0}
                onChange={(e) => updateStyle('gap', `${e.target.value}px`)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0px</span>
                <span className="text-blue-400 font-medium">{selectedElement.styles?.gap || '0px'}</span>
                <span>50px</span>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Exibição</label>
              <select
                value={selectedElement.styles?.display || 'block'}
                onChange={(e) => updateStyle('display', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 focus:border-blue-500 transition-all"
              >
                <option value="block">Bloco</option>
                <option value="flex">Flexível</option>
                <option value="inline-block">Inline-Block</option>
                <option value="grid">Grid</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Container Especial - apenas para containers */}
      {selectedElement.type === 'container' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Container Especial</h3>
          
          <div className="space-y-4">
            {/* Modo Fullscreen */}
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Modo do Container</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateProperty('isFullscreen', false)}
                  className={`p-3 text-sm rounded-md transition-all ${!selectedElement.properties?.isFullscreen ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  📦 Normal
                </button>
                <button
                  onClick={() => updateProperty('isFullscreen', true)}
                  className={`p-3 text-sm rounded-md transition-all ${selectedElement.properties?.isFullscreen ? 'bg-green-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  🌍 Página Inteira
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Página inteira = sem bordas, ocupa 100% da tela</p>
            </div>

            {/* Background Image */}
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Imagem de Fundo</label>
              <input
                type="text"
                value={selectedElement.properties?.backgroundImage || ''}
                onChange={(e) => updateProperty('backgroundImage', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">URL da imagem de fundo</p>
            </div>

            {/* Background Video */}
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Vídeo de Fundo</label>
              <input
                type="text"
                value={selectedElement.properties?.backgroundVideo || ''}
                onChange={(e) => updateProperty('backgroundVideo', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="https://exemplo.com/video.mp4"
              />
              <p className="text-xs text-gray-500 mt-1">URL do vídeo de fundo (MP4)</p>
            </div>

            {/* Background Settings */}
            {selectedElement.properties?.backgroundImage && (
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <label className="block text-xs text-gray-300 mb-3 font-medium">Configurações do Fundo</label>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Tamanho</label>
                    <select
                      value={selectedElement.properties?.backgroundSize || 'cover'}
                      onChange={(e) => updateProperty('backgroundSize', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                    >
                      <option value="cover">Cobrir (Cover)</option>
                      <option value="contain">Conter (Contain)</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Posição</label>
                    <select
                      value={selectedElement.properties?.backgroundPosition || 'center'}
                      onChange={(e) => updateProperty('backgroundPosition', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                    >
                      <option value="center">Centro</option>
                      <option value="top">Topo</option>
                      <option value="bottom">Baixo</option>
                      <option value="left">Esquerda</option>
                      <option value="right">Direita</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Repetição</label>
                    <select
                      value={selectedElement.properties?.backgroundRepeat || 'no-repeat'}
                      onChange={(e) => updateProperty('backgroundRepeat', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                    >
                      <option value="no-repeat">Não Repetir</option>
                      <option value="repeat">Repetir</option>
                      <option value="repeat-x">Repetir Horizontal</option>
                      <option value="repeat-y">Repetir Vertical</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Propriedades específicas por tipo */}
      {selectedElement.type === 'button' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Configurações do Botão</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Link (URL)</label>
              <input
                type="text"
                value={selectedElement.properties?.href || ''}
                onChange={(e) => updateProperty('href', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="https://exemplo.com"
              />
              <p className="text-xs text-gray-500 mt-1">URL para onde o botão irá direcionar</p>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Abrir Link</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateProperty('target', '_self')}
                  className={`p-3 text-sm rounded-md transition-all ${(selectedElement.properties?.target === '_self' || !selectedElement.properties?.target) ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  🔄 Mesma Aba
                </button>
                <button
                  onClick={() => updateProperty('target', '_blank')}
                  className={`p-3 text-sm rounded-md transition-all ${selectedElement.properties?.target === '_blank' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  🔗 Nova Aba
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Estilos de Botão</label>
              <div className="space-y-2">
                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }
                  })}
                  className="w-full p-3 text-left text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all"
                >
                  Botão Primário (Azul)
                </button>
                
                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }
                  })}
                  className="w-full p-3 text-left text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-all"
                >
                  Botão de Sucesso (Verde)
                </button>

                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }
                  })}
                  className="w-full p-3 text-left text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition-all"
                >
                  Botão de Destaque (Vermelho)
                </button>

                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      backgroundColor: 'transparent',
                      color: '#3b82f6',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: '2px solid #3b82f6',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }
                  })}
                  className="w-full p-3 text-left text-sm bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                >
                  Botão Outline (Azul)
                </button>

                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      backgroundColor: '#f9fafb',
                      color: '#374151',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }
                  })}
                  className="w-full p-3 text-left text-sm bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 rounded-md transition-all"
                >
                  Botão Neutro (Cinza)
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Tamanhos de Botão</label>
              <div className="space-y-2">
                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      padding: '8px 16px',
                      fontSize: '14px'
                    }
                  })}
                  className="w-full p-2 text-left text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-all border border-gray-600"
                >
                  Pequeno (8px 16px)
                </button>
                
                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      padding: '12px 24px',
                      fontSize: '16px'
                    }
                  })}
                  className="w-full p-3 text-left text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-all border border-gray-600"
                >
                  Médio (12px 24px)
                </button>

                <button
                  onClick={() => onUpdate({
                    styles: {
                      ...selectedElement.styles,
                      padding: '16px 32px',
                      fontSize: '18px'
                    }
                  })}
                  className="w-full p-4 text-left text-base bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md transition-all border border-gray-600"
                >
                  Grande (16px 32px)
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Ícone do Botão</label>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasIcon"
                    checked={selectedElement.properties?.hasIcon || false}
                    onChange={(e) => updateProperty('hasIcon', e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="hasIcon" className="text-sm text-gray-300">Mostrar ícone</label>
                </div>

                {selectedElement.properties?.hasIcon && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Nome do Ícone</label>
                      <input
                        type="text"
                        value={selectedElement.properties?.iconName || ''}
                        onChange={(e) => updateProperty('iconName', e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                        placeholder="user, heart, star, etc."
                      />
                      <p className="text-xs text-gray-500 mt-1">Ex: user, heart, star, download, arrow-right</p>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Posição do Ícone</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateProperty('iconPosition', 'left')}
                          className={`p-2 text-xs rounded transition-all ${selectedElement.properties?.iconPosition === 'left' || !selectedElement.properties?.iconPosition ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                          ← Esquerda
                        </button>
                        <button
                          onClick={() => updateProperty('iconPosition', 'right')}
                          className={`p-2 text-xs rounded transition-all ${selectedElement.properties?.iconPosition === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                          Direita →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configurações de Texto com Ícones */}
      {(selectedElement.type === 'text' || selectedElement.type === 'heading') && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Configurações de Texto</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Ícone no Texto</label>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="textHasIcon"
                    checked={selectedElement.properties?.hasIcon || false}
                    onChange={(e) => updateProperty('hasIcon', e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="textHasIcon" className="text-sm text-gray-300">Mostrar ícone</label>
                </div>

                {selectedElement.properties?.hasIcon && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Nome do Ícone</label>
                      <input
                        type="text"
                        value={selectedElement.properties?.iconName || ''}
                        onChange={(e) => updateProperty('iconName', e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                        placeholder="check, star, info, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Posição do Ícone</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateProperty('iconPosition', 'left')}
                          className={`p-2 text-xs rounded transition-all ${selectedElement.properties?.iconPosition === 'left' || !selectedElement.properties?.iconPosition ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                          ← Antes
                        </button>
                        <button
                          onClick={() => updateProperty('iconPosition', 'right')}
                          className={`p-2 text-xs rounded transition-all ${selectedElement.properties?.iconPosition === 'right' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                          Depois →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === 'icon' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Configurações do Ícone</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Ícone</label>
              <select
                value={selectedElement.properties?.icon || 'star'}
                onChange={(e) => updateProperty('icon', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 focus:border-blue-500 transition-all"
              >
                <option value="star">⭐ Estrela</option>
                <option value="heart">❤️ Coração</option>
                <option value="thumbs-up">👍 Like</option>
                <option value="check">✅ Check</option>
                <option value="x">❌ X</option>
                <option value="arrow-right">➡️ Seta Direita</option>
                <option value="arrow-left">⬅️ Seta Esquerda</option>
                <option value="arrow-up">⬆️ Seta Cima</option>
                <option value="arrow-down">⬇️ Seta Baixo</option>
                <option value="plus">➕ Plus</option>
                <option value="minus">➖ Minus</option>
                <option value="info">ℹ️ Info</option>
                <option value="warning">⚠️ Aviso</option>
                <option value="bell">🔔 Sino</option>
                <option value="mail">📧 Email</option>
                <option value="phone">📞 Telefone</option>
                <option value="user">👤 Usuário</option>
                <option value="users">👥 Usuários</option>
                <option value="settings">⚙️ Configurações</option>
                <option value="search">🔍 Busca</option>
                <option value="home">🏠 Home</option>
                <option value="menu">☰ Menu</option>
                <option value="download">📥 Download</option>
                <option value="upload">📤 Upload</option>
                <option value="play">▶️ Play</option>
                <option value="pause">⏸️ Pause</option>
                <option value="stop">⏹️ Stop</option>
                <option value="calendar">📅 Calendário</option>
                <option value="clock">🕐 Relógio</option>
                <option value="globe">🌐 Globo</option>
                <option value="map-pin">📍 Localização</option>
                <option value="camera">📷 Câmera</option>
                <option value="image">🖼️ Imagem</option>
                <option value="file">📄 Arquivo</option>
                <option value="folder">📁 Pasta</option>
                <option value="shopping-cart">🛒 Carrinho</option>
                <option value="credit-card">💳 Cartão</option>
                <option value="dollar-sign">💵 Dinheiro</option>
                <option value="gift">🎁 Presente</option>
                <option value="trophy">🏆 Troféu</option>
                <option value="award">🥇 Prêmio</option>
                <option value="target">🎯 Alvo</option>
                <option value="trending-up">📈 Crescimento</option>
                <option value="trending-down">📉 Queda</option>
                <option value="bar-chart">📊 Gráfico</option>
                <option value="pie-chart">📊 Pizza</option>
                <option value="activity">📊 Atividade</option>
                <option value="battery">🔋 Bateria</option>
                <option value="wifi">📶 Wifi</option>
                <option value="bluetooth">📘 Bluetooth</option>
                <option value="shield">🛡️ Escudo</option>
                <option value="lock">🔒 Cadeado</option>
                <option value="unlock">🔓 Desbloqueado</option>
                <option value="key">🔑 Chave</option>
                <option value="eye">👁️ Olho</option>
                <option value="eye-off">🙈 Olho Fechado</option>
                <option value="bookmark">🔖 Marcador</option>
                <option value="tag">🏷️ Tag</option>
                <option value="flag">🚩 Bandeira</option>
                <option value="paperclip">📎 Clipe</option>
                <option value="link">🔗 Link</option>
                <option value="external-link">🔗 Link Externo</option>
                <option value="refresh">🔄 Atualizar</option>
                <option value="rotate-cw">🔄 Rotacionar</option>
                <option value="maximize">⛶ Maximizar</option>
                <option value="minimize">⛷ Minimizar</option>
                <option value="move">✋ Mover</option>
                <option value="copy">📋 Copiar</option>
                <option value="scissors">✂️ Cortar</option>
                <option value="edit">✏️ Editar</option>
                <option value="trash">🗑️ Lixeira</option>
                <option value="save">💾 Salvar</option>
                <option value="print">🖨️ Imprimir</option>
                <option value="share">📤 Compartilhar</option>
                <option value="send">📨 Enviar</option>
                <option value="message-circle">💬 Mensagem</option>
                <option value="message-square">💬 Chat</option>
                <option value="help-circle">❓ Ajuda</option>
                <option value="alert-circle">⚠️ Alerta</option>
                <option value="alert-triangle">⚠️ Aviso</option>
                <option value="check-circle">✅ Sucesso</option>
                <option value="x-circle">❌ Erro</option>
                <option value="zap">⚡ Raio</option>
                <option value="sun">☀️ Sol</option>
                <option value="moon">🌙 Lua</option>
                <option value="cloud">☁️ Nuvem</option>
                <option value="umbrella">☔ Guarda-chuva</option>
              </select>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Tamanho do Ícone</label>
              <input
                type="range"
                min="16"
                max="128"
                value={parseInt(selectedElement.properties?.iconSize?.replace('px', '')) || 24}
                onChange={(e) => updateProperty('iconSize', `${e.target.value}px`)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>16px</span>
                <span className="text-blue-400 font-medium">{selectedElement.properties?.iconSize || '24px'}</span>
                <span>128px</span>
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-3 font-medium">Cor do Ícone</label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer shadow-md hover:scale-105 transition-transform flex-shrink-0"
                  style={{ backgroundColor: selectedElement.properties?.iconColor || '#000000' }}
                />
                <input
                  type="color"
                  value={selectedElement.properties?.iconColor || '#000000'}
                  onChange={(e) => updateProperty('iconColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer bg-transparent flex-shrink-0"
                />
                <input
                  type="text"
                  value={selectedElement.properties?.iconColor || '#000000'}
                  onChange={(e) => updateProperty('iconColor', e.target.value)}
                  className="flex-1 min-w-0 p-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === 'card' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Configurações do Card</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Título do Card</label>
              <input
                type="text"
                value={selectedElement.properties?.cardTitle || ''}
                onChange={(e) => updateProperty('cardTitle', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="Título do card"
              />
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Subtítulo do Card</label>
              <input
                type="text"
                value={selectedElement.properties?.cardSubtitle || ''}
                onChange={(e) => updateProperty('cardSubtitle', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="Subtítulo ou descrição"
              />
            </div>

            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <label className="block text-xs text-gray-300 mb-2 font-medium">Imagem do Card</label>
              <input
                type="text"
                value={selectedElement.properties?.cardImage || ''}
                onChange={(e) => updateProperty('cardImage', e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 transition-all"
                placeholder="URL da imagem"
              />
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === 'video' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Vídeo</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">URL do Vídeo (YouTube/Vimeo)</label>
              <input
                type="text"
                value={selectedElement.properties?.src || ''}
                onChange={(e) => updateProperty('src', e.target.value)}
                className="w-full p-2 border rounded text-xs"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
              <p className="text-xs text-gray-500">
                Para YouTube: https://www.youtube.com/embed/VIDEO_ID<br/>
                Para Vimeo: https://player.vimeo.com/video/VIDEO_ID
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Largura</label>
                <select
                  value={selectedElement.properties?.videoWidth || 'auto'}
                  onChange={(e) => updateProperty('videoWidth', e.target.value)}
                  className="w-full p-2 border rounded text-xs bg-white"
                >
                  <option value="auto">Automática</option>
                  <option value="300px">Pequeno (300px)</option>
                  <option value="500px">Médio (500px)</option>
                  <option value="700px">Grande (700px)</option>
                  <option value="100%">Largura Total</option>
                  <option value="custom">Personalizada</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Altura</label>
                <select
                  value={selectedElement.properties?.videoHeight || 'auto'}
                  onChange={(e) => updateProperty('videoHeight', e.target.value)}
                  className="w-full p-2 border rounded text-xs bg-white"
                >
                  <option value="auto">Automática (16:9)</option>
                  <option value="200px">Pequeno (200px)</option>
                  <option value="315px">Médio (315px)</option>
                  <option value="450px">Grande (450px)</option>
                  <option value="600px">Extra Grande (600px)</option>
                  <option value="custom">Personalizada</option>
                </select>
              </div>
            </div>
            
            {/* Campos personalizados */}
            {selectedElement.properties?.videoWidth === 'custom' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Largura Personalizada</label>
                <input
                  type="text"
                  value={selectedElement.properties?.customWidth || ''}
                  onChange={(e) => updateProperty('customWidth', e.target.value)}
                  className="w-full p-2 border rounded text-xs"
                  placeholder="Ex: 600px, 80%, 50vw"
                />
              </div>
            )}
            
            {selectedElement.properties?.videoHeight === 'custom' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Altura Personalizada</label>
                <input
                  type="text"
                  value={selectedElement.properties?.customHeight || ''}
                  onChange={(e) => updateProperty('customHeight', e.target.value)}
                  className="w-full p-2 border rounded text-xs"
                  placeholder="Ex: 400px, 300px, 50vh"
                />
              </div>
            )}
            
            {/* Presets rápidos */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Presets Rápidos</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    updateProperty('videoWidth', '100%');
                    updateProperty('videoHeight', 'auto');
                  }}
                  className="p-2 text-xs bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded text-blue-700 transition-colors"
                >
                  📱 Responsivo
                </button>
                <button
                  onClick={() => {
                    updateProperty('videoWidth', '700px');
                    updateProperty('videoHeight', '450px');
                  }}
                  className="p-2 text-xs bg-green-100 hover:bg-green-200 border border-green-300 rounded text-green-700 transition-colors"
                >
                  🖥️ Desktop
                </button>
                <button
                  onClick={() => {
                    updateProperty('videoWidth', '400px');
                    updateProperty('videoHeight', '300px');
                  }}
                  className="p-2 text-xs bg-orange-100 hover:bg-orange-200 border border-orange-300 rounded text-orange-700 transition-colors"
                >
                  📟 Compacto
                </button>
                <button
                  onClick={() => {
                    updateProperty('videoWidth', '900px');
                    updateProperty('videoHeight', '600px');
                  }}
                  className="p-2 text-xs bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded text-purple-700 transition-colors"
                >
                  🎥 Cinema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedElement.type === 'image' && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Imagem</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">URL da Imagem</label>
              <input
                type="text"
                value={selectedElement.properties?.src || ''}
                onChange={(e) => updateProperty('src', e.target.value)}
                className="w-full p-2 border rounded text-xs"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Texto Alternativo</label>
              <input
                type="text"
                value={selectedElement.properties?.alt || ''}
                onChange={(e) => updateProperty('alt', e.target.value)}
                className="w-full p-2 border rounded text-xs"
                placeholder="Descrição da imagem"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-2">Imagens Gratuitas</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateProperty('src', 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" className="w-full h-12 object-cover rounded" alt="Negócios" />
                </button>
                <button
                  onClick={() => updateProperty('src', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80')}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" className="w-full h-12 object-cover rounded" alt="Tecnologia" />
                </button>
                <button
                  onClick={() => updateProperty('src', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" className="w-full h-12 object-cover rounded" alt="Equipe" />
                </button>
                <button
                  onClick={() => updateProperty('src', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80')}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" className="w-full h-12 object-cover rounded" alt="Escritório" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paleta de Cores */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">Paleta de Cores</h3>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { name: 'Azul', bg: '#3b82f6', text: '#ffffff' },
              { name: 'Verde', bg: '#10b981', text: '#ffffff' },
              { name: 'Vermelho', bg: '#ef4444', text: '#ffffff' },
              { name: 'Roxo', bg: '#8b5cf6', text: '#ffffff' },
              { name: 'Rosa', bg: '#ec4899', text: '#ffffff' },
              { name: 'Amarelo', bg: '#f59e0b', text: '#000000' },
              { name: 'Cinza', bg: '#6b7280', text: '#ffffff' },
              { name: 'Preto', bg: '#1f2937', text: '#ffffff' }
            ].map((color) => (
              <div key={color.name} className="flex flex-col items-center">
                <button
                  onClick={() => {
                    onUpdate({
                      styles: {
                        ...selectedElement.styles,
                        backgroundColor: color.bg,
                        color: color.text
                      }
                    });
                  }}
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 hover:border-gray-400 transition-all transform hover:scale-110 shadow-md mb-1"
                  style={{ backgroundColor: color.bg }}
                  title={color.name}
                />
                <span className="text-xs text-gray-400">{color.name}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center pt-2 border-t border-gray-700">
            <button
              onClick={() => {
                onUpdate({
                  styles: {
                    ...selectedElement.styles,
                    backgroundColor: 'transparent',
                    color: '#000000'
                  }
                });
              }}
              className="text-xs text-gray-400 hover:text-gray-200 underline transition-colors px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Remover cor de fundo
            </button>
          </div>
        </div>
      </div>

      {/* Configurações Globais da Página */}
      <div className="mb-6 border-t border-gray-600 pt-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-200 uppercase tracking-wide border-b border-gray-700 pb-2">🌍 Configurações da Página</h3>
        
        <div className="space-y-4">
          {/* Background Color da Página */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-2 font-medium">Cor de Fundo da Página</label>
            <div className="flex gap-2">
              <div 
                className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
                style={{ backgroundColor: localStorage.getItem('pageBackgroundColor') || '#ffffff' }}
                onClick={() => {
                  const colorInput = document.createElement('input');
                  colorInput.type = 'color';
                  colorInput.value = localStorage.getItem('pageBackgroundColor') || '#ffffff';
                  colorInput.addEventListener('change', (e) => {
                    const target = e.target as HTMLInputElement;
                    localStorage.setItem('pageBackgroundColor', target.value);
                    localStorage.removeItem('pageBackgroundGradient');
                    window.location.reload();
                  });
                  colorInput.click();
                }}
              />
              <input
                type="text"
                value={localStorage.getItem('pageBackgroundColor') || ''}
                onChange={(e) => {
                  localStorage.setItem('pageBackgroundColor', e.target.value);
                  localStorage.removeItem('pageBackgroundGradient');
                }}
                className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-400"
                placeholder="#ffffff"
              />
            </div>
            
            {/* Botões de cores rápidas para página */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { name: 'Branco', color: '#ffffff' },
                { name: 'Cinza Claro', color: '#f3f4f6' },
                { name: 'Cinza Escuro', color: '#1f2937' },
                { name: 'Preto', color: '#000000' },
                { name: 'Azul Escuro', color: '#1e40af' },
                { name: 'Verde Escuro', color: '#047857' },
                { name: 'Roxo Escuro', color: '#6b21a8' },
                { name: 'Transparente', color: 'transparent' }
              ].map((bgColor) => (
                <button
                  key={bgColor.name}
                  onClick={() => {
                    localStorage.setItem('pageBackgroundColor', bgColor.color);
                    localStorage.removeItem('pageBackgroundGradient');
                  }}
                  className="p-2 rounded text-xs transition-all hover:scale-105"
                  style={{
                    backgroundColor: bgColor.color,
                    border: bgColor.color === 'transparent' ? '1px dashed #666' : '1px solid #333',
                    color: ['#ffffff', '#f3f4f6', 'transparent'].includes(bgColor.color) ? '#333' : '#fff'
                  }}
                  title={bgColor.name}
                >
                  {bgColor.name === 'Transparente' ? '∅' : bgColor.name.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          {/* Background Gradient da Página */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-2 font-medium">Gradientes de Fundo</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Azul → Roxo', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { name: 'Rosa → Laranja', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
                { name: 'Verde → Azul', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
                { name: 'Sunset', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
                { name: 'Ocean', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
                { name: 'Dark Purple', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { name: 'Mango', gradient: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)' },
                { name: 'Silver', gradient: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' }
              ].map((grad) => (
                <button
                  key={grad.name}
                  onClick={() => {
                    localStorage.setItem('pageBackgroundGradient', grad.gradient);
                    localStorage.removeItem('pageBackgroundColor');
                  }}
                  className="h-12 rounded border border-gray-600 hover:border-gray-400 transition-all transform hover:scale-105 relative overflow-hidden"
                  style={{ background: grad.gradient }}
                  title={grad.name}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white bg-black bg-opacity-40">
                    {grad.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Background Image da Página */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <label className="block text-xs text-gray-300 mb-2 font-medium">Imagem de Fundo da Página</label>
            <input
              type="url"
              value={localStorage.getItem('pageBackgroundImage') || ''}
              onChange={(e) => {
                if (e.target.value) {
                  localStorage.setItem('pageBackgroundImage', e.target.value);
                  localStorage.removeItem('pageBackgroundColor');
                  localStorage.removeItem('pageBackgroundGradient');
                } else {
                  localStorage.removeItem('pageBackgroundImage');
                }
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-400"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            
            {/* Configurações da imagem de fundo */}
            {localStorage.getItem('pageBackgroundImage') && (
              <div className="mt-3 space-y-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tamanho</label>
                  <select
                    value={localStorage.getItem('pageBackgroundSize') || 'cover'}
                    onChange={(e) => localStorage.setItem('pageBackgroundSize', e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                  >
                    <option value="cover">Cover (cobrir)</option>
                    <option value="contain">Contain (conter)</option>
                    <option value="auto">Auto (original)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Posição</label>
                  <select
                    value={localStorage.getItem('pageBackgroundPosition') || 'center'}
                    onChange={(e) => localStorage.setItem('pageBackgroundPosition', e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Topo</option>
                    <option value="bottom">Base</option>
                    <option value="left">Esquerda</option>
                    <option value="right">Direita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Repetição</label>
                  <select
                    value={localStorage.getItem('pageBackgroundRepeat') || 'no-repeat'}
                    onChange={(e) => localStorage.setItem('pageBackgroundRepeat', e.target.value)}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200"
                  >
                    <option value="no-repeat">Não repetir</option>
                    <option value="repeat">Repetir</option>
                    <option value="repeat-x">Repetir horizontal</option>
                    <option value="repeat-y">Repetir vertical</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Reset Página */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <button
              onClick={() => {
                localStorage.removeItem('pageBackgroundColor');
                localStorage.removeItem('pageBackgroundGradient');
                localStorage.removeItem('pageBackgroundImage');
                localStorage.removeItem('pageBackgroundSize');
                localStorage.removeItem('pageBackgroundPosition');
                localStorage.removeItem('pageBackgroundRepeat');
              }}
              className="w-full p-2 text-sm text-red-400 hover:text-red-300 border border-red-600 hover:border-red-500 rounded transition-all"
            >
              🗑️ Remover Background da Página
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};