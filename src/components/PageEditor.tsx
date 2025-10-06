// Função utilitária para remover um elemento (e seus filhos) pelo id
function removeElement(elements: PageElement[], id: string): PageElement[] {
  return elements
    .filter(el => el.id !== id)
    .map(el => ({
      ...el,
      children: removeElement(el.children, id)
    }));
}
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  rectIntersection,
  getFirstCollision,
  UniqueIdentifier,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';
import {
  Type,
  Image,
  Square,
  MousePointer2,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Save,
  Eye,
  Code,
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  Trash2,
  Plus,
  Settings,
  Move,
  Layers,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Grid3X3,
  Container,
  Heading,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Heart,
  Search,
  ShoppingCart,
  Play,
  Pause,
  Volume2,
  Wifi,
  Battery,
  Signal,
  DollarSign,
  BarChart,
  Video,
  Clock,
  Users,
  HelpCircle,
  Check,
  AlertCircle,
  Info,
  FileText,
  ImageIcon,
  FormInput,
  ToggleLeft,
  ListOrdered
} from 'lucide-react';

// Tipos fundamentais do sistema
interface ElementStyle {
  // Layout e Posicionamento
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  
  // Dimensões
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  
  // Flexbox
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string;
  flex?: string;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridGap?: string;
  gridColumn?: string;
  gridRow?: string;
  gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  
  // Imagens
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  
  // Espaçamento
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  
  // Tipografia
  fontSize?: string;
  fontWeight?: string | number;
  fontFamily?: string;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  lineHeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: string;
  
  // Cores
  color?: string;
  backgroundColor?: string;
  
  // Bordas
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  
  // Sombras e Efeitos
  boxShadow?: string;
  textShadow?: string;
  opacity?: number;
  filter?: string;
  backdropFilter?: string;
  
  // Background
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  
  // Transições e Animações
  transition?: string;
  transform?: string;
  animation?: string;
  
  // Box Model
  boxSizing?: 'content-box' | 'border-box';
  
  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  
  // Cursor
  cursor?: string;
  
  // CSS Resize
  resize?: string;
  
  // Responsivo
  '@media (max-width: 768px)'?: Partial<ElementStyle>;
  '@media (max-width: 1024px)'?: Partial<ElementStyle>;
}

interface ElementAttributes {
  id?: string;
  className?: string;
  src?: string;
  alt?: string;
  href?: string;
  target?: string;
  title?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  checked?: boolean;
  selected?: boolean;
  multiple?: boolean;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  min?: string;
  max?: string;
  step?: string;
  pattern?: string;
  autoComplete?: string;
  tabIndex?: number;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  dataTestId?: string;
  controls?: boolean;
  // Atributos para navegação
  'data-action'?: string;
  'data-url'?: string;
  'data-target'?: string;
  'data-section'?: string;
  'data-number'?: string;
  'data-message'?: string;
}

interface ElementEvents {
  onClick?: string;
  onMouseOver?: string;
  onMouseOut?: string;
  onFocus?: string;
  onBlur?: string;
  onChange?: string;
  onSubmit?: string;
  onLoad?: string;
  onError?: string;
  onKeyDown?: string;
  onKeyUp?: string;
  onKeyPress?: string;
}

// Funções auxiliares para navegação
const NavigationHelpers = {
  // Navegar para URL externa
  openExternal: (url: string, target: string = '_blank') => 
    `window.open('${url}', '${target}')`,
  
  // Navegar para página interna (mesmo site)
  goToPage: (url: string) => 
    `window.location.href = '${url}'`,
  
  // Scroll suave para seção
  scrollToSection: (sectionId: string) => 
    `document.getElementById('${sectionId}')?.scrollIntoView({behavior: 'smooth'})`,
  
  // Scroll para elemento por seletor
  scrollToElement: (selector: string) => 
    `document.querySelector('${selector}')?.scrollIntoView({behavior: 'smooth'})`,
  
  // Abrir modal ou popup customizado
  openModal: (modalId: string) => 
    `document.getElementById('${modalId}')?.style.display = 'block'`,
  
  // Telefone ou WhatsApp
  openWhatsApp: (number: string, message: string = '') => 
    `window.open('https://wa.me/${number}?text=${encodeURIComponent(message)}', '_blank')`,
  
  // Email
  openEmail: (email: string, subject: string = '', body: string = '') => 
    `window.location.href = 'mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}'`
};

interface PageElement {
  id: string;
  type: string;
  tagName: string;
  content?: string;
  children: PageElement[];
  styles: ElementStyle;
  attributes: ElementAttributes;
  events: ElementEvents;
  canHaveChildren: boolean;
  isContainer: boolean;
  parentId?: string;
  locked?: boolean;
  hidden?: boolean;
}

interface EditorState {
  elements: PageElement[];
  selectedElementId: string | null;
  hoveredElementId: string | null;
  draggedElementId: string | null;
  viewport: 'desktop' | 'tablet' | 'mobile';
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoom: number;
  history: PageElement[][];
  historyIndex: number;
  isPreviewMode: boolean;
  showCode: boolean;
  globalCSS: string;
}

// Interface para definições de elementos
interface ElementDefinition {
  type: string;
  tagName: string;
  label: string;
  icon: any;
  category: string;
  canHaveChildren: boolean;
  isContainer: boolean;
  defaultStyles?: Partial<ElementStyle>;
  defaultContent?: string;
  defaultAttributes?: Partial<ElementAttributes>;
}

// Definições dos componentes disponíveis
const ELEMENT_DEFINITIONS: Record<string, ElementDefinition> = {
  // Layout Containers
  section: {
    type: 'section',
    tagName: 'section',
    label: 'Seção',
    icon: Layout,
    category: 'layout',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'block',
      padding: '40px 20px',
      backgroundColor: '#ffffff',
      minHeight: '200px'
    }
  },
  container: {
    type: 'container',
    tagName: 'div',
    label: 'Container',
    icon: Container,
    category: 'layout',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'block',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    }
  },
  div: {
    type: 'div',
    tagName: 'div',
    label: 'Div',
    icon: Square,
    category: 'layout',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'block',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      border: '1px dashed #ccc',
      minHeight: '100px'
    }
  },
  flexbox: {
    type: 'flexbox',
    tagName: 'div',
    label: 'Flexbox',
    icon: Grid3X3,
    category: 'layout',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      padding: '20px',
      alignItems: 'stretch',
      justifyContent: 'flex-start'
    }
  },
  grid: {
    type: 'grid',
    tagName: 'div',
    label: 'Grid',
    icon: Grid3X3,
    category: 'layout',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px'
    }
  },
  card: {
    type: 'card',
    tagName: 'div',
    label: 'Card',
    icon: Square,
    category: 'layout',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'block',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }
  },
  
  // Typography
  text: {
    type: 'text',
    tagName: 'p',
    label: 'Texto',
    icon: Type,
    category: 'typography',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Clique para editar este texto',
    defaultStyles: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#333333',
      margin: '0 0 16px 0'
    }
  },
  heading1: {
    type: 'heading1',
    tagName: 'h1',
    label: 'Título H1',
    icon: Heading,
    category: 'typography',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Título Principal',
    defaultStyles: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#1a1a1a',
      margin: '0 0 24px 0',
      lineHeight: '1.2'
    }
  },
  heading2: {
    type: 'heading2',
    tagName: 'h2',
    label: 'Título H2',
    icon: Heading,
    category: 'typography',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Subtítulo',
    defaultStyles: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#2a2a2a',
      margin: '0 0 20px 0',
      lineHeight: '1.3'
    }
  },
  heading3: {
    type: 'heading3',
    tagName: 'h3',
    label: 'Título H3',
    icon: Heading,
    category: 'typography',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Seção',
    defaultStyles: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#3a3a3a',
      margin: '0 0 16px 0',
      lineHeight: '1.4'
    }
  },
  
  // Media
  image: {
    type: 'image',
    tagName: 'img',
    label: 'Imagem',
    icon: Image,
    category: 'media',
    canHaveChildren: false,
    isContainer: false,
    defaultStyles: {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px'
    },
    defaultAttributes: {
      src: 'https://via.placeholder.com/400x300?text=Imagem',
      alt: 'Imagem'
    }
  },
  video: {
    type: 'video',
    tagName: 'video',
    label: 'Vídeo',
    icon: Video,
    category: 'media',
    canHaveChildren: false,
    isContainer: false,
    defaultStyles: {
      display: 'block',
      width: '100%',
      maxWidth: '800px',
      height: 'auto'
    },
    defaultAttributes: {
      controls: true,
      src: ''
    }
  },
  
  // Interactive
  button: {
    type: 'button',
    tagName: 'button',
    label: 'Botão',
    icon: MousePointer2,
    category: 'interactive',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Clique aqui',
    defaultStyles: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  },
  link: {
    type: 'link',
    tagName: 'a',
    label: 'Link',
    icon: Link,
    category: 'interactive',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Clique aqui',
    defaultStyles: {
      color: '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    defaultAttributes: {
      href: '#'
    }
  },
  
  // Forms
  input: {
    type: 'input',
    tagName: 'input',
    label: 'Campo de Texto',
    icon: FormInput,
    category: 'forms',
    canHaveChildren: false,
    isContainer: false,
    defaultStyles: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    defaultAttributes: {
      type: 'text',
      placeholder: 'Digite aqui...'
    }
  },
  textarea: {
    type: 'textarea',
    tagName: 'textarea',
    label: 'Área de Texto',
    icon: FileText,
    category: 'forms',
    canHaveChildren: false,
    isContainer: false,
    defaultStyles: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      resize: 'vertical',
      minHeight: '120px'
    },
    defaultAttributes: {
      placeholder: 'Digite sua mensagem...',
      rows: 5
    }
  },
  select: {
    type: 'select',
    tagName: 'select',
    label: 'Lista Suspensa',
    icon: ChevronDown,
    category: 'forms',
    canHaveChildren: true,
    isContainer: false,
    defaultStyles: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      backgroundColor: '#ffffff'
    }
  },
  checkbox: {
    type: 'checkbox',
    tagName: 'input',
    label: 'Checkbox',
    icon: ToggleLeft,
    category: 'forms',
    canHaveChildren: false,
    isContainer: false,
    defaultAttributes: {
      type: 'checkbox'
    },
    defaultStyles: {
      margin: '0 8px 0 0'
    }
  },
  radio: {
    type: 'radio',
    tagName: 'input',
    label: 'Radio Button',
    icon: ToggleLeft,
    category: 'forms',
    canHaveChildren: false,
    isContainer: false,
    defaultAttributes: {
      type: 'radio',
      name: 'radio-group'
    },
    defaultStyles: {
      margin: '0 8px 0 0'
    }
  },
  
  // Lists
  list: {
    type: 'list',
    tagName: 'ul',
    label: 'Lista',
    icon: List,
    category: 'content',
    canHaveChildren: true,
    isContainer: false,
    defaultStyles: {
      margin: '0 0 16px 0',
      paddingLeft: '20px'
    }
  },
  listOrdered: {
    type: 'listOrdered',
    tagName: 'ol',
    label: 'Lista Numerada',
    icon: ListOrdered,
    category: 'content',
    canHaveChildren: true,
    isContainer: false,
    defaultStyles: {
      margin: '0 0 16px 0',
      paddingLeft: '20px'
    }
  },
  
  // ===== COMPONENTES DE MARKETING DIGITAL =====
  
  // Hero Sections
  heroSection: {
    type: 'heroSection',
    tagName: 'section',
    label: 'Seção Hero',
    icon: Monitor,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '600px',
      padding: '80px 20px',
      backgroundColor: '#0f172a',
      backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff',
      textAlign: 'center' as const
    }
  },
  
  heroWithImage: {
    type: 'heroWithImage',
    tagName: 'section',
    label: 'Hero com Imagem',
    icon: Image,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center',
      minHeight: '500px',
      padding: '60px 40px',
      backgroundColor: '#ffffff'
    }
  },
  
  // Cards de Marketing
  featureCard: {
    type: 'featureCard',
    tagName: 'div',
    label: 'Card de Recurso',
    icon: Square,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      padding: '40px 30px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      textAlign: 'center' as const,
      border: '1px solid #e5e7eb',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }
  },
  
  testimonialCard: {
    type: 'testimonialCard',
    tagName: 'div',
    label: 'Card Depoimento',
    icon: Type,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      padding: '30px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      borderLeft: '4px solid #3b82f6',
      fontStyle: 'italic',
      lineHeight: '1.6'
    }
  },
  
  pricingCard: {
    type: 'pricingCard',
    tagName: 'div',
    label: 'Card de Preço',
    icon: DollarSign,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      padding: '40px 30px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      textAlign: 'center' as const,
      border: '2px solid #e5e7eb',
      position: 'relative',
      transition: 'transform 0.3s ease'
    }
  },
  
  // Botões CTA especializados
  ctaPrimary: {
    type: 'ctaPrimary',
    tagName: 'button',
    label: 'Botão CTA Principal',
    icon: MousePointer2,
    category: 'marketing',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Compre Agora',
    defaultStyles: {
      padding: '16px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
    }
  },

  ctaSecondary: {
    type: 'ctaSecondary',
    tagName: 'button',
    label: 'Botão CTA Secundário',
    icon: MousePointer2,
    category: 'marketing',
    canHaveChildren: false,
    isContainer: false,
    defaultContent: 'Saiba Mais',
    defaultStyles: {
      padding: '16px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#3b82f6',
      backgroundColor: 'transparent',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  },
  
  // Formulários premium
  contactFormComplete: {
    type: 'contactFormComplete',
    tagName: 'form',
    label: '💎 Formulário Premium - Completo',
    icon: Mail,
    category: 'forms',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      padding: '50px',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
      position: 'relative',
      overflow: 'hidden'
    }
  },
  
  contactFormSimple: {
    type: 'contactFormSimple',
    tagName: 'form',
    label: '✨ Formulário Premium - Simples',
    icon: Mail,
    category: 'forms',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      padding: '45px',
      backgroundImage: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
      borderRadius: '18px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      maxWidth: '500px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
      position: 'relative',
      overflow: 'hidden'
    }
  },
  
  contactFormVIP: {
    type: 'contactFormVIP',
    tagName: 'form',
    label: '👑 Formulário VIP - Ultra Premium',
    icon: Mail,
    category: 'forms',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      padding: '60px',
      backgroundImage: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #ff6b6b 100%)',
      borderRadius: '25px',
      boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
      maxWidth: '650px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      position: 'relative',
      overflow: 'hidden',
      border: '2px solid rgba(255,255,255,0.2)'
    }
  },
  
  subscribeForm: {
    type: 'subscribeForm',
    tagName: 'form',
    label: 'Formulário Newsletter',
    icon: Mail,
    category: 'forms',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }
  },
  
  // Inputs de formulário
  formInput: {
    type: 'formInput',
    tagName: 'input',
    label: 'Campo de Entrada',
    icon: Type,
    category: 'forms',
    canHaveChildren: false,
    isContainer: false,
    defaultAttributes: {
      type: 'text',
      placeholder: 'Digite aqui...'
    },
    defaultStyles: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      transition: 'border-color 0.3s ease'
    }
  },
  
  formTextarea: {
    type: 'formTextarea',
    tagName: 'textarea',
    label: 'Área de Texto',
    icon: Type,
    category: 'forms',
    canHaveChildren: false,
    isContainer: false,
    defaultAttributes: {
      placeholder: 'Sua mensagem...',
      rows: 4
    },
    defaultStyles: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      color: '#1f2937',
      resize: 'vertical',
      minHeight: '100px'
    }
  },
  
  // Seções especializadas
  featuresGrid: {
    type: 'featuresGrid',
    tagName: 'section',
    label: 'Grade de Recursos',
    icon: Layout,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      padding: '80px 40px',
      backgroundColor: '#f8fafc'
    }
  },
  
  statsSection: {
    type: 'statsSection',
    tagName: 'section',
    label: 'Seção de Estatísticas',
    icon: BarChart,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '40px',
      padding: '60px 40px',
      backgroundColor: '#1f2937',
      color: '#ffffff',
      textAlign: 'center' as const
    }
  },
  
  // Elementos de mídia
  videoSection: {
    type: 'videoSection',
    tagName: 'div',
    label: 'Seção de Vídeo',
    icon: Video,
    category: 'media',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      position: 'relative',
      padding: '60px 40px',
      backgroundColor: '#000000',
      textAlign: 'center' as const,
      color: '#ffffff'
    }
  },
  
  imageGallery: {
    type: 'imageGallery',
    tagName: 'div',
    label: 'Galeria de Imagens',
    icon: Image,
    category: 'media',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      padding: '40px'
    }
  },
  
  // Componentes especiais
  countdown: {
    type: 'countdown',
    tagName: 'div',
    label: 'Contador Regressivo',
    icon: Clock,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      padding: '40px',
      backgroundColor: '#dc2626',
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center' as const
    }
  },
  
  socialProof: {
    type: 'socialProof',
    tagName: 'div',
    label: 'Prova Social',
    icon: Users,
    category: 'marketing',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '30px',
      backgroundColor: '#f0f9ff',
      borderRadius: '12px',
      border: '1px solid #0284c7'
    }
  },
  
  faqSection: {
    type: 'faqSection',
    tagName: 'div',
    label: 'Seção FAQ',
    icon: HelpCircle,
    category: 'content',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      padding: '60px 40px',
      backgroundColor: '#ffffff',
      maxWidth: '800px',
      margin: '0 auto'
    }
  },

  // === TEMPLATES PRONTOS === //
  
  // Heroes Section Templates
  heroTemplate1: {
    type: 'heroTemplate1',
    tagName: 'section',
    label: 'Hero - Venda Digital',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      padding: '80px 20px',
      textAlign: 'center' as const,
      minHeight: '500px'
    }
  },

  heroTemplate2: {
    type: 'heroTemplate2', 
    tagName: 'section',
    label: 'Hero - Com Vídeo',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '60px 20px',
      textAlign: 'center' as const,
      minHeight: '600px',
      position: 'relative' as const
    }
  },

  heroTemplate3: {
    type: 'heroTemplate3',
    tagName: 'section', 
    label: 'Hero - Minimalista',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f8f9fa',
      color: '#2d3748',
      padding: '100px 20px',
      textAlign: 'center' as const,
      minHeight: '450px'
    }
  },

  heroTemplate4: {
    type: 'heroTemplate4',
    tagName: 'section',
    label: 'Hero - Dupla Coluna',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '60px 20px',
      minHeight: '500px',
      display: 'flex',
      alignItems: 'center'
    }
  },

  heroTemplate5: {
    type: 'heroTemplate5',
    tagName: 'section',
    label: 'Hero - E-commerce',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
      color: '#ffffff',
      padding: '70px 20px',
      textAlign: 'center' as const,
      minHeight: '550px'
    }
  },

  // Pricing Templates
  pricingTemplate1: {
    type: 'pricingTemplate1',
    tagName: 'section',
    label: 'Preços - 3 Colunas',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f7fafc',
      padding: '80px 20px',
      textAlign: 'center' as const
    }
  },

  pricingTemplate2: {
    type: 'pricingTemplate2',
    tagName: 'section',
    label: 'Preços - Simples',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '60px 20px',
      textAlign: 'center' as const,
      borderTop: '1px solid #e2e8f0'
    }
  },

  pricingTemplate3: {
    type: 'pricingTemplate3',
    tagName: 'section',
    label: 'Preços - Premium',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: '#ffffff',
      padding: '80px 20px',
      textAlign: 'center' as const
    }
  },

  // Features Templates
  featuresTemplate1: {
    type: 'featuresTemplate1',
    tagName: 'section',
    label: 'Recursos - Grid 3x2',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '80px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '40px'
    }
  },

  featuresTemplate2: {
    type: 'featuresTemplate2',
    tagName: 'section',
    label: 'Benefícios - Lista',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f8f9fa',
      padding: '60px 20px'
    }
  },

  featuresTemplate3: {
    type: 'featuresTemplate3',
    tagName: 'section',
    label: 'Recursos - Com Imagens',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '80px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '60px'
    }
  },

  // Testimonials Templates
  testimonialsTemplate1: {
    type: 'testimonialsTemplate1',
    tagName: 'section',
    label: 'Depoimentos - Carousel',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f7fafc',
      padding: '80px 20px',
      textAlign: 'center' as const
    }
  },

  testimonialsTemplate2: {
    type: 'testimonialsTemplate2',
    tagName: 'section',
    label: 'Depoimentos - Grid',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '60px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '30px'
    }
  },

  // Contact Templates
  contactTemplate1: {
    type: 'contactTemplate1',
    tagName: 'section',
    label: 'Contato - Formulário',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      padding: '80px 20px',
      textAlign: 'center' as const
    }
  },

  contactTemplate2: {
    type: 'contactTemplate2',
    tagName: 'section',
    label: 'Contato - Com Mapa',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f8f9fa',
      padding: '60px 20px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px'
    }
  },

  // Newsletter Templates
  newsletterTemplate1: {
    type: 'newsletterTemplate1',
    tagName: 'section',
    label: 'Newsletter - CTA',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      padding: '60px 20px',
      textAlign: 'center' as const
    }
  },

  newsletterTemplate2: {
    type: 'newsletterTemplate2',
    tagName: 'section',
    label: 'Newsletter - Lateral',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f7fafc',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '30px'
    }
  },

  // FAQ Templates
  faqTemplate1: {
    type: 'faqTemplate1',
    tagName: 'section',
    label: 'FAQ - Accordion',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '80px 20px',
      maxWidth: '800px',
      margin: '0 auto'
    }
  },

  faqTemplate2: {
    type: 'faqTemplate2',
    tagName: 'section',
    label: 'FAQ - Duas Colunas',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f8f9fa',
      padding: '60px 20px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px'
    }
  },

  // About Templates
  aboutTemplate1: {
    type: 'aboutTemplate1',
    tagName: 'section',
    label: 'Sobre Nós - Story',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '80px 20px',
      textAlign: 'center' as const,
      maxWidth: '900px',
      margin: '0 auto'
    }
  },

  aboutTemplate2: {
    type: 'aboutTemplate2',
    tagName: 'section',
    label: 'Sobre - Com Timeline',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f7fafc',
      padding: '80px 20px'
    }
  },

  // Team Templates
  teamTemplate1: {
    type: 'teamTemplate1',
    tagName: 'section',
    label: 'Equipe - Cards',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '80px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '40px'
    }
  },

  teamTemplate2: {
    type: 'teamTemplate2',
    tagName: 'section',
    label: 'Equipe - Lista',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f8f9fa',
      padding: '60px 20px'
    }
  },

  // Stats Templates
  statsTemplate1: {
    type: 'statsTemplate1',
    tagName: 'section',
    label: 'Estatísticas - 4 Colunas',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      padding: '60px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '30px',
      textAlign: 'center' as const
    }
  },

  statsTemplate2: {
    type: 'statsTemplate2',
    tagName: 'section',
    label: 'Números - Destaque',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      padding: '80px 20px',
      textAlign: 'center' as const
    }
  },

  // CTA Templates
  ctaTemplate1: {
    type: 'ctaTemplate1',
    tagName: 'section',
    label: 'CTA - Urgência',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#e53e3e',
      color: '#ffffff',
      padding: '60px 20px',
      textAlign: 'center' as const
    }
  },

  ctaTemplate2: {
    type: 'ctaTemplate2',
    tagName: 'section',
    label: 'CTA - Garantia',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#38a169',
      color: '#ffffff',
      padding: '60px 20px',
      textAlign: 'center' as const,
      border: '3px solid #2f855a'
    }
  },

  // Product Templates
  productTemplate1: {
    type: 'productTemplate1',
    tagName: 'section',
    label: 'Produto - Showcase',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '80px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '60px'
    }
  },

  productTemplate2: {
    type: 'productTemplate2',
    tagName: 'section',
    label: 'Produto - Features',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#f7fafc',
      padding: '80px 20px',
      textAlign: 'center' as const
    }
  },

  // Footer Templates
  footerTemplate1: {
    type: 'footerTemplate1',
    tagName: 'footer',
    label: 'Footer - Completo',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      padding: '60px 20px 30px',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '40px'
    }
  },

  footerTemplate2: {
    type: 'footerTemplate2',
    tagName: 'footer',
    label: 'Footer - Simples',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#1a202c',
      color: '#ffffff',
      padding: '40px 20px',
      textAlign: 'center' as const,
      borderTop: '3px solid #3182ce'
    }
  },

  // Header Templates
  headerTemplate1: {
    type: 'headerTemplate1',
    tagName: 'header',
    label: 'Header - Navegação',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#ffffff',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky' as const,
      top: '0',
      zIndex: 1000
    }
  },

  headerTemplate2: {
    type: 'headerTemplate2',
    tagName: 'header',
    label: 'Header - Mega Menu',
    icon: Layout,
    category: 'templates',
    canHaveChildren: true,
    isContainer: true,
    defaultStyles: {
      backgroundColor: '#2d3748',
      color: '#ffffff',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }
};

// Componente principal do editor
const PageEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    elements: [],
    selectedElementId: null,
    hoveredElementId: null,
    draggedElementId: null,
    viewport: 'desktop',
    showGrid: false,
    snapToGrid: false,
    gridSize: 20,
    zoom: 1,
    history: [[]],
    historyIndex: 0,
    isPreviewMode: false,
    showCode: false,
    globalCSS: ''
  });

  const [showTemplates, setShowTemplates] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Injetar CSS Global dinamicamente
  useEffect(() => {
    const cssId = 'page-editor-global-css';
    let styleElement = document.getElementById(cssId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = cssId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = editorState.globalCSS;
    
    return () => {
      // Não remover no cleanup para manter os estilos
    };
  }, [editorState.globalCSS]);

  // Forçar direção LTR em todos os textareas e elementos editáveis
  useEffect(() => {
    const textareaStyleId = 'textarea-ltr-fix';
    let textareaStyleElement = document.getElementById(textareaStyleId) as HTMLStyleElement;
    
    if (!textareaStyleElement) {
      textareaStyleElement = document.createElement('style');
      textareaStyleElement.id = textareaStyleId;
      document.head.appendChild(textareaStyleElement);
    }
    
    textareaStyleElement.textContent = `
      textarea, input[type="text"], input[type="email"], input[type="tel"], input[type="url"] {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: embed !important;
        writing-mode: horizontal-tb !important;
      }
      
      [contenteditable="true"] {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: embed !important;
        writing-mode: horizontal-tb !important;
      }
      
      [contenteditable="true"] * {
        direction: ltr !important;
        unicode-bidi: embed !important;
      }
    `;
    
    return () => {
      // Manter os estilos mesmo no cleanup
    };
  }, []);

  // Sensor configuration for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Função para criar template de ebook
  const createEbookTemplate = useCallback(() => {
    // Criar IDs únicos
    const sectionId = uuidv4();
    const containerId = uuidv4();
    const heading1Id = uuidv4();
    const heading2Id = uuidv4();
    const buttonId = uuidv4();
    
    const section2Id = uuidv4();
    const container2Id = uuidv4();
    const benefits2Id = uuidv4();
    const grid2Id = uuidv4();
    const card1Id = uuidv4();
    const card2Id = uuidv4();
    const card3Id = uuidv4();
    
    const section3Id = uuidv4();
    const container3Id = uuidv4();
    const ctaHeading = uuidv4();
    const oldPrice = uuidv4();
    const newPrice = uuidv4();
    const ctaButton = uuidv4();

    const templateElements: PageElement[] = [
      // Header Section
      {
        id: sectionId,
        type: 'section',
        tagName: 'section',
        content: '',
        children: [
          {
            id: containerId,
            type: 'container',
            tagName: 'div',
            content: '',
            parentId: sectionId,
            children: [
              {
                id: heading1Id,
                type: 'heading1',
                tagName: 'h1',
                content: '🚀 TRANSFORME SUA VIDA EM 30 DIAS',
                parentId: containerId,
                children: [],
                styles: {
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textAlign: 'center' as const,
                  margin: '0 0 20px 0',
                  lineHeight: '1.2'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: heading2Id,
                type: 'heading2',
                tagName: 'h2',
                content: 'O Guia Definitivo Para Alcançar Seus Objetivos e Criar a Vida dos Seus Sonhos',
                parentId: containerId,
                children: [],
                styles: {
                  fontSize: '28px',
                  fontWeight: '400',
                  color: '#ffffff',
                  textAlign: 'center' as const,
                  margin: '0 0 40px 0',
                  lineHeight: '1.4',
                  opacity: 0.9
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: buttonId,
                type: 'button',
                tagName: 'button',
                content: '💎 QUERO TRANSFORMAR MINHA VIDA AGORA',
                parentId: containerId,
                children: [],
                styles: {
                  backgroundColor: '#ff6b35',
                  color: '#ffffff',
                  border: 'none',
                  padding: '20px 40px',
                  borderRadius: '50px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  margin: '0 auto',
                  display: 'block',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                  transition: 'all 0.3s ease'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              }
            ],
            styles: {
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 20px',
              textAlign: 'center' as const
            },
            attributes: {},
            events: {},
            canHaveChildren: true,
            isContainer: true
          }
        ],
        styles: {
          backgroundColor: '#667eea',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 20px',
          color: '#ffffff'
        },
        attributes: {},
        events: {},
        canHaveChildren: true,
        isContainer: true
      },
      // Benefits Section com 3 cards
      {
        id: section2Id,
        type: 'section',
        tagName: 'section',
        content: '',
        children: [
          {
            id: container2Id,
            type: 'container',
            tagName: 'div',
            content: '',
            parentId: section2Id,
            children: [
              {
                id: benefits2Id,
                type: 'heading2',
                tagName: 'h2',
                content: '✨ O Que Você Vai Descobrir',
                parentId: container2Id,
                children: [],
                styles: {
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  textAlign: 'center' as const,
                  margin: '0 0 60px 0'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: grid2Id,
                type: 'grid',
                tagName: 'div',
                content: '',
                parentId: container2Id,
                children: [
                  // Card 1
                  {
                    id: card1Id,
                    type: 'card',
                    tagName: 'div',
                    content: '',
                    parentId: grid2Id,
                    children: [
                      {
                        id: uuidv4(),
                        type: 'text',
                        tagName: 'p',
                        content: '🎯',
                        parentId: card1Id,
                        children: [],
                        styles: { fontSize: '48px', textAlign: 'center' as const, margin: '0 0 20px 0' },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      },
                      {
                        id: uuidv4(),
                        type: 'heading3',
                        tagName: 'h3',
                        content: 'Defina Metas Claras',
                        parentId: card1Id,
                        children: [],
                        styles: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#2d3748',
                          textAlign: 'center' as const,
                          margin: '0 0 16px 0'
                        },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      },
                      {
                        id: uuidv4(),
                        type: 'text',
                        tagName: 'p',
                        content: 'Aprenda a definir objetivos específicos, mensuráveis e alcançáveis que realmente funcionam.',
                        parentId: card1Id,
                        children: [],
                        styles: {
                          fontSize: '16px',
                          color: '#4a5568',
                          textAlign: 'center' as const,
                          lineHeight: '1.6'
                        },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      }
                    ],
                    styles: {
                      backgroundColor: '#ffffff',
                      padding: '40px 30px',
                      borderRadius: '15px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      textAlign: 'center' as const
                    },
                    attributes: {},
                    events: {},
                    canHaveChildren: true,
                    isContainer: true
                  },
                  // Card 2
                  {
                    id: card2Id,
                    type: 'card',
                    tagName: 'div',
                    content: '',
                    parentId: grid2Id,
                    children: [
                      {
                        id: uuidv4(),
                        type: 'text',
                        tagName: 'p',
                        content: '⚡',
                        parentId: card2Id,
                        children: [],
                        styles: { fontSize: '48px', textAlign: 'center' as const, margin: '0 0 20px 0' },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      },
                      {
                        id: uuidv4(),
                        type: 'heading3',
                        tagName: 'h3',
                        content: 'Crie Hábitos Poderosos',
                        parentId: card2Id,
                        children: [],
                        styles: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#2d3748',
                          textAlign: 'center' as const,
                          margin: '0 0 16px 0'
                        },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      },
                      {
                        id: uuidv4(),
                        type: 'text',
                        tagName: 'p',
                        content: 'Descubra como formar hábitos que se mantêm e transformam sua rotina automaticamente.',
                        parentId: card2Id,
                        children: [],
                        styles: {
                          fontSize: '16px',
                          color: '#4a5568',
                          textAlign: 'center' as const,
                          lineHeight: '1.6'
                        },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      }
                    ],
                    styles: {
                      backgroundColor: '#ffffff',
                      padding: '40px 30px',
                      borderRadius: '15px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      textAlign: 'center' as const
                    },
                    attributes: {},
                    events: {},
                    canHaveChildren: true,
                    isContainer: true
                  },
                  // Card 3
                  {
                    id: card3Id,
                    type: 'card',
                    tagName: 'div',
                    content: '',
                    parentId: grid2Id,
                    children: [
                      {
                        id: uuidv4(),
                        type: 'text',
                        tagName: 'p',
                        content: '🚀',
                        parentId: card3Id,
                        children: [],
                        styles: { fontSize: '48px', textAlign: 'center' as const, margin: '0 0 20px 0' },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      },
                      {
                        id: uuidv4(),
                        type: 'heading3',
                        tagName: 'h3',
                        content: 'Acelere Resultados',
                        parentId: card3Id,
                        children: [],
                        styles: {
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#2d3748',
                          textAlign: 'center' as const,
                          margin: '0 0 16px 0'
                        },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      },
                      {
                        id: uuidv4(),
                        type: 'text',
                        tagName: 'p',
                        content: 'Técnicas comprovadas para multiplicar seus resultados e alcançar seus objetivos mais rápido.',
                        parentId: card3Id,
                        children: [],
                        styles: {
                          fontSize: '16px',
                          color: '#4a5568',
                          textAlign: 'center' as const,
                          lineHeight: '1.6'
                        },
                        attributes: {},
                        events: {},
                        canHaveChildren: false,
                        isContainer: false
                      }
                    ],
                    styles: {
                      backgroundColor: '#ffffff',
                      padding: '40px 30px',
                      borderRadius: '15px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      textAlign: 'center'
                    },
                    attributes: {},
                    events: {},
                    canHaveChildren: true,
                    isContainer: true
                  }
                ],
                styles: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '30px'
                },
                attributes: {},
                events: {},
                canHaveChildren: true,
                isContainer: true
              }
            ],
            styles: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 20px'
            },
            attributes: {},
            events: {},
            canHaveChildren: true,
            isContainer: true
          }
        ],
        styles: {
          backgroundColor: '#f7fafc',
          padding: '80px 20px'
        },
        attributes: {},
        events: {},
        canHaveChildren: true,
        isContainer: true
      },
      // CTA Section
      {
        id: section3Id,
        type: 'section',
        tagName: 'section',
        content: '',
        children: [
          {
            id: container3Id,
            type: 'container',
            tagName: 'div',
            content: '',
            parentId: section3Id,
            children: [
              {
                id: ctaHeading,
                type: 'heading2',
                tagName: 'h2',
                content: '⚡ OFERTA ESPECIAL - APENAS HOJE!',
                parentId: container3Id,
                children: [],
                styles: {
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textAlign: 'center',
                  margin: '0 0 30px 0'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: oldPrice,
                type: 'text',
                tagName: 'p',
                content: 'De R$ 197,00 por apenas',
                parentId: container3Id,
                children: [],
                styles: {
                  fontSize: '24px',
                  color: '#ffffff',
                  textAlign: 'center',
                  textDecoration: 'line-through',
                  margin: '0 0 10px 0'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: newPrice,
                type: 'text',
                tagName: 'p',
                content: 'R$ 47,00',
                parentId: container3Id,
                children: [],
                styles: {
                  fontSize: '72px',
                  fontWeight: 'bold',
                  color: '#ffd700',
                  textAlign: 'center',
                  margin: '0 0 30px 0'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: ctaButton,
                type: 'button',
                tagName: 'button',
                content: '🔥 COMPRAR AGORA COM 76% DE DESCONTO',
                parentId: container3Id,
                children: [],
                styles: {
                  backgroundColor: '#48bb78',
                  color: '#ffffff',
                  border: 'none',
                  padding: '25px 50px',
                  borderRadius: '50px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  margin: '0 auto',
                  display: 'block',
                  textTransform: 'uppercase',
                  boxShadow: '0 10px 30px rgba(72, 187, 120, 0.4)'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              }
            ],
            styles: {
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 20px',
              textAlign: 'center'
            },
            attributes: {},
            events: {},
            canHaveChildren: true,
            isContainer: true
          }
        ],
        styles: {
          backgroundColor: '#e53e3e',
          padding: '80px 20px'
        },
        attributes: {},
        events: {},
        canHaveChildren: true,
        isContainer: true
      }
    ];

    setEditorState(prev => ({
      ...prev,
      elements: templateElements,
      selectedElementId: null
    }));
    
    console.log('Template criado com 3 cards lado a lado!');
  }, []);

  // ===== FUNÇÕES DE TEMPLATES DE MARKETING =====
  
  // Template Hero Section com CTA
  const createHeroTemplate = useCallback(() => {
    const heroId = uuidv4();
    const contentId = uuidv4();
    const titleId = uuidv4();
    const subtitleId = uuidv4();
    const ctaButtonId = uuidv4();

    const templateElements: PageElement[] = [
      {
        id: heroId,
        type: 'heroSection',
        tagName: 'section',
        content: '',
        parentId: null,
        children: [
          {
            id: contentId,
            type: 'container',
            tagName: 'div',
            content: '',
            parentId: heroId,
            children: [
              {
                id: titleId,
                type: 'heading1',
                tagName: 'h1',
                content: 'Transforme Seu Negócio Hoje',
                parentId: contentId,
                children: [],
                styles: {
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textAlign: 'center',
                  margin: '0 0 24px 0',
                  lineHeight: '1.1'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: subtitleId,
                type: 'text',
                tagName: 'p',
                content: 'Descubra as estratégias que empresas líderes usam para aumentar suas vendas em até 300%. Comece sua transformação digital agora.',
                parentId: contentId,
                children: [],
                styles: {
                  fontSize: '20px',
                  color: '#cbd5e0',
                  textAlign: 'center',
                  margin: '0 0 40px 0',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: ctaButtonId,
                type: 'ctaPrimary',
                tagName: 'button',
                content: 'QUERO TRANSFORMAR MEU NEGÓCIO',
                parentId: contentId,
                children: [],
                styles: {
                  padding: '20px 40px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  backgroundColor: '#48bb78',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 20px rgba(72, 187, 120, 0.4)',
                  transition: 'all 0.3s ease'
                },
                attributes: {},
                events: {},
                canHaveChildren: false,
                isContainer: false
              }
            ],
            styles: {
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center'
            },
            attributes: {},
            events: {},
            canHaveChildren: true,
            isContainer: true
          }
        ],
        styles: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '600px',
          padding: '80px 20px',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          textAlign: 'center'
        },
        attributes: {},
        events: {},
        canHaveChildren: true,
        isContainer: true
      }
    ];

    setEditorState(prev => ({
      ...prev,
      elements: templateElements,
      selectedElementId: null
    }));
  }, []);

  // Template de Pricing com 3 planos
  const createPricingTemplate = useCallback(() => {
    const sectionId = uuidv4();
    const titleId = uuidv4();
    const gridId = uuidv4();
    const basicCardId = uuidv4();
    const proCardId = uuidv4();
    const premiumCardId = uuidv4();

    const createPricingCard = (cardId: string, plan: string, price: string, features: string[], isPopular: boolean = false) => ({
      id: cardId,
      type: 'pricingCard',
      tagName: 'div',
      content: '',
      parentId: gridId,
      children: [
        {
          id: uuidv4(),
          type: 'heading3',
          tagName: 'h3',
          content: plan,
          parentId: cardId,
          children: [],
          styles: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2d3748',
            textAlign: 'center' as const,
            margin: '0 0 16px 0'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false
        },
        {
          id: uuidv4(),
          type: 'text',
          tagName: 'div',
          content: price,
          parentId: cardId,
          children: [],
          styles: {
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#3b82f6',
            textAlign: 'center' as const,
            margin: '0 0 24px 0'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false
        },
        ...features.map(feature => ({
          id: uuidv4(),
          type: 'text',
          tagName: 'p',
          content: `✓ ${feature}`,
          parentId: cardId,
          children: [],
          styles: {
            fontSize: '16px',
            color: '#4a5568',
            margin: '0 0 12px 0',
            textAlign: 'left' as const
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false
        })),
        {
          id: uuidv4(),
          type: isPopular ? 'ctaPrimary' : 'ctaSecondary',
          tagName: 'button',
          content: 'ESCOLHER PLANO',
          parentId: cardId,
          children: [],
          styles: {
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '24px',
            ...(isPopular ? {
              color: '#ffffff',
              backgroundColor: '#3b82f6',
              border: 'none'
            } : {
              color: '#3b82f6',
              backgroundColor: 'transparent',
              border: '2px solid #3b82f6'
            }),
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false
        }
      ],
      styles: {
        padding: '40px 30px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: isPopular ? '0 15px 35px rgba(59, 130, 246, 0.2)' : '0 8px 25px rgba(0,0,0,0.1)',
        textAlign: 'center' as const,
        border: isPopular ? '3px solid #3b82f6' : '2px solid #e5e7eb',
        position: 'relative' as const,
        transform: isPopular ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      },
      attributes: {},
      events: {},
      canHaveChildren: true,
      isContainer: true
    });

    const templateElements: PageElement[] = [
      {
        id: sectionId,
        type: 'section',
        tagName: 'section',
        content: '',
        parentId: null,
        children: [
          {
            id: titleId,
            type: 'heading2',
            tagName: 'h2',
            content: 'Escolha o Plano Ideal Para Você',
            parentId: sectionId,
            children: [],
            styles: {
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#2d3748',
              textAlign: 'center',
              margin: '0 0 60px 0'
            },
            attributes: {},
            events: {},
            canHaveChildren: false,
            isContainer: false
          },
          {
            id: gridId,
            type: 'container',
            tagName: 'div',
            content: '',
            parentId: sectionId,
            children: [
              createPricingCard(basicCardId, 'Básico', 'R$ 97', ['Acesso por 30 dias', 'Suporte por email', '10 templates', 'Relatórios básicos']),
              createPricingCard(proCardId, 'Profissional', 'R$ 197', ['Acesso por 90 dias', 'Suporte prioritário', '50 templates', 'Relatórios avançados', 'Integração com ferramentas'], true),
              createPricingCard(premiumCardId, 'Premium', 'R$ 397', ['Acesso vitalício', 'Suporte 24/7', 'Templates ilimitados', 'Relatórios personalizados', 'Consultoria 1:1', 'Bônus exclusivos'])
            ],
            styles: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto'
            },
            attributes: {},
            events: {},
            canHaveChildren: true,
            isContainer: true
          }
        ],
        styles: {
          padding: '100px 40px',
          backgroundColor: '#f7fafc'
        },
        attributes: {},
        events: {},
        canHaveChildren: true,
        isContainer: true
      }
    ];

    setEditorState(prev => ({
      ...prev,
      elements: templateElements,
      selectedElementId: null
    }));
  }, []);

  // Template de Depoimentos
  const createTestimonialsTemplate = useCallback(() => {
    const sectionId = uuidv4();
    const titleId = uuidv4();
    const gridId = uuidv4();

    const createTestimonial = (name: string, role: string, content: string, avatar: string) => ({
      id: uuidv4(),
      type: 'testimonialCard',
      tagName: 'div',
      content: '',
      parentId: gridId,
      children: [
        {
          id: uuidv4(),
          type: 'text',
          tagName: 'p',
          content: `"${content}"`,
          parentId: '',
          children: [],
          styles: {
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#4a5568',
            marginBottom: '20px',
            fontStyle: 'italic' as const
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false
        },
        {
          id: uuidv4(),
          type: 'text',
          tagName: 'div',
          content: `${name} - ${role}`,
          parentId: '',
          children: [],
          styles: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2d3748'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false
        }
      ],
      styles: {
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        borderLeft: '4px solid #3b82f6',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      },
      attributes: {},
      events: {},
      canHaveChildren: true,
      isContainer: true
    });

    const templateElements: PageElement[] = [
      {
        id: sectionId,
        type: 'section',
        tagName: 'section',
        content: '',
        parentId: null,
        children: [
          {
            id: titleId,
            type: 'heading2',
            tagName: 'h2',
            content: 'O Que Nossos Clientes Dizem',
            parentId: sectionId,
            children: [],
            styles: {
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#2d3748',
              textAlign: 'center',
              margin: '0 0 60px 0'
            },
            attributes: {},
            events: {},
            canHaveChildren: false,
            isContainer: false
          },
          {
            id: gridId,
            type: 'container',
            tagName: 'div',
            content: '',
            parentId: sectionId,
            children: [
              createTestimonial('Maria Silva', 'CEO da TechCorp', 'Aumentamos nossas vendas em 250% em apenas 3 meses. A estratégia funcionou perfeitamente!', ''),
              createTestimonial('João Santos', 'Diretor de Marketing', 'O melhor investimento que fizemos este ano. Resultados surpreendentes desde a primeira semana.', ''),
              createTestimonial('Ana Costa', 'Empreendedora', 'Finalmente encontrei um método que realmente funciona. Recomendo para todos os empresários.', '')
            ],
            styles: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto'
            },
            attributes: {},
            events: {},
            canHaveChildren: true,
            isContainer: true
          }
        ],
        styles: {
          padding: '80px 40px',
          backgroundColor: '#f8fafc'
        },
        attributes: {},
        events: {},
        canHaveChildren: true,
        isContainer: true
      }
    ];

    setEditorState(prev => ({
      ...prev,
      elements: templateElements,
      selectedElementId: null
    }));
  }, []);

  // Template de Formulário de Contato
  const createContactTemplate = useCallback(() => {
    const sectionId = uuidv4();
    const titleId = uuidv4();
    const formId = uuidv4();

    const templateElements: PageElement[] = [
      {
        id: sectionId,
        type: 'section',
        tagName: 'section',
        content: '',
        parentId: null,
        children: [
          {
            id: titleId,
            type: 'heading2',
            tagName: 'h2',
            content: 'Entre em Contato Conosco',
            parentId: sectionId,
            children: [],
            styles: {
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#2d3748',
              textAlign: 'center',
              margin: '0 0 40px 0'
            },
            attributes: {},
            events: {},
            canHaveChildren: false,
            isContainer: false
          },
          {
            id: formId,
            type: 'contactFormComplete',
            tagName: 'form',
            content: '',
            parentId: sectionId,
            children: [
              {
                id: uuidv4(),
                type: 'formInput',
                tagName: 'input',
                content: '',
                parentId: formId,
                children: [],
                styles: {
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  marginBottom: '20px'
                },
                attributes: {
                  type: 'text',
                  placeholder: 'Seu nome completo',
                  name: 'name'
                },
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: uuidv4(),
                type: 'formInput',
                tagName: 'input',
                content: '',
                parentId: formId,
                children: [],
                styles: {
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  marginBottom: '20px'
                },
                attributes: {
                  type: 'email',
                  placeholder: 'Seu melhor email',
                  name: 'email'
                },
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: uuidv4(),
                type: 'formTextarea',
                tagName: 'textarea',
                content: '',
                parentId: formId,
                children: [],
                styles: {
                  width: '100%',
                  padding: '16px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  marginBottom: '30px',
                  minHeight: '120px'
                },
                attributes: {
                  placeholder: 'Conte-nos como podemos ajudá-lo...',
                  name: 'message',
                  rows: 5
                },
                events: {},
                canHaveChildren: false,
                isContainer: false
              },
              {
                id: uuidv4(),
                type: 'ctaPrimary',
                tagName: 'button',
                content: 'ENVIAR MENSAGEM',
                parentId: formId,
                children: [],
                styles: {
                  width: '100%',
                  padding: '18px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                },
                attributes: {
                  type: 'submit'
                },
                events: {},
                canHaveChildren: false,
                isContainer: false
              }
            ],
            styles: {
              padding: '40px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              maxWidth: '600px',
              margin: '0 auto'
            },
            attributes: {},
            events: {},
            canHaveChildren: true,
            isContainer: true
          }
        ],
        styles: {
          padding: '80px 40px',
          backgroundColor: '#f7fafc'
        },
        attributes: {},
        events: {},
        canHaveChildren: true,
        isContainer: true
      }
    ];

    setEditorState(prev => ({
      ...prev,
      elements: templateElements,
      selectedElementId: null
    }));
  }, []);

  // ===== FUNÇÕES AUXILIARES PARA COMPONENTES DE MARKETING =====
  
  // Função para criar elementos especializados quando arrastados da biblioteca
  const createMarketingElement = useCallback((type: string, parentId?: string): PageElement => {
    const baseElement = createElement(type, parentId);
    
    // Personalizar elementos específicos de marketing com conteúdo pronto
    switch (type) {
      case 'featureCard':
        return {
          ...baseElement,
          children: [
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'div',
              content: '🚀',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '48px',
                textAlign: 'center',
                margin: '0 0 20px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'heading3',
              tagName: 'h3',
              content: 'Recurso Incrível',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2d3748',
                textAlign: 'center',
                margin: '0 0 16px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Descrição detalhada do seu recurso que mostra o valor para o cliente.',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                color: '#4a5568',
                textAlign: 'center',
                lineHeight: '1.6'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };
        
      case 'testimonialCard':
        return {
          ...baseElement,
          children: [
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: '"Este produto mudou completamente meu negócio. Recomendo para todos!"',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '18px',
                fontStyle: 'italic',
                color: '#4a5568',
                margin: '0 0 20px 0',
                lineHeight: '1.6'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'div',
              content: '⭐⭐⭐⭐⭐',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '20px',
                margin: '0 0 12px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Maria Silva - CEO da TechCorp',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#2d3748'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };
        
      case 'pricingCard':
        return {
          ...baseElement,
          children: [
            {
              id: uuidv4(),
              type: 'heading3',
              tagName: 'h3',
              content: 'Plano Professional',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2d3748',
                textAlign: 'center',
                margin: '0 0 16px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'div',
              content: 'R$ 197',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#3b82f6',
                textAlign: 'center',
                margin: '0 0 8px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: '/mês',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                color: '#6b7280',
                textAlign: 'center',
                margin: '0 0 24px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: '✓ Acesso completo\n✓ Suporte prioritário\n✓ Templates ilimitados',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                color: '#4a5568',
                lineHeight: '1.8',
                margin: '0 0 24px 0',
                textAlign: 'left'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'ctaPrimary',
              tagName: 'button',
              content: 'ESCOLHER PLANO',
              parentId: baseElement.id,
              children: [],
              styles: {
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#ffffff',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };

      // ===== HERO TEMPLATES =====
      case 'heroTemplate1':
        const heroT1BadgeId = uuidv4();
        const heroT1TitleId = uuidv4();
        const heroT1SubtitleId = uuidv4();
        const heroT1BenefitsId = uuidv4();
        const heroT1CtaId = uuidv4();
        const heroT1SocialProofId = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: heroT1BadgeId,
              type: 'text',
              tagName: 'div',
              content: '🚀 +10.000 EMPRESÁRIOS JÁ TRANSFORMARAM SEUS NEGÓCIOS',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ffd700',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                border: '1px solid #ffd700'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT1TitleId,
              type: 'heading1',
              tagName: 'h1',
              content: 'Descubra o Sistema que Gera R$ 50.000/Mês no Piloto Automático',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '58px',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center' as const,
                margin: '0 0 24px 0',
                lineHeight: '1.1',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT1SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Mesmo que você nunca tenha vendido nada online, não entenda de tecnologia e tenha apenas 2 horas por dia. Garantido em 30 dias ou seu dinheiro de volta.',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '22px',
                color: '#e2e8f0',
                textAlign: 'center' as const,
                margin: '0 0 30px 0',
                lineHeight: '1.5',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '300'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT1BenefitsId,
              type: 'text',
              tagName: 'div',
              content: '✅ Sistema 100% Automatizado\n✅ Suporte VIP Incluso\n✅ Resultados em 7 Dias\n✅ Garantia de 30 Dias',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '18px',
                color: '#a7f3d0',
                textAlign: 'center' as const,
                margin: '0 0 40px 0',
                lineHeight: '2.2',
                fontWeight: 'bold'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT1CtaId,
              type: 'ctaPrimary',
              tagName: 'button',
              content: '🔥 SIM! QUERO FATURAR R$ 50K/MÊS',
              parentId: baseElement.id,
              children: [],
              styles: {
                padding: '25px 50px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000000',
                backgroundColor: '#ffd700',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)',
                transition: 'transform 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT1SocialProofId,
              type: 'text',
              tagName: 'p',
              content: '⭐⭐⭐⭐⭐ Avaliação 4.9/5 de 2.847 alunos',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                color: '#ffd700',
                textAlign: 'center' as const,
                margin: '30px 0 0 0',
                fontWeight: 'bold'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };

      case 'heroTemplate2':
        const heroT2BadgeId = uuidv4();
        const heroT2VideoId = uuidv4();
        const heroT2TitleId = uuidv4();
        const heroT2SubtitleId = uuidv4();
        const heroT2PlayBtnId = uuidv4();
        const heroT2BonusId = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: heroT2BadgeId,
              type: 'text',
              tagName: 'div',
              content: '🎥 VÍDEO EXCLUSIVO - APENAS HOJE',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#ff4444',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: 'rgba(255, 68, 68, 0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                border: '1px solid #ff4444',
                animation: 'pulse 2s infinite'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT2TitleId,
              type: 'heading1',
              tagName: 'h1',
              content: 'Como Ganhei R$ 127.000 em 30 Dias Vendendo Digital',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '52px',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                lineHeight: '1.2',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT2SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Neste vídeo GRATUITO de 47 minutos, revelo passo a passo o método exato que uso para gerar 6 dígitos por mês, mesmo começando do zero.',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '20px',
                color: '#d1d5db',
                textAlign: 'center' as const,
                margin: '0 0 30px 0',
                lineHeight: '1.5',
                maxWidth: '650px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT2VideoId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '▶️',
                  parentId: heroT2VideoId,
                  children: [],
                  styles: {
                    fontSize: '80px',
                    color: '#ffd700',
                    textAlign: 'center' as const,
                    margin: '0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'CLIQUE PARA ASSISTIR',
                  parentId: heroT2VideoId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#ffffff',
                    textAlign: 'center' as const,
                    margin: '10px 0 0 0',
                    fontWeight: 'bold',
                    letterSpacing: '2px'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                width: '100%',
                maxWidth: '600px',
                height: '350px',
                backgroundColor: '#1a1a1a',
                borderRadius: '15px',
                margin: '0 auto 30px auto',
                position: 'relative' as const,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #ffd700',
                cursor: 'pointer',
                boxShadow: '0 15px 35px rgba(255, 215, 0, 0.3)',
                transition: 'transform 0.3s ease'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: heroT2PlayBtnId,
              type: 'ctaPrimary',
              tagName: 'button',
              content: '🎬 ASSISTIR VÍDEO GRATUITO AGORA',
              parentId: baseElement.id,
              children: [],
              styles: {
                padding: '20px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#000000',
                backgroundColor: '#ffd700',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                margin: '0 0 20px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT2BonusId,
              type: 'text',
              tagName: 'p',
              content: '🎁 BÔNUS: Quem assistir até o final ganha acesso ao meu checklist de R$ 297 GRÁTIS',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                color: '#a7f3d0',
                textAlign: 'center' as const,
                margin: '0',
                fontWeight: 'bold',
                fontStyle: 'italic' as const
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };

      case 'heroTemplate3':
        const heroT3BadgeId = uuidv4();
        const heroT3TitleId = uuidv4();
        const heroT3SubtitleId = uuidv4();
        const heroT3StatsId = uuidv4();
        const heroT3CtaId = uuidv4();
        const heroT3TrustId = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: heroT3BadgeId,
              type: 'text',
              tagName: 'div',
              content: '🏆 MÉTODO #1 EM VENDAS ONLINE NO BRASIL',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#059669',
                textAlign: 'center' as const,
                margin: '0 0 30px 0',
                backgroundColor: '#d1fae5',
                padding: '12px 24px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #059669'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT3TitleId,
              type: 'heading1',
              tagName: 'h1',
              content: 'O Sistema Mais Simples Para Vender Online',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                lineHeight: '1.1'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT3SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Sem complicação, sem enrolação. Apenas um método direto que já ajudou mais de 15.000 pessoas a conquistarem sua liberdade financeira.',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '20px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 40px 0',
                lineHeight: '1.6',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT3StatsId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '15.000+\nAlunos',
                  parentId: heroT3StatsId,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    lineHeight: '1.2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'R$ 2.8M+\nFaturados',
                  parentId: heroT3StatsId,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    lineHeight: '1.2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '4.9/5⭐\nAvaliação',
                  parentId: heroT3StatsId,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    lineHeight: '1.2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '40px',
                margin: '0 0 50px 0',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: heroT3CtaId,
              type: 'ctaPrimary',
              tagName: 'button',
              content: 'QUERO COMEÇAR AGORA',
              parentId: baseElement.id,
              children: [],
              styles: {
                padding: '20px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ffffff',
                backgroundColor: '#059669',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(5, 150, 105, 0.3)',
                margin: '0 0 30px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: heroT3TrustId,
              type: 'text',
              tagName: 'p',
              content: '🔒 Garantia incondicional de 30 dias • 💳 Parcelamento em até 12x',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0',
                fontWeight: 'bold'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };

      // ===== PRICING TEMPLATES =====
      case 'pricingTemplate1':
        const pricingT1BadgeId = uuidv4();
        const pricingT1TitleId = uuidv4();
        const pricingT1SubtitleId = uuidv4();
        const pricingT1BasicId = uuidv4();
        const pricingT1ProId = uuidv4();
        const pricingT1PremiumId = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: pricingT1BadgeId,
              type: 'text',
              tagName: 'div',
              content: '⚡ ÚLTIMA SEMANA COM 70% DE DESCONTO',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#dc2626',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: '#fee2e2',
                padding: '12px 24px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #dc2626',
                animation: 'pulse 2s infinite'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT1TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Escolha Seu Plano e Comece a Faturar Hoje',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 15px 0',
                lineHeight: '1.2'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT1SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Garantia de 30 dias ou seu dinheiro de volta. Sem pegadinhas.',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '18px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 50px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT1BasicId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'INICIANTE',
                  parentId: pricingT1BasicId,
                  children: [],
                  styles: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#374151',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'R$ 197',
                  parentId: pricingT1BasicId,
                  children: [],
                  styles: {
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 5px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'à vista ou 12x de R$ 19,70',
                  parentId: pricingT1BasicId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '0 0 25px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Método Completo\n✅ 40+ Vídeo Aulas\n✅ Suporte por Email\n✅ Garantia 30 dias\n✅ Acesso Vitalício',
                  parentId: pricingT1BasicId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'left' as const,
                    margin: '0 0 25px 0',
                    lineHeight: '2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'ctaSecondary',
                  tagName: 'button',
                  content: 'ESCOLHER INICIANTE',
                  parentId: pricingT1BasicId,
                  children: [],
                  styles: {
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#374151',
                    backgroundColor: '#ffffff',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '40px 30px',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center' as const,
                border: '2px solid #e5e7eb'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: pricingT1ProId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '🔥 MAIS VENDIDO',
                  parentId: pricingT1ProId,
                  children: [],
                  styles: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#dc2626',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    margin: '0 auto 15px auto',
                    display: 'inline-block'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'PROFISSIONAL',
                  parentId: pricingT1ProId,
                  children: [],
                  styles: {
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'R$ 397',
                  parentId: pricingT1ProId,
                  children: [],
                  styles: {
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: '#1d4ed8',
                    textAlign: 'center' as const,
                    margin: '0 0 5px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'à vista ou 12x de R$ 39,70',
                  parentId: pricingT1ProId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '0 0 25px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Tudo do Iniciante +\n✅ Mentoria em Grupo\n✅ Templates Exclusivos\n✅ Suporte Prioritário\n✅ Bônus: Tráfego Pago\n✅ Grupo VIP no Telegram',
                  parentId: pricingT1ProId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'left' as const,
                    margin: '0 0 25px 0',
                    lineHeight: '2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'ctaPrimary',
                  tagName: 'button',
                  content: 'QUERO SER PRO 🚀',
                  parentId: pricingT1ProId,
                  children: [],
                  styles: {
                    width: '100%',
                    padding: '18px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#1d4ed8',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(29, 78, 216, 0.3)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '40px 30px',
                borderRadius: '16px',
                boxShadow: '0 15px 40px rgba(29, 78, 216, 0.2)',
                textAlign: 'center' as const,
                border: '3px solid #1d4ed8',
                transform: 'scale(1.05)',
                position: 'relative' as const
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: pricingT1PremiumId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'PREMIUM VIP',
                  parentId: pricingT1PremiumId,
                  children: [],
                  styles: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#92400e',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'R$ 797',
                  parentId: pricingT1PremiumId,
                  children: [],
                  styles: {
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#92400e',
                    textAlign: 'center' as const,
                    margin: '0 0 5px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'à vista ou 12x de R$ 79,70',
                  parentId: pricingT1PremiumId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '0 0 25px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Tudo do Profissional +\n✅ Mentoria 1 para 1\n✅ 3 Meses de Suporte VIP\n✅ Revisão de Negócio\n✅ Acesso a Masterminds\n✅ Certificado Exclusivo',
                  parentId: pricingT1PremiumId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#374151',
                    textAlign: 'left' as const,
                    margin: '0 0 25px 0',
                    lineHeight: '2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'ctaSecondary',
                  tagName: 'button',
                  content: 'ESCOLHER PREMIUM',
                  parentId: pricingT1PremiumId,
                  children: [],
                  styles: {
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#92400e',
                    backgroundColor: '#ffffff',
                    border: '2px solid #92400e',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '40px 30px',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center' as const,
                border: '2px solid #e5e7eb'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      // ===== FEATURES TEMPLATES =====
      case 'featuresTemplate1':
        const featuresT1BadgeId = uuidv4();
        const featuresT1TitleId = uuidv4();
        const featuresT1SubtitleId = uuidv4();
        const featuresT1Card1Id = uuidv4();
        const featuresT1Card2Id = uuidv4();
        const featuresT1Card3Id = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: featuresT1BadgeId,
              type: 'text',
              tagName: 'div',
              content: '🚀 TUDO QUE VOCÊ PRECISA PARA VENDER',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1d4ed8',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: '#dbeafe',
                padding: '12px 24px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #1d4ed8',
                gridColumn: '1 / -1'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: featuresT1TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Sistema Completo Para Sua Transformação Digital',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 15px 0',
                gridColumn: '1 / -1',
                lineHeight: '1.2'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: featuresT1SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Tudo que você precisa para sair do zero e faturar alto no digital',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '18px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 60px 0',
                gridColumn: '1 / -1'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: featuresT1Card1Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '📈',
                  parentId: featuresT1Card1Id,
                  children: [],
                  styles: {
                    fontSize: '48px',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'Estratégias de Vendas',
                  parentId: featuresT1Card1Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 15px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Aprenda as estratégias exatas que nossos alunos usam para faturar de R$ 10k a R$ 100k por mês. Métodos testados e aprovados.',
                  parentId: featuresT1Card1Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    lineHeight: '1.6',
                    margin: '0 0 25px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Funis de Vendas\n✅ Copy Persuasiva\n✅ Gatilhos Mentais\n✅ Técnicas de Fechamento',
                  parentId: featuresT1Card1Id,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#059669',
                    textAlign: 'left' as const,
                    lineHeight: '1.8',
                    margin: '0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '40px 30px',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center' as const,
                border: '1px solid #e5e7eb',
                transition: 'transform 0.3s ease'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: featuresT1Card2Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '🎯',
                  parentId: featuresT1Card2Id,
                  children: [],
                  styles: {
                    fontSize: '48px',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'Tráfego Qualificado',
                  parentId: featuresT1Card2Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 15px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Domine o tráfego pago e orgânico. Aprenda a atrair clientes qualificados que realmente querem comprar seus produtos.',
                  parentId: featuresT1Card2Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    lineHeight: '1.6',
                    margin: '0 0 25px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Facebook e Instagram Ads\n✅ Google Ads\n✅ SEO e Conteúdo\n✅ Marketing de Influência',
                  parentId: featuresT1Card2Id,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#059669',
                    textAlign: 'left' as const,
                    lineHeight: '1.8',
                    margin: '0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '40px 30px',
                borderRadius: '16px',
                boxShadow: '0 12px 35px rgba(29, 78, 216, 0.15)',
                textAlign: 'center' as const,
                border: '2px solid #1d4ed8',
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: featuresT1Card3Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '💰',
                  parentId: featuresT1Card3Id,
                  children: [],
                  styles: {
                    fontSize: '48px',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'Automação de Vendas',
                  parentId: featuresT1Card3Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 15px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Configure sistemas que vendem 24/7 por você. Tenha um negócio que funciona mesmo enquanto você dorme.',
                  parentId: featuresT1Card3Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    lineHeight: '1.6',
                    margin: '0 0 25px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ CRM e Email Marketing\n✅ Chatbots Inteligentes\n✅ Follow-up Automático\n✅ Remarketing Avançado',
                  parentId: featuresT1Card3Id,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#059669',
                    textAlign: 'left' as const,
                    lineHeight: '1.8',
                    margin: '0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '40px 30px',
                borderRadius: '16px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                textAlign: 'center' as const,
                border: '1px solid #e5e7eb',
                transition: 'transform 0.3s ease'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      // ===== CTA TEMPLATES SUPER PREMIUM =====
      case 'ctaTemplate1':
        const premiumCTA1BadgeId = uuidv4();
        const premiumCTA1TitleId = uuidv4();
        const premiumCTA1SubtitleId = uuidv4();
        const premiumCTA1TimerId = uuidv4();
        const premiumCTA1PriceId = uuidv4();
        const premiumCTA1ButtonId = uuidv4();
        const premiumCTA1BonusId = uuidv4();
        const premiumCTA1GuaranteeId = uuidv4();
        const premiumCTA1UrgencyId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '80px 60px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            position: 'relative' as const,
            overflow: 'hidden',
            textAlign: 'center' as const
          },
          children: [
            // Background effects
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [],
              styles: {
                position: 'absolute' as const,
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '50%',
                animation: 'pulse 4s infinite',
                zIndex: 1
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Content wrapper
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: premiumCTA1BadgeId,
                  type: 'text',
                  tagName: 'div',
                  content: '🚨 OFERTA RELÂMPAGO - APENAS HOJE',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    padding: '15px 30px',
                    borderRadius: '30px',
                    display: 'inline-block',
                    border: '2px solid #fbbf24',
                    marginBottom: '30px',
                    animation: 'bounce 2s infinite',
                    backdropFilter: 'blur(10px)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: premiumCTA1TitleId,
                  type: 'heading2',
                  tagName: 'h2',
                  content: 'ÚLTIMA CHANCE: 85% DE DESCONTO',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '58px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    margin: '0 0 20px 0',
                    lineHeight: '1.1',
                    textShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: premiumCTA1SubtitleId,
                  type: 'text',
                  tagName: 'p',
                  content: 'Sistema completo que já transformou mais de 12.847 empreendedores em milionários digitais',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '24px',
                    color: 'rgba(255,255,255,0.9)',
                    margin: '0 0 40px 0',
                    lineHeight: '1.4',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                // Timer dramatic
                {
                  id: premiumCTA1TimerId,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'TEMPO RESTANTE:',
                      parentId: premiumCTA1TimerId,
                      children: [],
                      styles: {
                        fontSize: '16px',
                        color: '#fbbf24',
                        marginBottom: '15px',
                        fontWeight: 'bold',
                        letterSpacing: '2px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '07:45:23',
                      parentId: premiumCTA1TimerId,
                      children: [],
                      styles: {
                        fontSize: '64px',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        fontFamily: 'monospace',
                        textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                        marginBottom: '10px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'HORAS : MINUTOS : SEGUNDOS',
                      parentId: premiumCTA1TimerId,
                      children: [],
                      styles: {
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '3px',
                        marginBottom: '50px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '40px 60px',
                    borderRadius: '20px',
                    marginBottom: '50px',
                    border: '2px solid rgba(251, 191, 36, 0.3)',
                    backdropFilter: 'blur(10px)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                // Price comparison
                {
                  id: premiumCTA1PriceId,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'De R$ 3.497',
                      parentId: premiumCTA1PriceId,
                      children: [],
                      styles: {
                        fontSize: '32px',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'line-through',
                        marginBottom: '10px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'Por apenas R$ 497',
                      parentId: premiumCTA1PriceId,
                      children: [],
                      styles: {
                        fontSize: '72px',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        textShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
                        marginBottom: '10px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'ou 12x de R$ 49,70',
                      parentId: premiumCTA1PriceId,
                      children: [],
                      styles: {
                        fontSize: '24px',
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '40px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    marginBottom: '50px'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                // CTA Button mega
                {
                  id: premiumCTA1ButtonId,
                  type: 'ctaPrimary',
                  tagName: 'button',
                  content: '🔥 QUERO GARANTIR AGORA - 85% OFF! 🔥',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    padding: '30px 80px',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#000000',
                    backgroundColor: '#fbbf24',
                    border: '4px solid #ffffff',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 20px 50px rgba(251, 191, 36, 0.6)',
                    transform: 'scale(1)',
                    transition: 'all 0.3s ease',
                    animation: 'pulse 2s infinite',
                    marginBottom: '20px',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1px'
                  },
                  attributes: {
                    'data-action': 'navigate',
                    'data-url': 'https://checkout.exemplo.com/comprar',
                    'data-target': '_blank'
                  },
                  events: {
                    onClick: NavigationHelpers.openExternal('https://checkout.exemplo.com/comprar', '_blank')
                  },
                  canHaveChildren: false,
                  isContainer: false
                },
                // Botão Secundário - Ver Depoimentos
                {
                  id: uuidv4(),
                  type: 'ctaSecondary',
                  tagName: 'button',
                  content: '👁 Ver Depoimentos de Clientes',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    padding: '20px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    backgroundColor: 'transparent',
                    border: '2px solid #fbbf24',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    marginBottom: '15px',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '1px',
                    transition: 'all 0.3s ease'
                  },
                  attributes: {
                    'data-action': 'scroll',
                    'data-section': 'depoimentos'
                  },
                  events: {
                    onClick: NavigationHelpers.scrollToSection('depoimentos')
                  },
                  canHaveChildren: false,
                  isContainer: false
                },
                // Botão WhatsApp
                {
                  id: uuidv4(),
                  type: 'ctaSecondary',
                  tagName: 'button',
                  content: '📱 Falar no WhatsApp',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    padding: '15px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#25D366',
                    backgroundColor: 'transparent',
                    border: '2px solid #25D366',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    marginBottom: '30px',
                    transition: 'all 0.3s ease'
                  },
                  attributes: {
                    'data-action': 'whatsapp',
                    'data-number': '5511999999999',
                    'data-message': 'Olá! Tenho interesse no produto.'
                  },
                  events: {
                    onClick: NavigationHelpers.openWhatsApp('5511999999999', 'Olá! Tenho interesse no produto.')
                  },
                  canHaveChildren: false,
                  isContainer: false
                },
                // Bonus urgency
                {
                  id: premiumCTA1BonusId,
                  type: 'text',
                  tagName: 'div',
                  content: '🎁 BÔNUS EXCLUSIVO: Mentoria VIP de R$ 5.000 (GRÁTIS apenas hoje)',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '20px',
                    color: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    padding: '20px 40px',
                    borderRadius: '15px',
                    marginBottom: '30px',
                    border: '2px dashed #fbbf24',
                    fontWeight: 'bold'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                // Guarantee
                {
                  id: premiumCTA1GuaranteeId,
                  type: 'text',
                  tagName: 'div',
                  content: '🛡️ GARANTIA INCONDICIONAL DE 30 DIAS - 100% DO SEU DINHEIRO DE VOLTA',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '20px 30px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255,255,255,0.3)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                // Final urgency
                {
                  id: premiumCTA1UrgencyId,
                  type: 'text',
                  tagName: 'div',
                  content: '⚠️ APENAS 23 VAGAS RESTANTES - Após esgotar, volta ao preço normal de R$ 3.497',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#fed7d7',
                    fontStyle: 'italic' as const,
                    opacity: 0.9
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                position: 'relative' as const,
                zIndex: 2,
                maxWidth: '900px',
                margin: '0 auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      case 'ctaTemplate2':
        const premiumCTA2BadgeId = uuidv4();
        const premiumCTA2TitleId = uuidv4();
        const premiumCTA2LeftId = uuidv4();
        const premiumCTA2RightId = uuidv4();
        const premiumCTA2GuaranteeId = uuidv4();
        const premiumCTA2TestimonialId = uuidv4();
        const premiumCTA2ButtonId = uuidv4();
        const premiumCTA2BonusesId = uuidv4();
        const premiumCTA2UrgencyId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            position: 'relative' as const
          },
          children: [
            // Background gradient overlay
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [],
              styles: {
                position: 'absolute' as const,
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                zIndex: 1
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: premiumCTA2BadgeId,
                  type: 'text',
                  tagName: 'div',
                  content: '💎 ACESSO EXCLUSIVO VIP',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    display: 'inline-block',
                    border: '2px solid #3b82f6',
                    marginBottom: '40px',
                    textAlign: 'center' as const
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: premiumCTA2TitleId,
                  type: 'heading2',
                  tagName: 'h2',
                  content: 'Transforme Sua Vida Financeira em 90 Dias ou Menos',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '52px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center' as const,
                    margin: '0 0 60px 0',
                    lineHeight: '1.1',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                // Two column layout
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    // Left side - Guarantee and social proof
                    {
                      id: premiumCTA2LeftId,
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: premiumCTA2GuaranteeId,
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumCTA2LeftId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '🛡️',
                              parentId: premiumCTA2GuaranteeId,
                              children: [],
                              styles: {
                                fontSize: '48px',
                                textAlign: 'center' as const,
                                marginBottom: '20px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'heading3',
                              tagName: 'h3',
                              content: 'GARANTIA BLINDADA',
                              parentId: premiumCTA2GuaranteeId,
                              children: [],
                              styles: {
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#22c55e',
                                textAlign: 'center' as const,
                                marginBottom: '15px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'p',
                              content: 'Se em 30 dias você não estiver completamente satisfeito, devolvemos 100% do seu investimento. Sem perguntas, sem burocracias.',
                              parentId: premiumCTA2GuaranteeId,
                              children: [],
                              styles: {
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.8)',
                                textAlign: 'center' as const,
                                lineHeight: '1.6',
                                marginBottom: '30px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            padding: '40px 30px',
                            borderRadius: '20px',
                            border: '2px solid rgba(34, 197, 94, 0.3)',
                            marginBottom: '40px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        },
                        {
                          id: premiumCTA2TestimonialId,
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumCTA2LeftId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '⭐⭐⭐⭐⭐',
                              parentId: premiumCTA2TestimonialId,
                              children: [],
                              styles: {
                                fontSize: '24px',
                                textAlign: 'center' as const,
                                marginBottom: '15px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'p',
                              content: '"Faturei R$ 284.000 em apenas 2 meses seguindo exatamente o que aprendi. Mudou minha vida completamente!"',
                              parentId: premiumCTA2TestimonialId,
                              children: [],
                              styles: {
                                fontSize: '18px',
                                color: '#fbbf24',
                                textAlign: 'center' as const,
                                fontStyle: 'italic' as const,
                                lineHeight: '1.5',
                                marginBottom: '15px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '- Marina Silva, Empresária',
                              parentId: premiumCTA2TestimonialId,
                              children: [],
                              styles: {
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.7)',
                                textAlign: 'center' as const,
                                fontWeight: 'bold'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            padding: '30px 25px',
                            borderRadius: '15px',
                            border: '1px solid rgba(251, 191, 36, 0.3)'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        }
                      ],
                      styles: {
                        flex: '1',
                        paddingRight: '30px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    // Right side - Offer and CTA
                    {
                      id: premiumCTA2RightId,
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: premiumCTA2BonusesId,
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumCTA2RightId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'heading3',
                              tagName: 'h3',
                              content: 'VOCÊ RECEBE HOJE:',
                              parentId: premiumCTA2BonusesId,
                              children: [],
                              styles: {
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#ffffff',
                                marginBottom: '25px',
                                textAlign: 'center' as const
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '✅ Sistema Completo de Vendas (R$ 3.497)\n✅ 50 Templates Prontos (R$ 997)\n✅ Mentoria VIP 1-a-1 (R$ 5.000)\n✅ Suporte 24/7 por 1 ano (R$ 1.997)\n✅ Comunidade Exclusiva (R$ 497)\n✅ Atualizações Vitalícias (R$ 997)',
                              parentId: premiumCTA2BonusesId,
                              children: [],
                              styles: {
                                fontSize: '18px',
                                color: '#22c55e',
                                lineHeight: '1.8',
                                marginBottom: '30px',
                                fontWeight: '500'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: 'VALOR TOTAL: R$ 12.985',
                              parentId: premiumCTA2BonusesId,
                              children: [],
                              styles: {
                                fontSize: '20px',
                                color: 'rgba(255,255,255,0.6)',
                                textDecoration: 'line-through',
                                textAlign: 'center' as const,
                                marginBottom: '10px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: 'HOJE POR APENAS:',
                              parentId: premiumCTA2BonusesId,
                              children: [],
                              styles: {
                                fontSize: '18px',
                                color: '#fbbf24',
                                textAlign: 'center' as const,
                                marginBottom: '10px',
                                fontWeight: 'bold'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: 'R$ 497',
                              parentId: premiumCTA2BonusesId,
                              children: [],
                              styles: {
                                fontSize: '64px',
                                fontWeight: 'bold',
                                color: '#3b82f6',
                                textAlign: 'center' as const,
                                marginBottom: '10px',
                                textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: 'ou 12x de R$ 49,70',
                              parentId: premiumCTA2BonusesId,
                              children: [],
                              styles: {
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.8)',
                                textAlign: 'center' as const,
                                marginBottom: '40px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            padding: '40px 30px',
                            borderRadius: '20px',
                            border: '2px solid rgba(59, 130, 246, 0.3)',
                            marginBottom: '30px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        },
                        {
                          id: premiumCTA2ButtonId,
                          type: 'ctaPrimary',
                          tagName: 'button',
                          content: 'GARANTIR ACESSO VIP AGORA! 🚀',
                          parentId: premiumCTA2RightId,
                          children: [],
                          styles: {
                            padding: '25px 40px',
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            backgroundColor: '#3b82f6',
                            border: '3px solid #1d4ed8',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)',
                            width: '100%',
                            marginBottom: '20px',
                            textTransform: 'uppercase' as const,
                            letterSpacing: '1px'
                          },
                          attributes: {
                            'data-action': 'navigate',
                            'data-url': 'https://checkout.exemplo.com/acesso-vip',
                            'data-target': '_blank'
                          },
                          events: {
                            onClick: NavigationHelpers.openExternal('https://checkout.exemplo.com/acesso-vip', '_blank')
                          },
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: premiumCTA2UrgencyId,
                          type: 'text',
                          tagName: 'div',
                          content: '🔥 ÚLTIMAS 48 VAGAS DISPONÍVEIS',
                          parentId: premiumCTA2RightId,
                          children: [],
                          styles: {
                            fontSize: '16px',
                            color: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            padding: '15px 20px',
                            borderRadius: '10px',
                            textAlign: 'center' as const,
                            fontWeight: 'bold',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            animation: 'pulse 2s infinite'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        flex: '1',
                        paddingLeft: '30px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    }
                  ],
                  styles: {
                    display: 'flex',
                    gap: '60px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                position: 'relative' as const,
                zIndex: 2
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      // ===== TEMPLATES ADICIONAIS =====
      case 'heroTemplate4':
        const heroT4SectionId = uuidv4();
        const heroT4BadgeId = uuidv4();
        const heroT4LeftId = uuidv4();
        const heroT4RightId = uuidv4();
        const heroT4ImageId = uuidv4();
        const heroT4Card1Id = uuidv4();
        const heroT4Card2Id = uuidv4();
        const heroT4TitleId = uuidv4();
        const heroT4DescId = uuidv4();
        const heroT4BenefitsId = uuidv4();
        const heroT4ButtonId = uuidv4();
        const heroT4ReviewId = uuidv4();
        const heroT4Card1TitleId = uuidv4();
        const heroT4Card1TextId = uuidv4();
        const heroT4Card2TitleId = uuidv4();
        const heroT4Card2TextId = uuidv4();
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            minHeight: '600px',
            padding: '60px 40px',
            backgroundColor: '#ffffff',
            maxWidth: '1200px',
            margin: '0 auto'
          },
          children: [
            {
              id: heroT4LeftId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: heroT4BadgeId,
                  type: 'text',
                  tagName: 'div',
                  content: '🔥 MÉTODO EXCLUSIVO REVELADO',
                  parentId: heroT4LeftId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    display: 'inline-block',
                    margin: '0 0 25px 0',
                    border: '2px solid #dc2626',
                    animation: 'pulse 2s infinite'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: heroT4TitleId,
                  type: 'heading1',
                  tagName: 'h1',
                  content: 'Como Transformei R$ 500 em R$ 73.000 em Apenas 90 Dias',
                  parentId: heroT4LeftId,
                  children: [],
                  styles: { 
                    fontSize: '48px', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    margin: '0 0 20px 0',
                    lineHeight: '1.1'
                  },
                  attributes: {}, 
                  events: {}, 
                  canHaveChildren: false, 
                  isContainer: false
                },
                {
                  id: heroT4DescId,
                  type: 'text',
                  tagName: 'p',
                  content: 'E como você pode replicar esse sistema testado e aprovado para construir sua própria máquina de vendas automática no digital.',
                  parentId: heroT4LeftId,
                  children: [],
                  styles: { 
                    fontSize: '20px', 
                    color: '#4b5563', 
                    margin: '0 0 25px 0', 
                    lineHeight: '1.5',
                    fontWeight: '400'
                  },
                  attributes: {}, 
                  events: {}, 
                  canHaveChildren: false, 
                  isContainer: false
                },
                {
                  id: heroT4BenefitsId,
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Sistema Validado com +5.000 Alunos\n✅ Método Passo a Passo Simplificado\n✅ Funciona Mesmo se Você é Iniciante\n✅ Resultados em Até 30 Dias',
                  parentId: heroT4LeftId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#059669',
                    margin: '0 0 30px 0',
                    lineHeight: '1.8',
                    fontWeight: '500'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: heroT4ButtonId,
                  type: 'ctaPrimary',
                  tagName: 'button',
                  content: 'QUERO ACESSO AGORA! 🚀',
                  parentId: heroT4LeftId,
                  children: [],
                  styles: { 
                    padding: '20px 40px', 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#ffffff', 
                    backgroundColor: '#dc2626', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
                    animation: 'pulse 2s infinite',
                    marginBottom: '20px'
                  },
                  attributes: {}, 
                  events: {}, 
                  canHaveChildren: false, 
                  isContainer: false
                },
                {
                  id: heroT4ReviewId,
                  type: 'text',
                  tagName: 'p',
                  content: '⭐⭐⭐⭐⭐ Avaliação 4.9/5 | +2.847 depoimentos reais',
                  parentId: heroT4LeftId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0',
                    textAlign: 'center' as const
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: { 
                flex: '1', 
                padding: '60px 40px 60px 0',
                display: 'flex',
                flexDirection: 'column' as const,
                justifyContent: 'center'
              },
              attributes: {}, 
              events: {}, 
              canHaveChildren: true, 
              isContainer: true
            },
            {
              id: heroT4RightId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: heroT4ImageId,
                  type: 'image',
                  tagName: 'img',
                  content: '',
                  parentId: heroT4RightId,
                  children: [],
                  styles: {
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                    border: '1px solid #e5e7eb'
                  },
                  attributes: {
                    src: 'https://via.placeholder.com/500x600',
                    alt: 'Transformação de Resultados'
                  },
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: heroT4Card1Id,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: heroT4RightId,
                  children: [
                    {
                      id: heroT4Card1TitleId,
                      type: 'text',
                      tagName: 'div',
                      content: '💰 R$ 73.000',
                      parentId: heroT4Card1Id,
                      children: [],
                      styles: {
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#059669',
                        textAlign: 'center' as const,
                        marginBottom: '5px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: heroT4Card1TextId,
                      type: 'text',
                      tagName: 'p',
                      content: 'Faturamento em 90 dias',
                      parentId: heroT4Card1Id,
                      children: [],
                      styles: {
                        fontSize: '14px',
                        color: '#6b7280',
                        textAlign: 'center' as const,
                        margin: '0'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    position: 'absolute' as const,
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#ffffff',
                    padding: '15px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    zIndex: 10
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                {
                  id: heroT4Card2Id,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: heroT4RightId,
                  children: [
                    {
                      id: heroT4Card2TitleId,
                      type: 'text',
                      tagName: 'div',
                      content: '🎯 5.247',
                      parentId: heroT4Card2Id,
                      children: [],
                      styles: {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1d4ed8',
                        textAlign: 'center' as const,
                        marginBottom: '5px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: heroT4Card2TextId,
                      type: 'text',
                      tagName: 'p',
                      content: 'Alunos Transformados',
                      parentId: heroT4Card2Id,
                      children: [],
                      styles: {
                        fontSize: '12px',
                        color: '#6b7280',
                        textAlign: 'center' as const,
                        margin: '0'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    position: 'absolute' as const,
                    bottom: '20px',
                    left: '20px',
                    backgroundColor: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    zIndex: 10
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: { 
                flex: '1',
                position: 'relative' as const,
                padding: '40px',
                minHeight: '500px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              },
              attributes: {},
              events: {}, 
              canHaveChildren: true, 
              isContainer: true
            }
          ]
        };

      case 'heroTemplate5':
        return {
          ...baseElement,
          children: [
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'div',
              content: '🔥 OFERTA LIMITADA',
              parentId: baseElement.id,
              children: [],
              styles: { fontSize: '16px', fontWeight: 'bold', color: '#ffd700', textAlign: 'center' as const, margin: '0 0 20px 0' },
              attributes: {}, events: {}, canHaveChildren: false, isContainer: false
            },
            {
              id: uuidv4(),
              type: 'heading1',
              tagName: 'h1',
              content: 'Aumente Suas Vendas em 300%',
              parentId: baseElement.id,
              children: [],
              styles: { fontSize: '52px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center' as const, margin: '0 0 20px 0' },
              attributes: {}, events: {}, canHaveChildren: false, isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Sistema completo de vendas online que já gerou mais de R$ 50 milhões em faturamento.',
              parentId: baseElement.id,
              children: [],
              styles: { fontSize: '20px', color: '#fed7d7', textAlign: 'center' as const, margin: '0 0 30px 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' },
              attributes: {}, events: {}, canHaveChildren: false, isContainer: false
            },
            {
              id: uuidv4(),
              type: 'ctaPrimary',
              tagName: 'button',
              content: 'QUERO AUMENTAR MINHAS VENDAS',
              parentId: baseElement.id,
              children: [],
              styles: { padding: '20px 40px', fontSize: '20px', fontWeight: 'bold', color: '#000000', backgroundColor: '#ffd700', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(255, 215, 0, 0.3)' },
              attributes: {}, events: {}, canHaveChildren: false, isContainer: false
            }
          ]
        };

      case 'pricingTemplate2':
        const pricingT2BadgeId = uuidv4();
        const pricingT2TitleId = uuidv4();
        const pricingT2SubtitleId = uuidv4();
        const pricingT2SingleId = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: pricingT2BadgeId,
              type: 'text',
              tagName: 'div',
              content: '💎 PLANO ÚNICO ESPECIAL',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#7c3aed',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: '#f3e8ff',
                padding: '12px 24px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #7c3aed'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT2TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Oferta Especial por Tempo Limitado',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 15px 0',
                lineHeight: '1.2'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT2SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Aproveite enquanto ainda está disponível',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '18px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 50px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT2SingleId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '🔥 SUPER PROMOÇÃO',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#dc2626',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    margin: '0 auto 20px auto',
                    display: 'inline-block'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'ACESSO COMPLETO',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'De R$ 997 por apenas',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    textDecoration: 'line-through',
                    margin: '0 0 10px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'R$ 297',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    textAlign: 'center' as const,
                    margin: '0 0 10px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'ou 12x de R$ 29,70 sem juros',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '0 0 30px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Método Completo de Vendas\n✅ Mais de 100 Vídeo Aulas\n✅ 50+ Templates Prontos\n✅ Suporte VIP por 6 Meses\n✅ Grupo Exclusivo no Telegram\n✅ Bônus: Curso de Tráfego Pago\n✅ Garantia Incondicional de 30 Dias\n✅ Acesso Vitalício',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#374151',
                    textAlign: 'left' as const,
                    margin: '0 0 30px 0',
                    lineHeight: '2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'ctaPrimary',
                  tagName: 'button',
                  content: 'QUERO GARANTIR AGORA! 🚀',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    width: '100%',
                    padding: '20px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#dc2626',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
                    animation: 'pulse 2s infinite'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: '🔒 Compra 100% Segura | 📞 Suporte Imediato',
                  parentId: pricingT2SingleId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '15px 0 0 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '50px 40px',
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(220, 38, 38, 0.15)',
                textAlign: 'center' as const,
                border: '3px solid #dc2626',
                maxWidth: '500px',
                margin: '0 auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      case 'pricingTemplate3':
        const pricingT3BadgeId = uuidv4();
        const pricingT3TitleId = uuidv4();
        const pricingT3SubtitleId = uuidv4();
        const pricingT3PremiumId = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: pricingT3BadgeId,
              type: 'text',
              tagName: 'div',
              content: '👑 PLANO PREMIUM EXCLUSIVO',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#d97706',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: '#fef3c7',
                padding: '12px 24px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #d97706'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT3TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Para Quem Quer Resultados Extraordinários',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 15px 0',
                lineHeight: '1.2'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT3SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Acesso VIP com mentoria pessoal e resultados garantidos',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '18px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 50px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: pricingT3PremiumId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '🥇 EXCLUSIVO',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#d97706',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    margin: '0 auto 20px auto',
                    display: 'inline-block'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'MENTORIA VIP 1:1',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'R$ 1.997',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#d97706',
                    textAlign: 'center' as const,
                    margin: '0 0 10px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'ou 12x de R$ 199,70 sem juros',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '0 0 30px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ Tudo do Plano Completo +\n✅ 12 Mentorias 1:1 Comigo\n✅ Revisão Completa do Seu Negócio\n✅ Estratégia Personalizada\n✅ WhatsApp Direto para Dúvidas\n✅ Análise de Campanhas\n✅ Suporte Prioritário 24h\n✅ Masterclass Exclusivas\n✅ Garantia Estendida de 60 Dias',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#374151',
                    textAlign: 'left' as const,
                    margin: '0 0 30px 0',
                    lineHeight: '2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '🎯 VAGAS LIMITADAS: Apenas 10 por mês',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    textAlign: 'center' as const,
                    backgroundColor: '#fee2e2',
                    padding: '10px',
                    borderRadius: '8px',
                    margin: '0 0 20px 0',
                    border: '1px solid #dc2626'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'ctaPrimary',
                  tagName: 'button',
                  content: 'QUERO MENTORIA VIP! 👑',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    width: '100%',
                    padding: '20px',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: '#d97706',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(217, 119, 6, 0.3)',
                    animation: 'pulse 2s infinite'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: '👨‍💼 Mentoria Pessoal | 📈 Resultados Garantidos',
                  parentId: pricingT3PremiumId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '15px 0 0 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: '#ffffff',
                padding: '50px 40px',
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(217, 119, 6, 0.15)',
                textAlign: 'center' as const,
                border: '3px solid #d97706',
                maxWidth: '500px',
                margin: '0 auto',
                position: 'relative' as const
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      case 'featuresTemplate2':
        const benefitsT2BadgeId = uuidv4();
        const benefitsT2TitleId = uuidv4();
        const benefitsT2SubtitleId = uuidv4();
        const benefitsT2Item1Id = uuidv4();
        const benefitsT2Item2Id = uuidv4();
        const benefitsT2Item3Id = uuidv4();
        const benefitsT2Item4Id = uuidv4();
        const benefitsT2Item5Id = uuidv4();
        const benefitsT2Item6Id = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: benefitsT2BadgeId,
              type: 'text',
              tagName: 'div',
              content: '✨ BENEFÍCIOS EXCLUSIVOS',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#059669',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: '#d1fae5',
                padding: '12px 24px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #059669'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: benefitsT2TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Tudo o Que Você Vai Receber',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 15px 0',
                lineHeight: '1.2'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: benefitsT2SubtitleId,
              type: 'text',
              tagName: 'p',
              content: 'Um sistema completo para sua transformação digital',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '18px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 50px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: benefitsT2Item1Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅',
                  parentId: benefitsT2Item1Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    marginRight: '15px',
                    flexShrink: 0
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'Método Completo de Vendas Online (Valor: R$ 497)',
                  parentId: benefitsT2Item1Id,
                  children: [],
                  styles: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Estratégias testadas e aprovadas para gerar vendas recorrentes no digital',
                  parentId: benefitsT2Item1Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0',
                    lineHeight: '1.5'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                display: 'flex',
                alignItems: 'flex-start',
                padding: '25px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: benefitsT2Item2Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅',
                  parentId: benefitsT2Item2Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    marginRight: '15px',
                    flexShrink: 0
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '100+ Vídeo Aulas Passo a Passo (Valor: R$ 297)',
                  parentId: benefitsT2Item2Id,
                  children: [],
                  styles: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Conteúdo prático e direto ao ponto, sem enrolação ou teoria desnecessária',
                  parentId: benefitsT2Item2Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0',
                    lineHeight: '1.5'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                display: 'flex',
                alignItems: 'flex-start',
                padding: '25px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: benefitsT2Item3Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅',
                  parentId: benefitsT2Item3Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    marginRight: '15px',
                    flexShrink: 0
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'Templates e Scripts Prontos (Valor: R$ 197)',
                  parentId: benefitsT2Item3Id,
                  children: [],
                  styles: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Copy pronta para usar em seus anúncios, emails e páginas de venda',
                  parentId: benefitsT2Item3Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0',
                    lineHeight: '1.5'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                display: 'flex',
                alignItems: 'flex-start',
                padding: '25px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: benefitsT2Item4Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅',
                  parentId: benefitsT2Item4Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    marginRight: '15px',
                    flexShrink: 0
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'Suporte VIP por 6 Meses (Valor: R$ 397)',
                  parentId: benefitsT2Item4Id,
                  children: [],
                  styles: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Tire suas dúvidas direto comigo e com a equipe especializada',
                  parentId: benefitsT2Item4Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0',
                    lineHeight: '1.5'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                display: 'flex',
                alignItems: 'flex-start',
                padding: '25px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: benefitsT2Item5Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅',
                  parentId: benefitsT2Item5Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    marginRight: '15px',
                    flexShrink: 0
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'Bônus: Curso de Tráfego Pago (Valor: R$ 697)',
                  parentId: benefitsT2Item5Id,
                  children: [],
                  styles: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    margin: '0 0 8px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Aprenda a escalar suas vendas com Facebook e Google Ads',
                  parentId: benefitsT2Item5Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0',
                    lineHeight: '1.5'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                display: 'flex',
                alignItems: 'flex-start',
                padding: '25px',
                backgroundColor: '#fef2f2',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '2px solid #dc2626'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: benefitsT2Item6Id,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '🎯',
                  parentId: benefitsT2Item6Id,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    marginRight: '15px',
                    flexShrink: 0
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'Valor Total: R$ 2.085 → Seu Investimento: R$ 297',
                  parentId: benefitsT2Item6Id,
                  children: [],
                  styles: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#059669',
                    margin: '0 0 8px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Economia de mais de 85% + Garantia incondicional de 30 dias',
                  parentId: benefitsT2Item6Id,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0',
                    lineHeight: '1.5'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                display: 'flex',
                alignItems: 'flex-start',
                padding: '25px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                marginBottom: '0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '2px solid #059669'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      case 'featuresTemplate3':
        const premiumFT3BadgeId = uuidv4();
        const premiumFT3TitleId = uuidv4();
        const premiumFT3SubtitleId = uuidv4();
        const premiumFT3LeftId = uuidv4();
        const premiumFT3RightId = uuidv4();
        const premiumFT3ImageId = uuidv4();
        const premiumFT3Feature1Id = uuidv4();
        const premiumFT3Feature2Id = uuidv4();
        const premiumFT3Feature3Id = uuidv4();
        const premiumFT3Feature4Id = uuidv4();
        const premiumFT3CtaId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#667eea',
            color: '#ffffff',
            position: 'relative' as const,
            overflow: 'hidden'
          },
          children: [
            // Background decoration
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [],
              styles: {
                position: 'absolute' as const,
                top: '0',
                right: '0',
                width: '600px',
                height: '600px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(30%, -30%)',
                zIndex: 1
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Content wrapper
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: premiumFT3BadgeId,
                  type: 'text',
                  tagName: 'div',
                  content: '💎 TECNOLOGIA PREMIUM',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    textAlign: 'center' as const,
                    margin: '0 0 25px 0',
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    padding: '12px 30px',
                    borderRadius: '30px',
                    display: 'inline-block',
                    border: '2px solid #fbbf24',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(251, 191, 36, 0.3)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: premiumFT3TitleId,
                  type: 'heading2',
                  tagName: 'h2',
                  content: 'Ferramentas Que Transformam Visionários em Milionários',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '54px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0',
                    lineHeight: '1.1',
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: premiumFT3SubtitleId,
                  type: 'text',
                  tagName: 'p',
                  content: 'Sistema completo usado pelos top 1% do mercado digital. Cada recurso foi desenvolvido para maximizar seus resultados.',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '22px',
                    color: 'rgba(255,255,255,0.9)',
                    textAlign: 'center' as const,
                    margin: '0 0 70px 0',
                    lineHeight: '1.5',
                    maxWidth: '700px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                // Main content layout
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    // Left side - Image with overlay
                    {
                      id: premiumFT3LeftId,
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: premiumFT3ImageId,
                          type: 'image',
                          tagName: 'img',
                          content: '',
                          parentId: premiumFT3LeftId,
                          children: [],
                          styles: {
                            width: '100%',
                            maxWidth: '580px',
                            height: 'auto',
                            borderRadius: '24px',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                            border: '3px solid rgba(255,255,255,0.2)',
                            transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)'
                          },
                          attributes: {
                            src: 'https://via.placeholder.com/580x450/1f2937/ffffff?text=DASHBOARD+PREMIUM',
                            alt: 'Dashboard Premium de Vendas'
                          },
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        // Floating stats
                        {
                          id: uuidv4(),
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumFT3LeftId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '💰 R$ 847K',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#059669',
                                textAlign: 'center' as const,
                                marginBottom: '5px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'p',
                              content: 'Faturamento Mensal',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '12px',
                                color: '#6b7280',
                                textAlign: 'center' as const,
                                margin: '0'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            position: 'absolute' as const,
                            top: '20px',
                            right: '20px',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            padding: '15px 20px',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            zIndex: 10
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        },
                        {
                          id: uuidv4(),
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumFT3LeftId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '⚡ 99.9%',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#1d4ed8',
                                textAlign: 'center' as const,
                                marginBottom: '5px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'p',
                              content: 'Uptime Garantido',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '11px',
                                color: '#6b7280',
                                textAlign: 'center' as const,
                                margin: '0'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            position: 'absolute' as const,
                            bottom: '30px',
                            left: '20px',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            padding: '12px 18px',
                            borderRadius: '12px',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            zIndex: 10
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        }
                      ],
                      styles: {
                        flex: '1',
                        position: 'relative' as const,
                        textAlign: 'center' as const,
                        paddingRight: '40px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    // Right side - Features list
                    {
                      id: premiumFT3RightId,
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: premiumFT3Feature1Id,
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumFT3RightId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'container',
                              tagName: 'div',
                              content: '',
                              parentId: premiumFT3Feature1Id,
                              children: [
                                {
                                  id: uuidv4(),
                                  type: 'text',
                                  tagName: 'div',
                                  content: '🧠',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '28px'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                }
                              ],
                              styles: {
                                width: '60px',
                                height: '60px',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: true,
                              isContainer: true
                            },
                            {
                              id: uuidv4(),
                              type: 'container',
                              tagName: 'div',
                              content: '',
                              parentId: premiumFT3Feature1Id,
                              children: [
                                {
                                  id: uuidv4(),
                                  type: 'heading3',
                                  tagName: 'h3',
                                  content: 'IA Predictiva de Vendas',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                    margin: '0 0 12px 0'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                },
                                {
                                  id: uuidv4(),
                                  type: 'text',
                                  tagName: 'p',
                                  content: 'Algoritmo que prevê o comportamento do cliente e ajusta automaticamente suas campanhas para maximizar conversões. +340% de ROI médio.',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '16px',
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: '1.6',
                                    margin: '0'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                }
                              ],
                              styles: {
                                flex: '1'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: true,
                              isContainer: true
                            }
                          ],
                          styles: {
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '40px',
                            padding: '25px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        },
                        {
                          id: premiumFT3Feature2Id,
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumFT3RightId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'container',
                              tagName: 'div',
                              content: '',
                              parentId: premiumFT3Feature2Id,
                              children: [
                                {
                                  id: uuidv4(),
                                  type: 'text',
                                  tagName: 'div',
                                  content: '💎',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '28px'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                }
                              ],
                              styles: {
                                width: '60px',
                                height: '60px',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: true,
                              isContainer: true
                            },
                            {
                              id: uuidv4(),
                              type: 'container',
                              tagName: 'div',
                              content: '',
                              parentId: premiumFT3Feature2Id,
                              children: [
                                {
                                  id: uuidv4(),
                                  type: 'heading3',
                                  tagName: 'h3',
                                  content: 'Pipeline Automatizado Premium',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                    margin: '0 0 12px 0'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                },
                                {
                                  id: uuidv4(),
                                  type: 'text',
                                  tagName: 'p',
                                  content: 'Do lead frio ao cliente fidelizado em piloto automático. Sequências inteligentes que vendem enquanto você dorme. Conversão média de 47%.',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '16px',
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: '1.6',
                                    margin: '0'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                }
                              ],
                              styles: {
                                flex: '1'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: true,
                              isContainer: true
                            }
                          ],
                          styles: {
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '40px',
                            padding: '25px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        },
                        {
                          id: premiumFT3Feature3Id,
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: premiumFT3RightId,
                          children: [
                            {
                              id: uuidv4(),
                              type: 'container',
                              tagName: 'div',
                              content: '',
                              parentId: premiumFT3Feature3Id,
                              children: [
                                {
                                  id: uuidv4(),
                                  type: 'text',
                                  tagName: 'div',
                                  content: '🚀',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '28px'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                }
                              ],
                              styles: {
                                width: '60px',
                                height: '60px',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: true,
                              isContainer: true
                            },
                            {
                              id: uuidv4(),
                              type: 'container',
                              tagName: 'div',
                              content: '',
                              parentId: premiumFT3Feature3Id,
                              children: [
                                {
                                  id: uuidv4(),
                                  type: 'heading3',
                                  tagName: 'h3',
                                  content: 'Escalonamento Exponencial',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#ffffff',
                                    margin: '0 0 12px 0'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                },
                                {
                                  id: uuidv4(),
                                  type: 'text',
                                  tagName: 'p',
                                  content: 'Sistema que identifica automaticamente oportunidades de escala e otimiza budgets. De 5 a 6 figuras em 90 dias ou menos.',
                                  parentId: uuidv4(),
                                  children: [],
                                  styles: {
                                    fontSize: '16px',
                                    color: 'rgba(255,255,255,0.8)',
                                    lineHeight: '1.6',
                                    margin: '0'
                                  },
                                  attributes: {},
                                  events: {},
                                  canHaveChildren: false,
                                  isContainer: false
                                }
                              ],
                              styles: {
                                flex: '1'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: true,
                              isContainer: true
                            }
                          ],
                          styles: {
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '50px',
                            padding: '25px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        },
                        // CTA Button
                        {
                          id: premiumFT3CtaId,
                          type: 'ctaPrimary',
                          tagName: 'button',
                          content: 'ACESSAR TECNOLOGIA PREMIUM 💎',
                          parentId: premiumFT3RightId,
                          children: [],
                          styles: {
                            padding: '25px 45px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            backgroundColor: '#fbbf24',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            boxShadow: '0 15px 40px rgba(251, 191, 36, 0.4)',
                            transform: 'translateY(0)',
                            transition: 'all 0.3s ease',
                            width: '100%',
                            textAlign: 'center' as const
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        flex: '1',
                        paddingLeft: '40px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    }
                  ],
                  styles: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '60px',
                    maxWidth: '1400px',
                    margin: '0 auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                position: 'relative' as const,
                zIndex: 2
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      // ===== TESTIMONIALS SUPER PREMIUM =====
      case 'testimonialsTemplate1':
        const testimonialT1BadgeId = uuidv4();
        const testimonialT1TitleId = uuidv4();
        const testimonialT1Grid1Id = uuidv4();
        const testimonialT1Grid2Id = uuidv4();
        const testimonialT1Grid3Id = uuidv4();
        const testimonialT1StatsId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#f8fafc',
            position: 'static',
            display: 'block',
            width: '100%'
          },
          children: [
            {
              id: testimonialT1BadgeId,
              type: 'text',
              tagName: 'div',
              content: '🏆 RESULTADOS COMPROVADOS',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#059669',
                backgroundColor: '#dcfce7',
                padding: '12px 30px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #059669',
                marginBottom: '30px',
                textAlign: 'center' as const
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: testimonialT1TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Mais de 15.000 Vidas Transformadas',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                lineHeight: '1.2'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Veja os resultados reais de quem aplicou nosso método e mudou de vida para sempre',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '20px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 70px 0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Grid of testimonials
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                // Testimonial 1 - Video style
                {
                  id: testimonialT1Grid1Id,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: testimonialT1Grid1Id,
                      children: [
                        {
                          id: uuidv4(),
                          type: 'image',
                          tagName: 'img',
                          content: '',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            marginRight: '20px',
                            border: '4px solid #059669'
                          },
                          attributes: {
                            src: 'https://via.placeholder.com/80x80/059669/ffffff?text=JS',
                            alt: 'João Silva'
                          },
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: uuidv4(),
                          children: [
                            {
                              id: uuidv4(),
                              type: 'heading3',
                              tagName: 'h3',
                              content: 'João Silva',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: '0 0 5px 0'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: 'Empresário Digital',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '14px',
                                color: '#6b7280',
                                marginBottom: '10px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '⭐⭐⭐⭐⭐',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '16px',
                                marginBottom: '15px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            flex: '1'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        }
                      ],
                      styles: {
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'p',
                      content: '"Em 45 dias faturei R$ 127.000! Nunca pensei que seria possível ganhar tanto dinheiro online. O método é simplesmente incrível!"',
                      parentId: testimonialT1Grid1Id,
                      children: [],
                      styles: {
                        fontSize: '16px',
                        color: '#374151',
                        lineHeight: '1.6',
                        fontStyle: 'italic' as const,
                        marginBottom: '20px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '💰 Resultado: R$ 127.000 em 45 dias',
                      parentId: testimonialT1Grid1Id,
                      children: [],
                      styles: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#059669',
                        backgroundColor: '#dcfce7',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    backgroundColor: '#ffffff',
                    padding: '40px 30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    height: '100%'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                // Testimonial 2
                {
                  id: testimonialT1Grid2Id,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: testimonialT1Grid2Id,
                      children: [
                        {
                          id: uuidv4(),
                          type: 'image',
                          tagName: 'img',
                          content: '',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            marginRight: '20px',
                            border: '4px solid #3b82f6'
                          },
                          attributes: {
                            src: 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=MS',
                            alt: 'Maria Santos'
                          },
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: uuidv4(),
                          children: [
                            {
                              id: uuidv4(),
                              type: 'heading3',
                              tagName: 'h3',
                              content: 'Maria Santos',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: '0 0 5px 0'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: 'Consultora',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '14px',
                                color: '#6b7280',
                                marginBottom: '10px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '⭐⭐⭐⭐⭐',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '16px',
                                marginBottom: '15px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            flex: '1'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        }
                      ],
                      styles: {
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'p',
                      content: '"Saí do zero absoluto para R$ 85K/mês em apenas 3 meses. Mudou minha vida financeira completamente. Recomendo de olhos fechados!"',
                      parentId: testimonialT1Grid2Id,
                      children: [],
                      styles: {
                        fontSize: '16px',
                        color: '#374151',
                        lineHeight: '1.6',
                        fontStyle: 'italic' as const,
                        marginBottom: '20px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '🚀 Resultado: R$ 85.000/mês recorrente',
                      parentId: testimonialT1Grid2Id,
                      children: [],
                      styles: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        backgroundColor: '#dbeafe',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    backgroundColor: '#ffffff',
                    padding: '40px 30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    height: '100%'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                // Testimonial 3
                {
                  id: testimonialT1Grid3Id,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: testimonialT1Grid3Id,
                      children: [
                        {
                          id: uuidv4(),
                          type: 'image',
                          tagName: 'img',
                          content: '',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            marginRight: '20px',
                            border: '4px solid #f59e0b'
                          },
                          attributes: {
                            src: 'https://via.placeholder.com/80x80/f59e0b/ffffff?text=RP',
                            alt: 'Roberto Pereira'
                          },
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'container',
                          tagName: 'div',
                          content: '',
                          parentId: uuidv4(),
                          children: [
                            {
                              id: uuidv4(),
                              type: 'heading3',
                              tagName: 'h3',
                              content: 'Roberto Pereira',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: '0 0 5px 0'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: 'Coach de Vendas',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '14px',
                                color: '#6b7280',
                                marginBottom: '10px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            },
                            {
                              id: uuidv4(),
                              type: 'text',
                              tagName: 'div',
                              content: '⭐⭐⭐⭐⭐',
                              parentId: uuidv4(),
                              children: [],
                              styles: {
                                fontSize: '16px',
                                marginBottom: '15px'
                              },
                              attributes: {},
                              events: {},
                              canHaveChildren: false,
                              isContainer: false
                            }
                          ],
                          styles: {
                            flex: '1'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: true,
                          isContainer: true
                        }
                      ],
                      styles: {
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'p',
                      content: '"Escalonei de R$ 20K para R$ 300K em 6 meses! O sistema funciona de verdade. Hoje tenho liberdade financeira total."',
                      parentId: testimonialT1Grid3Id,
                      children: [],
                      styles: {
                        fontSize: '16px',
                        color: '#374151',
                        lineHeight: '1.6',
                        fontStyle: 'italic' as const,
                        marginBottom: '20px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '📈 Resultado: De R$ 20K para R$ 300K',
                      parentId: testimonialT1Grid3Id,
                      children: [],
                      styles: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                        backgroundColor: '#fef3c7',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    backgroundColor: '#ffffff',
                    padding: '40px 30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    height: '100%'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '40px',
                marginBottom: '80px',
                maxWidth: '1200px',
                margin: '0 auto 80px auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            // Stats section
            {
              id: testimonialT1StatsId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: testimonialT1StatsId,
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '15.247',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#059669',
                        textAlign: 'center' as const,
                        marginBottom: '10px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'Vidas Transformadas',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '18px',
                        color: '#6b7280',
                        textAlign: 'center' as const,
                        fontWeight: 'bold'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    textAlign: 'center' as const
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: testimonialT1StatsId,
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'R$ 847M',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                        textAlign: 'center' as const,
                        marginBottom: '10px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'Faturamento Gerado',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '18px',
                        color: '#6b7280',
                        textAlign: 'center' as const,
                        fontWeight: 'bold'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    textAlign: 'center' as const
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: testimonialT1StatsId,
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '4.9/5',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                        textAlign: 'center' as const,
                        marginBottom: '10px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: 'Avaliação Média',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '18px',
                        color: '#6b7280',
                        textAlign: 'center' as const,
                        fontWeight: 'bold'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    textAlign: 'center' as const
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '60px',
                backgroundColor: '#ffffff',
                padding: '60px 40px',
                borderRadius: '20px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                maxWidth: '800px',
                margin: '0 auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      case 'testimonialsTemplate2':
        // Template 2 será um depoimento em video formato
        const testimonialT2BadgeId = uuidv4();
        const testimonialT2TitleId = uuidv4();
        const testimonialT2VideoId = uuidv4();
        const testimonialT2QuoteId = uuidv4();
        const testimonialT2CtaId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#1f2937',
            color: '#ffffff',
            textAlign: 'center' as const,
            position: 'static',
            display: 'block',
            width: '100%'
          },
          children: [
            {
              id: testimonialT2BadgeId,
              type: 'text',
              tagName: 'div',
              content: '🎬 DEPOIMENTO EXCLUSIVO',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                padding: '12px 30px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #fbbf24',
                marginBottom: '40px'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: testimonialT2TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'De Funcionário CLT para R$ 500K/Mês',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '52px',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: '0 0 20px 0',
                lineHeight: '1.1'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Assista como Carlos transformou sua vida em apenas 8 meses',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '24px',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 60px 0'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Video testimonial mockup
            {
              id: testimonialT2VideoId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: testimonialT2VideoId,
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '▶️',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '80px',
                        color: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    position: 'absolute' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                {
                  id: uuidv4(),
                  type: 'image',
                  tagName: 'img',
                  content: '',
                  parentId: testimonialT2VideoId,
                  children: [],
                  styles: {
                    width: '100%',
                    maxWidth: '600px',
                    height: '400px',
                    borderRadius: '20px',
                    filter: 'brightness(0.7)'
                  },
                  attributes: {
                    src: 'https://via.placeholder.com/600x400/1f2937/ffffff?text=DEPOIMENTO+VIDEO',
                    alt: 'Video Depoimento Carlos'
                  },
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                position: 'relative' as const,
                display: 'inline-block',
                marginBottom: '50px'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            // Quote destacada
            {
              id: testimonialT2QuoteId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: '"Hoje faturo mais em 1 mês do que faturava em 1 ano inteiro como CLT. Minha família agora tem a vida que sempre sonhou."',
                  parentId: testimonialT2QuoteId,
                  children: [],
                  styles: {
                    fontSize: '28px',
                    color: '#fbbf24',
                    fontStyle: 'italic' as const,
                    lineHeight: '1.4',
                    marginBottom: '25px'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '- Carlos Eduardo, Ex-Funcionário CLT',
                  parentId: testimonialT2QuoteId,
                  children: [],
                  styles: {
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 'bold'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                maxWidth: '800px',
                margin: '0 auto 50px auto',
                padding: '40px',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                borderRadius: '20px',
                border: '2px solid rgba(251, 191, 36, 0.3)'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            // CTA final
            {
              id: testimonialT2CtaId,
              type: 'ctaPrimary',
              tagName: 'button',
              content: 'QUERO OS MESMOS RESULTADOS! 🚀',
              parentId: baseElement.id,
              children: [],
              styles: {
                padding: '25px 50px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                backgroundColor: '#fbbf24',
                border: '3px solid #ffffff',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0 15px 40px rgba(251, 191, 36, 0.4)',
                textTransform: 'uppercase' as const,
                letterSpacing: '1px'
              },
              attributes: {
                'data-action': 'navigate',
                'data-url': 'https://exemplo.com/comprar',
                'data-target': '_blank'
              },
              events: {
                onClick: 'window.open(this.dataset.url, this.dataset.target || "_self")'
              },
              canHaveChildren: false,
              isContainer: false
            },
            // Botão secundário para navegação interna
            {
              id: uuidv4(),
              type: 'ctaSecondary',
              tagName: 'button',
              content: 'Ver Mais Depoimentos ⬇',
              parentId: baseElement.id,
              children: [],
              styles: {
                padding: '20px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#fbbf24',
                backgroundColor: 'transparent',
                border: '2px solid #fbbf24',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop: '20px',
                textTransform: 'uppercase' as const,
                letterSpacing: '1px',
                transition: 'all 0.3s ease'
              },
              attributes: {
                'data-action': 'scroll',
                'data-section': 'depoimentos'
              },
              events: {
                onClick: 'document.getElementById(this.dataset.section)?.scrollIntoView({behavior: "smooth"})'
              },
              canHaveChildren: false,
              isContainer: false
            },
            // Botão WhatsApp adicional
            {
              id: uuidv4(),
              type: 'ctaSecondary',
              tagName: 'button',
              content: '💬 Falar no WhatsApp',
              parentId: baseElement.id,
              children: [],
              styles: {
                padding: '15px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#25D366',
                backgroundColor: 'transparent',
                border: '2px solid #25D366',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop: '15px',
                transition: 'all 0.3s ease'
              },
              attributes: {
                'data-action': 'whatsapp',
                'data-number': '5511999999999',
                'data-message': 'Olá! Vi os depoimentos e tenho interesse no produto.'
              },
              events: {
                onClick: NavigationHelpers.openWhatsApp('5511999999999', 'Olá! Vi os depoimentos e tenho interesse no produto.')
              },
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };

      // ===== CONTACT SUPER PREMIUM =====
      case 'contactTemplate1':
        const contactT1BadgeId = uuidv4();
        const contactT1TitleId = uuidv4();
        const contactT1FormId = uuidv4();
        const contactT1TrustId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            position: 'static',
            display: 'block',
            width: '100%'
          },
          children: [
            {
              id: contactT1BadgeId,
              type: 'text',
              tagName: 'div',
              content: '🎯 ACESSO EXCLUSIVO',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                padding: '12px 30px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #10b981',
                marginBottom: '30px',
                textAlign: 'center' as const
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: contactT1TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Garante Sua Vaga AGORA!',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                lineHeight: '1.1'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Apenas 47 vagas restantes para o programa que já transformou mais de 15.000 vidas',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '22px',
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center' as const,
                margin: '0 0 60px 0',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Two column layout
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                // Left Column - Form
                {
                  id: contactT1FormId,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'h3',
                      content: 'Preencha Seus Dados e Receba GRÁTIS:',
                      parentId: contactT1FormId,
                      children: [],
                      styles: {
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#10b981',
                        marginBottom: '30px',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    // Benefits list
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: contactT1FormId,
                      children: [
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '✅ Ebook "Os 7 Segredos dos Milhonários"',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#ffffff',
                            marginBottom: '15px',
                            padding: '15px 20px',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '✅ Masterclass Exclusiva (valor R$ 497)',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#ffffff',
                            marginBottom: '15px',
                            padding: '15px 20px',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '✅ Convite para Grupo VIP no WhatsApp',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#ffffff',
                            marginBottom: '30px',
                            padding: '15px 20px',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        marginBottom: '40px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    // Form fields
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'input',
                      content: '',
                      parentId: contactT1FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '18px',
                        borderRadius: '12px',
                        border: '2px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        marginBottom: '20px'
                      },
                      attributes: {
                        type: 'text',
                        placeholder: '👤 Seu nome completo'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'input',
                      content: '',
                      parentId: contactT1FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '18px',
                        borderRadius: '12px',
                        border: '2px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        marginBottom: '20px'
                      },
                      attributes: {
                        type: 'email',
                        placeholder: '✉️ Seu melhor email'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'input',
                      content: '',
                      parentId: contactT1FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '18px',
                        borderRadius: '12px',
                        border: '2px solid #374151',
                        backgroundColor: '#1f2937',
                        color: '#ffffff',
                        marginBottom: '30px'
                      },
                      attributes: {
                        type: 'tel',
                        placeholder: '📱 WhatsApp com DDD'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    // CTA Button
                    {
                      id: uuidv4(),
                      type: 'ctaPrimary',
                      tagName: 'button',
                      content: 'QUERO ACESSO GRÁTIS AGORA! 🚀',
                      parentId: contactT1FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '25px 40px',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: '#0f172a',
                        backgroundColor: '#10b981',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 15px 40px rgba(16, 185, 129, 0.4)',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '1px',
                        marginBottom: '20px'
                      },
                      attributes: {
                        'data-action': 'navigate',
                        'data-url': 'https://landing.exemplo.com/acesso-gratuito',
                        'data-target': '_blank'
                      },
                      events: {
                        onClick: NavigationHelpers.openExternal('https://landing.exemplo.com/acesso-gratuito', '_blank')
                      },
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'p',
                      content: '🔒 Seus dados estão 100% seguros e protegidos',
                      parentId: contactT1FormId,
                      children: [],
                      styles: {
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.6)',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    backgroundColor: '#1e293b',
                    padding: '50px 40px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    border: '1px solid #374151'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                // Right Column - Trust signals
                {
                  id: contactT1TrustId,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'h3',
                      content: 'Junte-se a Mais de 15.000 Pessoas',
                      parentId: contactT1TrustId,
                      children: [],
                      styles: {
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        marginBottom: '30px',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    // Trust elements
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: contactT1TrustId,
                      children: [
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '⭐⭐⭐⭐⭐',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '32px',
                            textAlign: 'center' as const,
                            marginBottom: '15px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'p',
                          content: 'Avaliação 4.9/5 baseada em mais de 8.000 depoimentos',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: 'rgba(255,255,255,0.8)',
                            textAlign: 'center' as const,
                            marginBottom: '40px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        padding: '30px',
                        borderRadius: '15px',
                        marginBottom: '30px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    // Quick testimonial
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'p',
                      content: '"Recebi os materiais e em 24h já estava aplicando. Resultado: R$ 15K na primeira semana!"',
                      parentId: contactT1TrustId,
                      children: [],
                      styles: {
                        fontSize: '20px',
                        color: '#10b981',
                        fontStyle: 'italic' as const,
                        textAlign: 'center' as const,
                        marginBottom: '15px',
                        lineHeight: '1.5'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '- Marina Costa, São Paulo',
                      parentId: contactT1TrustId,
                      children: [],
                      styles: {
                        fontSize: '16px',
                        color: 'rgba(255,255,255,0.7)',
                        textAlign: 'center' as const,
                        marginBottom: '40px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    // Urgency
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: contactT1TrustId,
                      children: [
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '⚡ ATENÇÃO',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#f59e0b',
                            textAlign: 'center' as const,
                            marginBottom: '15px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'p',
                          content: 'Apenas 47 vagas restantes. Após esgotarem, o acesso gratuito será encerrado definitivamente.',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#ffffff',
                            textAlign: 'center' as const,
                            lineHeight: '1.5'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        backgroundColor: '#dc2626',
                        padding: '25px',
                        borderRadius: '15px',
                        border: '2px solid #f59e0b'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    }
                  ],
                  styles: {
                    display: 'flex',
                    flexDirection: 'column' as const,
                    justifyContent: 'center'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                maxWidth: '1200px',
                margin: '0 auto',
                alignItems: 'flex-start'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      case 'contactTemplate2':
        const contactT2BadgeId = uuidv4();
        const contactT2TitleId = uuidv4();
        const contactT2FormId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#ffffff',
            position: 'static',
            display: 'block',
            width: '100%'
          },
          children: [
            // Background gradient overlay
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [],
              styles: {
                position: 'absolute' as const,
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                zIndex: 1
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Content wrapper
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: contactT2BadgeId,
                  type: 'text',
                  tagName: 'div',
                  content: '💬 FALE CONOSCO',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#3b82f6',
                    backgroundColor: '#dbeafe',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    display: 'inline-block',
                    border: '2px solid #3b82f6',
                    marginBottom: '30px',
                    textAlign: 'center' as const
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: contactT2TitleId,
                  type: 'heading2',
                  tagName: 'h2',
                  content: 'Vamos Transformar Seus Sonhos em Realidade?',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    margin: '0 0 20px 0',
                    lineHeight: '1.2'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Entre em contato conosco e descubra como podemos ajudar você a alcançar resultados extraordinários',
                  parentId: uuidv4(),
                  children: [],
                  styles: {
                    fontSize: '20px',
                    color: '#6b7280',
                    textAlign: 'center' as const,
                    margin: '0 0 60px 0',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                // Center form
                {
                  id: contactT2FormId,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: contactT2FormId,
                      children: [
                        {
                          id: uuidv4(),
                          type: 'input',
                          tagName: 'input',
                          content: '',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            width: '48%',
                            padding: '20px 25px',
                            fontSize: '16px',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            color: '#1f2937',
                            marginRight: '4%'
                          },
                          attributes: {
                            type: 'text',
                            placeholder: 'Nome completo'
                          },
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'input',
                          tagName: 'input',
                          content: '',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            width: '48%',
                            padding: '20px 25px',
                            fontSize: '16px',
                            borderRadius: '12px',
                            border: '2px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            color: '#1f2937'
                          },
                          attributes: {
                            type: 'email',
                            placeholder: 'Seu melhor email'
                          },
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        display: 'flex',
                        marginBottom: '25px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'input',
                      content: '',
                      parentId: contactT2FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        color: '#1f2937',
                        marginBottom: '25px'
                      },
                      attributes: {
                        type: 'tel',
                        placeholder: 'WhatsApp com DDD'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'textarea',
                      content: '',
                      parentId: contactT2FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        color: '#1f2937',
                        marginBottom: '30px',
                        minHeight: '120px',
                        resize: 'vertical' as const
                      },
                      attributes: {
                        placeholder: 'Como podemos ajudar você? Conte-nos mais sobre seus objetivos...'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    // CTA Button
                    {
                      id: uuidv4(),
                      type: 'ctaPrimary',
                      tagName: 'button',
                      content: 'ENVIAR MENSAGEM 📨',
                      parentId: contactT2FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '25px 40px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '1px',
                        marginBottom: '20px'
                      },
                      attributes: {
                        'data-action': 'email',
                        'data-url': 'contato@exemplo.com',
                        'data-section': 'Interesse em seus serviços',
                        'data-message': 'Olá! Tenho interesse em conhecer mais sobre seus serviços.'
                      },
                      events: {
                        onClick: NavigationHelpers.openEmail('contato@exemplo.com', 'Interesse em seus serviços', 'Olá! Tenho interesse em conhecer mais sobre seus serviços.')
                      },
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'p',
                      content: '🔐 Responderemos em até 24 horas',
                      parentId: contactT2FormId,
                      children: [],
                      styles: {
                        fontSize: '14px',
                        color: '#6b7280',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    backgroundColor: '#ffffff',
                    padding: '60px 50px',
                    borderRadius: '20px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    maxWidth: '700px',
                    margin: '0 auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                position: 'relative' as const,
                zIndex: 2
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      // ===== NEWSLETTER SUPER PREMIUM =====
      case 'newsletterTemplate1':
        const newsletterT1BadgeId = uuidv4();
        const newsletterT1TitleId = uuidv4();
        const newsletterT1FormId = uuidv4();
        const newsletterT1BonusId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#1e40af',
            color: '#ffffff',
            textAlign: 'center' as const,
            position: 'static',
            display: 'block',
            width: '100%'
          },
          children: [
            {
              id: newsletterT1BadgeId,
              type: 'text',
              tagName: 'div',
              content: '📧 ACESSO EXCLUSIVO',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                padding: '12px 30px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #fbbf24',
                marginBottom: '30px'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: newsletterT1TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Receba os Segredos que Transformaram 15.000 Vidas',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '52px',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: '0 0 20px 0',
                lineHeight: '1.1',
                maxWidth: '900px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Cadastre-se AGORA e ganhe acesso instantâneo aos materiais exclusivos que já geraram mais de R$ 847 milhões',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '24px',
                color: 'rgba(255,255,255,0.9)',
                margin: '0 0 50px 0',
                maxWidth: '700px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.4'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Bonus section
            {
              id: newsletterT1BonusId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'h3',
                  content: '🎁 BÔNUS EXCLUSIVOS PARA ASSINANTES:',
                  parentId: newsletterT1BonusId,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    marginBottom: '30px'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: newsletterT1BonusId,
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '💎 Ebook "Os 7 Pilares da Riqueza" (R$ 197)',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '18px',
                        color: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '15px',
                        border: '2px solid rgba(251, 191, 36, 0.3)'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '🚀 Checklist "Primeiro Milhão" (R$ 97)',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '18px',
                        color: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '15px',
                        border: '2px solid rgba(251, 191, 36, 0.3)'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'div',
                      content: '🎯 Planilha "Metas Milionárias" (R$ 147)',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '18px',
                        color: '#ffffff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '30px',
                        border: '2px solid rgba(251, 191, 36, 0.3)'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    maxWidth: '600px',
                    margin: '0 auto'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: 'VALOR TOTAL: R$ 441 - GRÁTIS PARA VOCÊ!',
                  parentId: newsletterT1BonusId,
                  children: [],
                  styles: {
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                    padding: '20px 40px',
                    borderRadius: '15px',
                    marginBottom: '40px',
                    border: '3px solid #fbbf24',
                    display: 'inline-block'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                marginBottom: '50px'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            // Form section
            {
              id: newsletterT1FormId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: newsletterT1FormId,
                  children: [
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'input',
                      content: '',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        width: '300px',
                        padding: '20px 25px',
                        fontSize: '18px',
                        borderRadius: '12px 0 0 12px',
                        border: '3px solid #fbbf24',
                        backgroundColor: '#ffffff',
                        color: '#1f2937',
                        marginRight: '0'
                      },
                      attributes: {
                        type: 'email',
                        placeholder: 'Digite seu melhor email'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'ctaPrimary',
                      tagName: 'button',
                      content: 'QUERO OS BÔNUS! 🎁',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        padding: '20px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1e40af',
                        backgroundColor: '#fbbf24',
                        border: '3px solid #fbbf24',
                        borderRadius: '0 12px 12px 0',
                        cursor: 'pointer',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '1px'
                      },
                      attributes: {
                        'data-action': 'navigate',
                        'data-url': 'https://newsletter.exemplo.com/bonus-gratuitos',
                        'data-target': '_blank'
                      },
                      events: {
                        onClick: NavigationHelpers.openExternal('https://newsletter.exemplo.com/bonus-gratuitos', '_blank')
                      },
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: '✅ 100% Gratuito • ✅ Sem Spam • ✅ Cancele Quando Quiser',
                  parentId: newsletterT1FormId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '30px'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                backgroundColor: 'rgba(30, 64, 175, 0.3)',
                padding: '50px 40px',
                borderRadius: '20px',
                border: '2px solid rgba(251, 191, 36, 0.5)',
                maxWidth: '700px',
                margin: '0 auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            // Urgency
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: '⏰ ATENÇÃO: Esta oferta expira em 48 horas!',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ef4444',
                marginTop: '40px',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                padding: '15px 30px',
                borderRadius: '10px',
                border: '2px solid #ef4444',
                display: 'inline-block'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            }
          ]
        };

      case 'newsletterTemplate2':
        const newsletterT2BadgeId = uuidv4();
        const newsletterT2TitleId = uuidv4();
        const newsletterT2FormId = uuidv4();
        const newsletterT2StatsId = uuidv4();
        
        return {
          ...baseElement,
          styles: {
            ...baseElement.styles,
            padding: '100px 60px',
            backgroundColor: '#ffffff',
            color: '#1f2937',
            position: 'static',
            display: 'block',
            width: '100%'
          },
          children: [
            {
              id: newsletterT2BadgeId,
              type: 'text',
              tagName: 'div',
              content: '💌 NEWSLETTER VIP',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                padding: '12px 30px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #7c3aed',
                marginBottom: '30px',
                textAlign: 'center' as const
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: newsletterT2TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Seja o Primeiro a Saber dos Lançamentos Exclusivos',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                lineHeight: '1.2',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Junte-se à comunidade VIP e receba conteúdos exclusivos, descontos especiais e acesso antecipado aos nossos produtos',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '20px',
                color: '#6b7280',
                textAlign: 'center' as const,
                margin: '0 0 60px 0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            // Two column layout
            {
              id: uuidv4(),
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                // Left - Benefits
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'h3',
                      content: 'Vantagens Exclusivas:',
                      parentId: uuidv4(),
                      children: [],
                      styles: {
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#7c3aed',
                        marginBottom: '30px'
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '🎯 Conteúdos exclusivos semanais',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#1f2937',
                            marginBottom: '20px',
                            padding: '15px 20px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '10px',
                            borderLeft: '4px solid #7c3aed'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '💰 Descontos de até 70% em produtos',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#1f2937',
                            marginBottom: '20px',
                            padding: '15px 20px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '10px',
                            borderLeft: '4px solid #7c3aed'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '⚡ Acesso antecipado a lançamentos',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#1f2937',
                            marginBottom: '20px',
                            padding: '15px 20px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '10px',
                            borderLeft: '4px solid #7c3aed'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '🎁 Bônus exclusivos mensais',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '18px',
                            color: '#1f2937',
                            marginBottom: '20px',
                            padding: '15px 20px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '10px',
                            borderLeft: '4px solid #7c3aed'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {},
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    }
                  ],
                  styles: {
                    display: 'flex',
                    flexDirection: 'column' as const,
                    justifyContent: 'center'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                },
                // Right - Form
                {
                  id: newsletterT2FormId,
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: uuidv4(),
                  children: [
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'h3',
                      content: 'Cadastre-se Gratuitamente:',
                      parentId: newsletterT2FormId,
                      children: [],
                      styles: {
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '30px',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'input',
                      content: '',
                      parentId: newsletterT2FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        color: '#1f2937',
                        marginBottom: '20px'
                      },
                      attributes: {
                        type: 'text',
                        placeholder: 'Seu nome'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'input',
                      tagName: 'input',
                      content: '',
                      parentId: newsletterT2FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 25px',
                        fontSize: '16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        color: '#1f2937',
                        marginBottom: '30px'
                      },
                      attributes: {
                        type: 'email',
                        placeholder: 'Seu melhor email'
                      },
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'ctaPrimary',
                      tagName: 'button',
                      content: 'QUERO FAZER PARTE! 🚀',
                      parentId: newsletterT2FormId,
                      children: [],
                      styles: {
                        width: '100%',
                        padding: '20px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        backgroundColor: '#7c3aed',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.4)',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '1px',
                        marginBottom: '20px'
                      },
                      attributes: {
                        'data-action': 'navigate',
                        'data-url': 'https://comunidade.exemplo.com/cadastro-vip',
                        'data-target': '_blank'
                      },
                      events: {
                        onClick: NavigationHelpers.openExternal('https://comunidade.exemplo.com/cadastro-vip', '_blank')
                      },
                      canHaveChildren: false,
                      isContainer: false
                    },
                    {
                      id: uuidv4(),
                      type: 'text',
                      tagName: 'p',
                      content: '🔒 Seus dados estão seguros. Odiamos spam tanto quanto você!',
                      parentId: newsletterT2FormId,
                      children: [],
                      styles: {
                        fontSize: '14px',
                        color: '#6b7280',
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: false,
                      isContainer: false
                    }
                  ],
                  styles: {
                    backgroundColor: '#f9fafb',
                    padding: '40px 30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '2px solid #e5e7eb'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '60px',
                maxWidth: '1200px',
                margin: '0 auto 60px auto',
                alignItems: 'center'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            // Stats section
            {
              id: newsletterT2StatsId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'h3',
                  content: 'Junte-se a Milhares de Pessoas:',
                  parentId: newsletterT2StatsId,
                  children: [],
                  styles: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    textAlign: 'center' as const,
                    marginBottom: '40px'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'container',
                  tagName: 'div',
                  content: '',
                  parentId: newsletterT2StatsId,
                  children: [
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '25.347',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#7c3aed',
                            textAlign: 'center' as const,
                            marginBottom: '10px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: 'Assinantes Ativos',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '16px',
                            color: '#6b7280',
                            textAlign: 'center' as const
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '4.8/5',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#7c3aed',
                            textAlign: 'center' as const,
                            marginBottom: '10px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: 'Avaliação Média',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '16px',
                            color: '#6b7280',
                            textAlign: 'center' as const
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    },
                    {
                      id: uuidv4(),
                      type: 'container',
                      tagName: 'div',
                      content: '',
                      parentId: uuidv4(),
                      children: [
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: '97%',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '36px',
                            fontWeight: 'bold',
                            color: '#7c3aed',
                            textAlign: 'center' as const,
                            marginBottom: '10px'
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        },
                        {
                          id: uuidv4(),
                          type: 'text',
                          tagName: 'div',
                          content: 'Taxa de Satisfação',
                          parentId: uuidv4(),
                          children: [],
                          styles: {
                            fontSize: '16px',
                            color: '#6b7280',
                            textAlign: 'center' as const
                          },
                          attributes: {},
                          events: {},
                          canHaveChildren: false,
                          isContainer: false
                        }
                      ],
                      styles: {
                        textAlign: 'center' as const
                      },
                      attributes: {},
                      events: {},
                      canHaveChildren: true,
                      isContainer: true
                    }
                  ],
                  styles: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '40px',
                    backgroundColor: '#f9fafb',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '2px solid #e5e7eb'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: true,
                  isContainer: true
                }
              ],
              styles: {
                maxWidth: '800px',
                margin: '0 auto'
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      // ===== TEMPLATES SIMPLES PARA OS DEMAIS =====
      case 'testimonialsTemplate1':
      case 'testimonialsTemplate2':
      case 'faqTemplate1':
      case 'faqTemplate2':
      case 'aboutTemplate2':
      case 'teamTemplate1':
      case 'teamTemplate2':
      case 'statsTemplate1':
      case 'statsTemplate2':
      case 'ctaTemplate2':
      case 'productTemplate1':
      case 'productTemplate2':
      case 'footerTemplate1':
      case 'footerTemplate2':
      case 'headerTemplate1':
      case 'headerTemplate2':
        const aboutT1BadgeId = uuidv4();
        const aboutT1TitleId = uuidv4();
        const aboutT1LeftId = uuidv4();
        const aboutT1RightId = uuidv4();
        
        return {
          ...baseElement,
          children: [
            {
              id: aboutT1BadgeId,
              type: 'text',
              tagName: 'div',
              content: '👨‍💼 SOBRE O MENTOR',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#7c3aed',
                textAlign: 'center' as const,
                margin: '0 0 20px 0',
                backgroundColor: '#f3e8ff',
                padding: '12px 24px',
                borderRadius: '25px',
                display: 'inline-block',
                border: '2px solid #7c3aed'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: aboutT1TitleId,
              type: 'heading2',
              tagName: 'h2',
              content: 'Conheça Quem Está Por Trás dos Resultados',
              parentId: baseElement.id,
              children: [],
              styles: {
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center' as const,
                margin: '0 0 60px 0',
                lineHeight: '1.2'
              },
              attributes: {},
              events: {},
              canHaveChildren: false,
              isContainer: false
            },
            {
              id: aboutT1LeftId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'image',
                  tagName: 'img',
                  content: '',
                  parentId: aboutT1LeftId,
                  children: [],
                  styles: {
                    width: '100%',
                    maxWidth: '400px',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                    border: '4px solid #ffffff'
                  },
                  attributes: {
                    src: 'https://via.placeholder.com/400x500',
                    alt: 'Rodrigo Silva - Mentor'
                  },
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {
                textAlign: 'center' as const
              },
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            },
            {
              id: aboutT1RightId,
              type: 'container',
              tagName: 'div',
              content: '',
              parentId: baseElement.id,
              children: [
                {
                  id: uuidv4(),
                  type: 'heading3',
                  tagName: 'h3',
                  content: 'Rodrigo Silva',
                  parentId: aboutT1RightId,
                  children: [],
                  styles: {
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 10px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Empreendedor Digital • R$ 50 Milhões em Vendas',
                  parentId: aboutT1RightId,
                  children: [],
                  styles: {
                    fontSize: '18px',
                    color: '#7c3aed',
                    fontWeight: 'bold',
                    margin: '0 0 30px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: 'Há mais de 8 anos no mercado digital, já ajudei mais de 15.000 pessoas a transformarem suas vidas através do empreendedorismo online. Minha missão é democratizar o conhecimento e mostrar que qualquer pessoa pode construir um negócio lucrativo na internet.',
                  parentId: aboutT1RightId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#4b5563',
                    lineHeight: '1.7',
                    margin: '0 0 30px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'div',
                  content: '✅ +15.000 alunos transformados\n✅ R$ 50 milhões em vendas geradas\n✅ 8 anos de experiência comprovada\n✅ Palestrante em +50 eventos\n✅ Mentor de empreendedores de sucesso\n✅ Autor de 3 livros best-sellers',
                  parentId: aboutT1RightId,
                  children: [],
                  styles: {
                    fontSize: '14px',
                    color: '#059669',
                    lineHeight: '2',
                    margin: '0 0 30px 0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  tagName: 'p',
                  content: '"Meu maior prazer é ver meus alunos alcançarem a liberdade financeira e realizarem seus sonhos. Cada história de sucesso me motiva a continuar compartilhando conhecimento."',
                  parentId: aboutT1RightId,
                  children: [],
                  styles: {
                    fontSize: '16px',
                    color: '#374151',
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                    padding: '20px',
                    backgroundColor: '#f9fafb',
                    borderLeft: '4px solid #7c3aed',
                    borderRadius: '8px',
                    margin: '0'
                  },
                  attributes: {},
                  events: {},
                  canHaveChildren: false,
                  isContainer: false
                }
              ],
              styles: {},
              attributes: {},
              events: {},
              canHaveChildren: true,
              isContainer: true
            }
          ]
        };

      case 'testimonialsTemplate2':
      case 'contactTemplate1':
      case 'contactTemplate2':
      case 'newsletterTemplate1':
      case 'newsletterTemplate2':
      case 'faqTemplate1':
      case 'faqTemplate2':
      case 'aboutTemplate2':
      case 'teamTemplate1':
      case 'teamTemplate2':
      case 'statsTemplate1':
      case 'statsTemplate2':
      case 'ctaTemplate2':
      case 'productTemplate1':
      case 'productTemplate2':
      case 'footerTemplate1':
      case 'footerTemplate2':
      case 'headerTemplate1':
      case 'headerTemplate2':
        return {
          ...baseElement,
          children: [
            {
              id: uuidv4(),
              type: 'heading2',
              tagName: 'h2',
              content: `Template: ${type.replace('Template', ' ').replace(/([A-Z])/g, ' $1').trim()}`,
              parentId: baseElement.id,
              children: [],
              styles: { 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#2d3748', 
                textAlign: 'center' as const, 
                margin: '0 0 30px 0' 
              },
              attributes: {}, events: {}, canHaveChildren: false, isContainer: false
            },
            {
              id: uuidv4(),
              type: 'text',
              tagName: 'p',
              content: 'Este é um template pronto para uso. Clique para editar o conteúdo e personalizar conforme sua necessidade.',
              parentId: baseElement.id,
              children: [],
              styles: { 
                fontSize: '18px', 
                color: '#4a5568', 
                textAlign: 'center' as const, 
                margin: '0 0 40px 0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6'
              },
              attributes: {}, events: {}, canHaveChildren: false, isContainer: false
            },
            {
              id: uuidv4(),
              type: 'ctaPrimary',
              tagName: 'button',
              content: 'Botão de Ação',
              parentId: baseElement.id,
              children: [],
              styles: { 
                padding: '16px 32px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#ffffff', 
                backgroundColor: '#3b82f6', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer' 
              },
              attributes: {}, events: {}, canHaveChildren: false, isContainer: false
            }
          ]
        };

        
      default:
        return baseElement;
    }
  }, []);

  // Função para criar um novo elemento
  const createElement = useCallback((type: string, parentId?: string): PageElement => {
    const definition = ELEMENT_DEFINITIONS[type as keyof typeof ELEMENT_DEFINITIONS];
    if (!definition) {
      throw new Error(`Element type ${type} not found`);
    }

    const baseElement = {
      id: uuidv4(),
      type: definition.type,
      tagName: definition.tagName,
      content: definition.defaultContent || '',
      children: [],
      styles: { ...definition.defaultStyles },
      attributes: { ...definition.defaultAttributes },
      events: {},
      canHaveChildren: definition.canHaveChildren,
      isContainer: definition.isContainer,
      parentId,
      locked: false,
      hidden: false
    };

    // Special handling for contact forms
    if (type === 'contactFormComplete') {
      baseElement.children = [
        // Decorative element
        {
          id: uuidv4(),
          type: 'div',
          tagName: 'div',
          content: '',
          children: [],
          styles: {
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            pointerEvents: 'none'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Premium title with icon
        {
          id: uuidv4(),
          type: 'heading',
          tagName: 'h2',
          content: '💎 Entre em Contato Premium',
          children: [],
          styles: { 
            marginBottom: '30px',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Subtitle
        {
          id: uuidv4(),
          type: 'paragraph',
          tagName: 'p',
          content: 'Preencha os dados abaixo e nossa equipe entrará em contato',
          children: [],
          styles: { 
            marginBottom: '35px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            lineHeight: '1.5'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Name input with floating label effect
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '18px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '12px',
            outline: 'none',
            marginBottom: '20px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          },
          attributes: {
            type: 'text',
            placeholder: '✨ Seu nome completo',
            name: 'name',
            required: true
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Email input premium
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '18px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '12px',
            outline: 'none',
            marginBottom: '20px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          },
          attributes: {
            type: 'email',
            placeholder: '📧 seu@email.com',
            name: 'email',
            required: true
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Phone input premium with Brazilian mask
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '18px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '12px',
            outline: 'none',
            marginBottom: '25px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          },
          attributes: {
            type: 'tel',
            placeholder: '📱 (11) 99999-9999',
            name: 'phone',
            pattern: '\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}',
            title: 'Digite um telefone válido no formato (11) 99999-9999',
            oninput: 'this.value = this.value.replace(/\\D/g, \"\").replace(/(\\d{2})(\\d)/, \"($1) $2\").replace(/(\\d{5})(\\d)/, \"$1-$2\").substring(0, 15)'
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Premium submit button with gradient
        {
          id: uuidv4(),
          type: 'button',
          tagName: 'button',
          content: '🚀 Enviar Mensagem Premium',
          children: [],
          styles: { 
            width: '100%',
            padding: '18px 25px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(255,107,107,0.3)',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            letterSpacing: '0.5px'
          },
          attributes: {
            type: 'submit',
            onmouseover: 'this.style.transform = \"translateY(-2px)\"; this.style.boxShadow = \"0 12px 25px rgba(255,107,107,0.4)\"',
            onmouseout: 'this.style.transform = \"translateY(0)\"; this.style.boxShadow = \"0 8px 20px rgba(255,107,107,0.3)\"'
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        }
      ];
    } else if (type === 'contactFormSimple') {
      baseElement.children = [
        // Decorative floating element
        {
          id: uuidv4(),
          type: 'div',
          tagName: 'div',
          content: '',
          children: [],
          styles: {
            position: 'absolute',
            top: '-30px',
            left: '-30px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            pointerEvents: 'none'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Premium simple title
        {
          id: uuidv4(),
          type: 'heading',
          tagName: 'h2',
          content: '✨ Fale Conosco',
          children: [],
          styles: { 
            marginBottom: '25px',
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Elegant subtitle
        {
          id: uuidv4(),
          type: 'paragraph',
          tagName: 'p',
          content: 'Seu contato é importante para nós',
          children: [],
          styles: { 
            marginBottom: '30px',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            lineHeight: '1.5'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Premium name input
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '16px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '12px',
            outline: 'none',
            marginBottom: '20px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          },
          attributes: {
            type: 'text',
            placeholder: '👤 Seu nome',
            name: 'name',
            required: true
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Premium email input
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '16px 20px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '12px',
            outline: 'none',
            marginBottom: '25px',
            backgroundColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          },
          attributes: {
            type: 'email',
            placeholder: '💌 seu@email.com',
            name: 'email',
            required: true
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Elegant submit button
        {
          id: uuidv4(),
          type: 'button',
          tagName: 'button',
          content: '💫 Enviar Agora',
          children: [],
          styles: { 
            width: '100%',
            padding: '16px 25px',
            fontSize: '17px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(102,126,234,0.3)',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            letterSpacing: '0.5px'
          },
          attributes: {
            type: 'submit',
            onmouseover: 'this.style.transform = \"translateY(-2px)\"; this.style.boxShadow = \"0 12px 25px rgba(102,126,234,0.4)\"',
            onmouseout: 'this.style.transform = \"translateY(0)\"; this.style.boxShadow = \"0 8px 20px rgba(102,126,234,0.3)\"'
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        }
      ];
    } else if (type === 'contactFormVIP') {
      baseElement.children = [
        // Ultra decorative elements
        {
          id: uuidv4(),
          type: 'div',
          tagName: 'div',
          content: '',
          children: [],
          styles: {
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            pointerEvents: 'none'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        {
          id: uuidv4(),
          type: 'div',
          tagName: 'div',
          content: '',
          children: [],
          styles: {
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '120px',
            height: '120px',
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
            pointerEvents: 'none'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // VIP Title with crown
        {
          id: uuidv4(),
          type: 'heading',
          tagName: 'h2',
          content: '👑 Contato VIP Premium',
          children: [],
          styles: { 
            marginBottom: '15px',
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 3px 6px rgba(0,0,0,0.4)',
            letterSpacing: '1px'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // VIP Subtitle
        {
          id: uuidv4(),
          type: 'paragraph',
          tagName: 'p',
          content: 'Experiência exclusiva para clientes especiais',
          children: [],
          styles: { 
            marginBottom: '35px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.95)',
            textAlign: 'center',
            lineHeight: '1.6',
            fontStyle: 'italic'
          },
          attributes: {},
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // VIP Name input with luxury styling
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '20px 25px',
            fontSize: '17px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '15px',
            outline: 'none',
            marginBottom: '25px',
            backgroundColor: 'rgba(255,255,255,0.98)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transition: 'all 0.4s ease'
          },
          attributes: {
            type: 'text',
            placeholder: '👑 Seu nome completo (VIP)',
            name: 'name',
            required: true
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // VIP Email input
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '20px 25px',
            fontSize: '17px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '15px',
            outline: 'none',
            marginBottom: '25px',
            backgroundColor: 'rgba(255,255,255,0.98)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transition: 'all 0.4s ease'
          },
          attributes: {
            type: 'email',
            placeholder: '💎 seu.email@vip.com',
            name: 'email',
            required: true
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // VIP Phone input with luxury mask
        {
          id: uuidv4(),
          type: 'input',
          tagName: 'input',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '20px 25px',
            fontSize: '17px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '15px',
            outline: 'none',
            marginBottom: '25px',
            backgroundColor: 'rgba(255,255,255,0.98)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transition: 'all 0.4s ease'
          },
          attributes: {
            type: 'tel',
            placeholder: '📞 (11) 99999-9999 VIP',
            name: 'phone',
            pattern: '\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}',
            title: 'Digite um telefone válido no formato (11) 99999-9999',
            oninput: 'this.value = this.value.replace(/\\D/g, \"\").replace(/(\\d{2})(\\d)/, \"($1) $2\").replace(/(\\d{5})(\\d)/, \"$1-$2\").substring(0, 15)'
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // VIP Message textarea
        {
          id: uuidv4(),
          type: 'formTextarea',
          tagName: 'textarea',
          content: '',
          children: [],
          styles: { 
            width: '100%',
            padding: '20px 25px',
            fontSize: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '15px',
            outline: 'none',
            marginBottom: '30px',
            backgroundColor: 'rgba(255,255,255,0.98)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transition: 'all 0.4s ease',
            minHeight: '120px',
            resize: 'vertical',
            fontFamily: 'inherit'
          },
          attributes: {
            placeholder: '✍️ Deixe sua mensagem VIP aqui...',
            name: 'message',
            rows: '4'
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        },
        // Ultra Premium VIP submit button
        {
          id: uuidv4(),
          type: 'button',
          tagName: 'button',
          content: '🚀 Enviar Contato VIP',
          children: [],
          styles: { 
            width: '100%',
            padding: '20px 30px',
            fontSize: '19px',
            fontWeight: 'bold',
            color: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #42a5f5 100%)',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '15px',
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            boxShadow: '0 12px 30px rgba(255,107,107,0.4)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          },
          attributes: {
            type: 'submit',
            onmouseover: 'this.style.transform = \"translateY(-3px) scale(1.02)\"; this.style.boxShadow = \"0 18px 35px rgba(255,107,107,0.5)\"',
            onmouseout: 'this.style.transform = \"translateY(0) scale(1)\"; this.style.boxShadow = \"0 12px 30px rgba(255,107,107,0.4)\"'
          },
          events: {},
          canHaveChildren: false,
          isContainer: false,
          parentId: baseElement.id
        }
      ];
    }

    return baseElement;
  }, []);

  // Função para adicionar elemento ao histórico
  const addToHistory = useCallback((elements: PageElement[]) => {
    setEditorState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push([...elements]);
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  // Função para adicionar elemento
  const addElement = useCallback((type: string, parentId?: string, index?: number) => {
    // Usar função especializada para componentes de marketing e templates
    const marketingTypes = ['featureCard', 'testimonialCard', 'pricingCard'];
    const templateTypes = [
      'heroTemplate1', 'heroTemplate2', 'heroTemplate3', 'heroTemplate4', 'heroTemplate5',
      'pricingTemplate1', 'pricingTemplate2', 'pricingTemplate3',
      'featuresTemplate1', 'featuresTemplate2', 'featuresTemplate3',
      'testimonialsTemplate1', 'testimonialsTemplate2',
      'contactTemplate1', 'contactTemplate2',
      'newsletterTemplate1', 'newsletterTemplate2',
      'faqTemplate1', 'faqTemplate2',
      'aboutTemplate1', 'aboutTemplate2',
      'teamTemplate1', 'teamTemplate2',
      'statsTemplate1', 'statsTemplate2',
      'ctaTemplate1', 'ctaTemplate2',
      'productTemplate1', 'productTemplate2',
      'footerTemplate1', 'footerTemplate2',
      'headerTemplate1', 'headerTemplate2'
    ];
    
    const formTypes = ['contactFormComplete', 'contactFormSimple', 'contactFormVIP'];
    
    const newElement = (marketingTypes.includes(type) || templateTypes.includes(type) || formTypes.includes(type))
      ? (formTypes.includes(type) ? createElement(type, parentId) : createMarketingElement(type, parentId))
      : createElement(type, parentId);
    
    setEditorState(prev => {
      let newElements = [...prev.elements];
      
      if (parentId) {
        // Adicionar como filho de um elemento específico
        const addToParent = (elements: PageElement[]): PageElement[] => {
          return elements.map(el => {
            if (el.id === parentId) {
              const newChildren = [...el.children];
              if (index !== undefined) {
                newChildren.splice(index, 0, newElement);
              } else {
                newChildren.push(newElement);
              }
              return { ...el, children: newChildren };
            } else if (el.children.length > 0) {
              return { ...el, children: addToParent(el.children) };
            }
            return el;
          });
        };
        newElements = addToParent(newElements);
      } else {
        // Adicionar no nível raiz
        if (index !== undefined) {
          newElements.splice(index, 0, newElement);
        } else {
          newElements.push(newElement);
        }
      }
      
      addToHistory(newElements);
      
      return {
        ...prev,
        elements: newElements,
        selectedElementId: newElement.id
      };
    });
  }, [createElement, addToHistory]);

  // Função para mover elementos (drag and drop)
  const moveElement = useCallback((draggedId: string, overId: string, insertIndex?: number) => {
    setEditorState(prev => {
      let newElements = [...prev.elements];
      let draggedElement: PageElement | null = null;
      
      // Função recursiva para encontrar e remover o elemento arrastado
      const removeElement = (elements: PageElement[]): PageElement[] => {
        return elements.reduce((acc: PageElement[], el) => {
          if (el.id === draggedId) {
            draggedElement = el;
            return acc;
          } else if (el.children.length > 0) {
            return [...acc, { ...el, children: removeElement(el.children) }];
          }
          return [...acc, el];
        }, []);
      };
      
      // Função recursiva para adicionar o elemento no novo local
      const addElement = (elements: PageElement[], targetId: string): PageElement[] => {
        return elements.map(el => {
          if (el.id === targetId && el.canHaveChildren && draggedElement) {
            const newChildren = [...el.children];
            if (insertIndex !== undefined) {
              newChildren.splice(insertIndex, 0, { ...draggedElement, parentId: targetId });
            } else {
              newChildren.push({ ...draggedElement, parentId: targetId });
            }
            return { ...el, children: newChildren };
          } else if (el.children.length > 0) {
            return { ...el, children: addElement(el.children, targetId) };
          }
          return el;
        });
      };
      
      // Remove o elemento da posição atual
      newElements = removeElement(newElements);
      
      if (draggedElement) {
        if (overId === 'canvas') {
          // Adicionar no nível raiz do canvas
          draggedElement.parentId = undefined;
          if (insertIndex !== undefined) {
            newElements.splice(insertIndex, 0, draggedElement);
          } else {
            newElements.push(draggedElement);
          }
        } else {
          // Adicionar como filho do elemento de destino
          newElements = addElement(newElements, overId);
        }
      }
      
      addToHistory(newElements);
      
      return {
        ...prev,
        elements: newElements
      };
    });
  }, [addToHistory]);

  // Handlers para drag and drop
  const handleDragStart = (event: DragStartEvent) => {
    setEditorState(prev => ({
      ...prev,
      draggedElementId: event.active.id as string
    }));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setEditorState(prev => ({
      ...prev,
      hoveredElementId: over?.id as string || null
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const draggedId = active.id as string;
      const overId = over.id as string;
      
      // Verificar se é um novo elemento sendo arrastado da biblioteca
      if (draggedId.startsWith('library-')) {
        const elementType = draggedId.replace('library-', '');
        addElement(elementType, overId === 'canvas' ? undefined : overId);
      } else {
        // Mover elemento existente
        moveElement(draggedId, overId);
      }
    }
    
    setEditorState(prev => ({
      ...prev,
      draggedElementId: null,
      hoveredElementId: null
    }));
  };

  return (
    <>
      <style>{`
        .bg-grid {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .drop-zone-active {
          background-color: rgba(59, 130, 246, 0.1) !important;
          border: 2px dashed rgba(59, 130, 246, 0.5) !important;
        }
        
        .element-dragging {
          opacity: 0.5;
          transform: rotate(2deg);
        }
        
        .quick-edit-panel {
          animation: slideUp 0.2s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>

      {/* Função helper para controlar cursor em textareas */}
      {React.useEffect(() => {
        // Removido - estava causando loop infinito
      }, [])}
      
      <div className="flex h-screen bg-gray-100">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
        {/* Painel Lateral Esquerdo - Biblioteca de Componentes */}
        <ComponentLibrary 
          editorState={editorState}
          setEditorState={setEditorState}
          addElement={addElement}
        />
        
        {/* Área Principal do Editor */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar Superior */}
          <EditorToolbar 
            editorState={editorState} 
            setEditorState={setEditorState} 
            createEbookTemplate={createEbookTemplate}
            createHeroTemplate={createHeroTemplate}
            createPricingTemplate={createPricingTemplate}
            createTestimonialsTemplate={createTestimonialsTemplate}
            createContactTemplate={createContactTemplate}
          />
          
          {/* Canvas Principal */}
          <div className="flex-1 relative overflow-auto bg-white">
            <EditorCanvas 
              ref={canvasRef}
              editorState={editorState} 
              setEditorState={setEditorState}
            />
          </div>
        </main>
        
        {/* Painel Lateral Direito - Propriedades */}
        <PropertiesPanel editorState={editorState} setEditorState={setEditorState} />
        
        {/* Overlay de Drag */}
        <DragOverlay>
          {editorState.draggedElementId ? (
            <div className="bg-blue-500 text-white px-3 py-2 rounded shadow-lg">
              {editorState.draggedElementId.startsWith('library-') 
                ? ELEMENT_DEFINITIONS[editorState.draggedElementId.replace('library-', '') as keyof typeof ELEMENT_DEFINITIONS]?.label
                : 'Movendo elemento'
              }
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
    </>
  );
};

// Componente da Biblioteca de Componentes
const ComponentLibrary: React.FC<{
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  addElement: (type: string, parentId?: string) => void;
}> = ({ editorState, setEditorState, addElement }) => {
  const categories = [
    { id: 'templates', label: '📄 Templates', icon: Layout },
    { id: 'marketing', label: '🚀 Marketing', icon: Star },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'forms', label: 'Formulários', icon: FormInput },
    { id: 'typography', label: 'Texto', icon: Type },
    { id: 'media', label: 'Mídia', icon: Image },
    { id: 'interactive', label: 'Interativo', icon: MousePointer2 },
    { id: 'content', label: 'Conteúdo', icon: FileText }
  ];

  const [activeCategory, setActiveCategory] = useState('templates');

  const elementsInCategory = Object.entries(ELEMENT_DEFINITIONS).filter(
    ([_, definition]) => definition.category === activeCategory
  );

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Componentes</h2>
      </div>
      
      {/* Categories */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap p-2">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md m-1 ${
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComponent size={16} className="mr-2" />
                {category.label}
              </button>
            );
          })}
        </nav>
      </div>
      
      {/* Elements */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {elementsInCategory.map(([type, definition]) => (
            <DraggableLibraryItem
              key={type}
              type={type}
              definition={definition}
              editorState={editorState}
              addElement={addElement}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

// Item arrastável da biblioteca
const DraggableLibraryItem: React.FC<{
  type: string;
  definition: any;
  editorState: EditorState;
  addElement: (type: string, parentId?: string) => void;
}> = ({ type, definition, editorState, addElement }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `library-${type}`,
    data: { type: 'library-item', elementType: type }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const IconComponent = definition.icon;

  // Verificar se há uma div selecionada que pode receber filhos
  const selectedElement = editorState.selectedElementId 
    ? findElementById(editorState.elements, editorState.selectedElementId)
    : null;
    
  const canAddToSelected = selectedElement && selectedElement.canHaveChildren;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (canAddToSelected) {
      // Se há uma div selecionada, adicionar o componente nela
      addElement(type, selectedElement.id);
    } else {
      // Senão, adicionar no canvas principal
      addElement(type);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer
        hover:border-blue-300 hover:bg-blue-50 transition-colors
        ${isDragging ? 'opacity-50' : ''}
        ${canAddToSelected ? 'ring-2 ring-green-200 bg-green-50 border-green-300' : ''}
      `}
    >
      <IconComponent size={20} className="mr-3 text-gray-600" />
      <div>
        <div className="font-medium text-gray-900">{definition.label}</div>
        <div className="text-xs text-gray-500">{definition.tagName}</div>
      </div>
    </div>
  );
};

// Toolbar superior do editor
const EditorToolbar: React.FC<{
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  createEbookTemplate: () => void;
  createHeroTemplate: () => void;
  createPricingTemplate: () => void;
  createTestimonialsTemplate: () => void;
  createContactTemplate: () => void;
}> = ({ editorState, setEditorState, createEbookTemplate, createHeroTemplate, createPricingTemplate, createTestimonialsTemplate, createContactTemplate }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  
  const viewportIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1">
            <button
              disabled={editorState.historyIndex <= 0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Desfazer"
            >
              <RotateCcw size={18} />
            </button>
            <button
              disabled={editorState.historyIndex >= editorState.history.length - 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refazer"
            >
              <RotateCw size={18} />
            </button>
          </div>

          {/* Viewport Selector */}
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg">
            {Object.entries(viewportIcons).map(([viewport, Icon]) => (
              <button
                key={viewport}
                onClick={() => setEditorState(prev => ({ ...prev, viewport: viewport as any }))}
                className={`p-2 ${
                  editorState.viewport === viewport
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={viewport}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Grid/Snap Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditorState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
              className={`p-2 ${
                editorState.showGrid
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Mostrar Grid"
            >
              <Grid3X3 size={18} />
            </button>
          </div>

          {/* Template Buttons */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                title="Templates Prontos"
              >
                <FileText size={16} className="mr-2" />
                Templates 
                <ChevronDown size={16} className="ml-1" />
              </button>
              
              {showTemplates && (
                <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-2 px-2">PÁGINAS COMPLETAS</div>
                    <button
                      onClick={createEbookTemplate}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      📚 Landing Page Ebook
                    </button>
                    <button
                      onClick={createHeroTemplate}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      🚀 Hero Section com CTA
                    </button>
                    <button
                      onClick={createPricingTemplate}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      💰 Tabela de Preços (3 planos)
                    </button>
                    <button
                      onClick={createTestimonialsTemplate}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      ⭐ Seção de Depoimentos
                    </button>
                    <button
                      onClick={createContactTemplate}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      📧 Formulário de Contato
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Preview/Code Toggle */}
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg">
            <button
              onClick={() => setEditorState(prev => ({ ...prev, isPreviewMode: false, showCode: false }))}
              className={`px-3 py-2 text-sm ${
                !editorState.isPreviewMode && !editorState.showCode
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Editar
            </button>
            <button
              onClick={() => setEditorState(prev => ({ ...prev, isPreviewMode: true, showCode: false }))}
              className={`px-3 py-2 text-sm ${
                editorState.isPreviewMode
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={16} className="mr-1 inline" />
              Preview
            </button>
            <button
              onClick={() => setEditorState(prev => ({ ...prev, showCode: true, isPreviewMode: false }))}
              className={`px-3 py-2 text-sm ${
                editorState.showCode
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code size={16} className="mr-1 inline" />
              Código
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Importar"
            >
              <Upload size={18} />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Exportar"
            >
              <Download size={18} />
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              title="Salvar"
            >
              <Save size={16} className="mr-1 inline" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Canvas principal do editor
const EditorCanvas = React.forwardRef<HTMLDivElement, {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}>(({ editorState, setEditorState }, ref) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
    data: { type: 'canvas' }
  });

  const canvasStyles = {
    width: editorState.viewport === 'mobile' ? '375px' : 
           editorState.viewport === 'tablet' ? '768px' : '100%',
    minHeight: '100vh',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    position: 'relative' as const,
    transform: `scale(${editorState.zoom})`,
    transformOrigin: 'top center'
  };

  return (
    <div className="p-8" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div
        ref={(node) => {
          if (ref && typeof ref === 'function') {
            ref(node);
          } else if (ref && 'current' in ref) {
            ref.current = node;
          }
          setNodeRef(node);
        }}
        style={canvasStyles}
        className={`
          relative transition-all duration-200
          ${isOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
          ${editorState.showGrid ? 'bg-grid' : ''}
        `}
      >
        {editorState.elements.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Layout size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Comece criando sua página</h3>
              <p className="text-sm">Arraste componentes da biblioteca para começar</p>
            </div>
          </div>
        ) : (
          editorState.elements.map((element, index) => (
            <RenderableElement
              key={element.id}
              element={element}
              isSelected={element.id === editorState.selectedElementId}
              isHovered={element.id === editorState.hoveredElementId}
              onSelect={(id) => setEditorState(prev => ({ ...prev, selectedElementId: id }))}
              onHover={(id) => setEditorState(prev => ({ ...prev, hoveredElementId: id }))}
              editorState={editorState}
              setEditorState={setEditorState}
            />
          ))
        )}
      </div>
    </div>
  );
});

// Rich Text Formatting Functions
const applyTextFormatting = (command: string) => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja formatar primeiro.');
    return;
  }
  
  document.execCommand(command, false);
};

const applyTextColor = (color: string) => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja colorir primeiro.');
    return;
  }
  
  document.execCommand('foreColor', false, color);
};

const applyBackgroundColor = (color: string) => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja destacar primeiro.');
    return;
  }
  
  if (color === 'transparent') {
    document.execCommand('hiliteColor', false, 'transparent');
  } else {
    document.execCommand('hiliteColor', false, color);
  }
};

const applyTextSize = (direction: 'larger' | 'smaller') => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja redimensionar primeiro.');
    return;
  }
  
  if (direction === 'larger') {
    document.execCommand('increaseFontSize', false);
  } else {
    document.execCommand('decreaseFontSize', false);
  }
};

const applyTextAlignment = (alignment: string) => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja alinhar primeiro.');
    return;
  }
  
  // Para alinhamento, usamos justify + alignment specific commands
  switch (alignment) {
    case 'left':
      document.execCommand('justifyLeft', false);
      break;
    case 'center':
      document.execCommand('justifyCenter', false);
      break;
    case 'right':
      document.execCommand('justifyRight', false);
      break;
    case 'justify':
      document.execCommand('justifyFull', false);
      break;
  }
};

const applyFontFamily = (fontFamily: string) => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja alterar a fonte primeiro.');
    return;
  }
  
  document.execCommand('fontName', false, fontFamily);
};

const applyFontSize = (fontSize: string) => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja alterar o tamanho primeiro.');
    return;
  }
  
  document.execCommand('fontSize', false, '7'); // Use size 7 as base
  // Then apply the specific pixel size via CSS
  const range = selection.getRangeAt(0);
  const selectedText = range.extractContents();
  const span = document.createElement('span');
  span.style.fontSize = fontSize;
  span.appendChild(selectedText);
  range.insertNode(span);
};

const clearTextFormatting = () => {
  if (!window.getSelection) return;
  
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    alert('Por favor, selecione o texto que você deseja limpar a formatação primeiro.');
    return;
  }
  
  document.execCommand('removeFormat', false);
};

// Componente para renderizar elementos
const RenderableElement: React.FC<{
  element: PageElement;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}> = ({ element, isSelected, isHovered, onSelect, onHover, editorState, setEditorState }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(element.content || '');
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: { type: 'element', element }
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: element.id,
    disabled: !element.canHaveChildren,
    data: { type: 'element', element }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxSizing: 'border-box' as const,
    // Aplicar estilos base primeiro
    ...element.styles,
    // Depois forçar largura e altura com !important através de CSS
  } as React.CSSProperties;

  // Para porcentagens, criar um estilo inline mais específico
  const inlineStyle = element.styles.width?.includes('%') || element.styles.height?.includes('%') ? {
    ...style,
    width: element.styles.width || style.width,
    height: element.styles.height || style.height,
    flexShrink: element.styles.flexShrink ?? (element.styles.width?.includes('%') ? 0 : undefined),
    flexBasis: element.styles.flexBasis || (element.styles.width?.includes('%') ? element.styles.width : undefined),
  } : style;

  // Adicionar CSS dinâmico para forçar porcentagens
  React.useEffect(() => {
    const originalWidth = (element.styles as any).originalWidth || element.styles.width;
    
    if (originalWidth || element.styles.height) {
      const cssId = `dynamic-style-${element.id}`;
      let styleElement = document.getElementById(cssId) as HTMLStyleElement;
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = cssId;
        document.head.appendChild(styleElement);
      }
      
      // CSS específico para FLEXBOX - usar flex ao invés de width para porcentagens
      const css = `
        /* Para porcentagens em flexbox: usar flex-basis */
        ${originalWidth?.includes('%') ? `
        [data-element-id="${element.id}"] {
          flex: 0 0 ${originalWidth} !important;
          flex-basis: ${originalWidth} !important;
          flex-shrink: 0 !important;
          flex-grow: 0 !important;
          box-sizing: border-box !important;
          /* NÃO usar width para porcentagens em flexbox */
        }
        ` : ''}
        
        /* Para valores absolutos (px, rem, etc) - pode usar width */
        ${originalWidth && !originalWidth.includes('%') ? `
        [data-element-id="${element.id}"] {
          width: ${originalWidth} !important;
          min-width: ${originalWidth} !important;
          max-width: ${originalWidth} !important;
          flex-basis: ${originalWidth} !important;
          flex-shrink: 0 !important;
          box-sizing: border-box !important;
        }
        ` : ''}
        
        /* Altura sempre funciona normal */
        ${element.styles.height ? `
        [data-element-id="${element.id}"] {
          height: ${element.styles.height} !important;
          min-height: ${element.styles.height} !important;
        }
        ` : ''}
        
        /* FORÇA EXTRA para casos específicos */
        body [data-element-id="${element.id}"] {
          ${originalWidth?.includes('%') ? `
            flex: 0 0 ${originalWidth} !important;
          ` : originalWidth ? `
            width: ${originalWidth} !important;
          ` : ''}
          box-sizing: border-box !important;
        }
      `;
      
      styleElement.textContent = css;
      
      // Log para debug
      if (originalWidth?.includes('%')) {
        console.log(`💪 CSS FLEXBOX aplicado para ${element.id}:`, {
          originalWidth,
          flexBasis: originalWidth,
          approach: 'flex-only-no-width',
          element: document.querySelector(`[data-element-id="${element.id}"]`)
        });
      }
      
      return () => {
        const el = document.getElementById(cssId);
        if (el) el.remove();
      };
    }
  }, [element.id, element.styles.width, element.styles.height, (element.styles as any).originalWidth]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.content !== undefined) {
      setIsEditing(true);
      setEditingContent(element.content);
    }
  };

  const handleContentSave = () => {
    updateElementProperty(element.id, 'content', editingContent, editorState, setEditorState);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleContentSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditingContent(element.content || '');
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const renderElement = () => {
    const TagName = element.tagName as any;
    const isVoidElement = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'].includes(element.tagName);
    
    const renderToolbar = () => (
      isSelected && !isEditing && (
        <div className="absolute -top-8 left-0 flex items-center bg-blue-500 text-white text-xs rounded shadow-lg">
          <span className="px-2 py-1">{element.type}</span>
          {element.content !== undefined && !isVoidElement && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="px-2 py-1 hover:bg-blue-600 border-l border-blue-400"
              title="Editar texto"
            >
              Aa
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteElement(element.id, editorState, setEditorState);
            }}
            className="px-2 py-1 hover:bg-red-600 border-l border-blue-400"
            title="Excluir"
          >
            ×
          </button>
        </div>
      )
    );
    
    if (isVoidElement) {
      return (
        <div className="relative">
          <TagName
            {...element.attributes}
            data-element-id={element.id}
            style={inlineStyle}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => onHover(element.id)}
            onMouseLeave={() => onHover(null)}
            className={`
              ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-75' : ''}
              ${isHovered && !isSelected ? 'ring-1 ring-blue-300 ring-opacity-50' : ''}
              ${isOver && element.canHaveChildren ? 'ring-2 ring-green-400 ring-opacity-50' : ''}
            `}
          />
          {renderToolbar()}
        </div>
      );
    }
    
    return (
      <TagName
        {...element.attributes}
        data-element-id={element.id}
        style={inlineStyle}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => onHover(element.id)}
        onMouseLeave={() => onHover(null)}
        className={`
          relative
          ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-75' : ''}
          ${isHovered && !isSelected ? 'ring-1 ring-blue-300 ring-opacity-50' : ''}
          ${isOver && element.canHaveChildren ? 'ring-2 ring-green-400 ring-opacity-50' : ''}
          ${element.content !== undefined ? 'cursor-text' : ''}
        `}
      >
        {isEditing ? (
          <textarea
            value={editingContent}
            onChange={(e) => {
              let content = e.target.value;
              // Função para detectar e corrigir texto invertido
              const correctInvertedText = (text: string) => {
                const commonWords = [
                  { original: 'teste', inverted: 'etset' },
                  { original: 'texto', inverted: 'otxet' },
                  { original: 'hello', inverted: 'olleh' },
                  { original: 'world', inverted: 'dlrow' },
                  { original: 'casa', inverted: 'asac' },
                  { original: 'nome', inverted: 'emon' },
                  { original: 'valor', inverted: 'rolav' },
                  { original: 'botao', inverted: 'oatob' },
                  { original: 'link', inverted: 'knil' },
                  { original: 'imagem', inverted: 'megami' },
                  { original: 'lista', inverted: 'atsil' }
                ];
                let correctedText = text;
                commonWords.forEach(({ original, inverted }) => {
                  const regex = new RegExp(inverted, 'gi');
                  correctedText = correctedText.replace(regex, original);
                });
                // Detecta se uma linha inteira pode estar invertida
                const lines = correctedText.split('\n');
                const correctedLines = lines.map(line => {
                  const trimmedLine = line.trim();
                  if (trimmedLine.length > 2 && /^[a-zA-Z0-9\s]+$/.test(trimmedLine)) {
                    const reversed = trimmedLine.split('').reverse().join('');
                    const hasKnownWords = commonWords.some(({ original }) => 
                      reversed.toLowerCase().includes(original.toLowerCase())
                    );
                    if (hasKnownWords) {
                      return reversed;
                    }
                  }
                  return line;
                });
                return correctedLines.join('\n');
              };
              const correctedContent = correctInvertedText(content);
              setEditingContent(correctedContent);
            }}
            onBlur={handleContentSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const textarea = e.target as HTMLTextAreaElement;
                const cursorPos = textarea.selectionStart;
                const textBefore = textarea.value.substring(0, cursorPos);
                const textAfter = textarea.value.substring(cursorPos);
                const newContent = textBefore + '<br>' + textAfter;
                const correctInvertedText = (text: string) => {
                  const commonWords = [
                    { original: 'teste', inverted: 'etset' },
                    { original: 'texto', inverted: 'otxet' },
                    { original: 'casa', inverted: 'asac' },
                    { original: 'nome', inverted: 'emon' }
                  ];
                  let corrected = text;
                  commonWords.forEach(({ original, inverted }) => {
                    corrected = corrected.replace(new RegExp(inverted, 'gi'), original);
                  });
                  return corrected;
                };
                const finalContent = correctInvertedText(newContent);
                setEditingContent(finalContent);
                setTimeout(() => {
                  const newCursorPos = cursorPos + 4;
                  textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
              }
            }}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-left"
            style={{ fontSize: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit', color: 'inherit', padding: '0', margin: '0', direction: 'ltr', unicodeBidi: 'normal' }}
            rows={2}
          />
        ) : (
          <div
            contentEditable={isSelected}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: element.content || '' }}
            dir="ltr"
            spellCheck={false}
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              updateElementContent(element.id, target.innerHTML, editorState, setEditorState);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  range.deleteContents();
                  
                  const br = document.createElement('br');
                  range.insertNode(br);
                  
                  range.setStartAfter(br);
                  range.setEndAfter(br);
                  selection.removeAllRanges();
                  selection.addRange(range);
                  
                  const target = e.target as HTMLDivElement;
                  updateElementContent(element.id, target.innerHTML, editorState, setEditorState);
                }
              }
            }}
            onFocus={(e) => {
              e.stopPropagation();
            }}
            className={`outline-none ${isSelected ? 'cursor-text' : 'cursor-pointer'}`}
            style={{ 
              minHeight: '1em',
              textAlign: 'left !important' as any,
              direction: 'ltr !important' as any,
              unicodeBidi: 'embed !important' as any,
              writingMode: 'horizontal-tb !important' as any
            }}
          />
        )}
        
        {element.canHaveChildren && element.children.map(child => (
          <RenderableElement
            key={child.id}
            element={child}
            isSelected={child.id === editorState.selectedElementId}
            isHovered={child.id === editorState.hoveredElementId}
            onSelect={onSelect}
            onHover={onHover}
            editorState={editorState}
            setEditorState={setEditorState}
          />
        ))}
        
        {renderToolbar()}
        
        {/* Drag Handle */}
        {isSelected && (
          <div
            {...attributes}
            {...listeners}
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full cursor-grab flex items-center justify-center"
          >
            <Move size={12} className="text-white" />
          </div>
        )}
      </TagName>
    );
  };

  return (
    <div ref={(node) => {
      setNodeRef(node);
      if (element.canHaveChildren) {
        setDropRef(node);
      }
    }}>
      {renderElement()}
    </div>
  );
};

// Painel de Propriedades
const PropertiesPanel: React.FC<{
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}> = ({ editorState, setEditorState }) => {
  const selectedElement = findElementById(editorState.elements, editorState.selectedElementId);

  // Função para encontrar o elemento pai do elemento selecionado
  const findParentElement = (): PageElement | null => {
    if (!selectedElement) return null;
    
    const findParentIn = (elements: PageElement[], targetId: string): PageElement | null => {
      for (const element of elements) {
        if (element.children.some(child => child.id === targetId)) {
          return element;
        }
        // Buscar recursivamente nos filhos
        const found = findParentIn(element.children, targetId);
        if (found) return found;
      }
      return null;
    };
    
    return findParentIn(editorState.elements, selectedElement.id);
  };

  if (!editorState.selectedElementId || !selectedElement) {
    return (
      <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Propriedades</h3>
          <p className="text-gray-500 text-sm">Selecione um elemento para editar suas propriedades</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* CSS Global */}
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Palette size={16} className="mr-2 text-purple-500" />
              🎨 CSS Global
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Escreva CSS personalizado que será aplicado a toda a página. Use as classes que você criar no campo "Classes CSS" dos elementos.
            </p>
            
            <textarea
              value={editorState.globalCSS}
              onChange={(e) => setEditorState(prev => ({ ...prev, globalCSS: e.target.value }))}
              placeholder={`.minha-classe {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 15px 30px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.minha-classe:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.texto-destaque {
  color: #e74c3c;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}`}
              className="w-full h-80 p-3 border border-gray-300 rounded-lg text-sm font-mono resize-none bg-gray-50 text-gray-900 text-left"
              dir="ltr"
              style={{ textAlign: 'left', direction: 'ltr', unicodeBidi: 'embed' }}
            />
            
            <div className="mt-3 text-xs text-gray-600 space-y-1">
              <p><strong>💡 Como usar:</strong></p>
              <p>1. Escreva suas classes CSS aqui</p>
              <p>2. No elemento, coloque o nome da classe em "Classes CSS"</p>
              <p>3. O estilo será aplicado automaticamente!</p>
            </div>
          </div>
          
          {/* Exemplos de Classes */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Code size={16} className="mr-2 text-green-500" />
              📚 Exemplos de Classes
            </h4>
            
            <div className="space-y-3 text-xs">
              <div className="p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                <strong className="text-blue-600">.botao-especial</strong>
                <p className="text-gray-600">Botão com gradiente e animação</p>
              </div>
              
              <div className="p-2 bg-gray-50 rounded border-l-4 border-red-400">
                <strong className="text-red-600">.texto-destaque</strong>
                <p className="text-gray-600">Texto grande com sombra</p>
              </div>
              
              <div className="p-2 bg-gray-50 rounded border-l-4 border-green-400">
                <strong className="text-green-600">.animacao-fade</strong>
                <p className="text-gray-600">Animação de aparecer suave</p>
              </div>
              
              <div className="p-2 bg-gray-50 rounded border-l-4 border-purple-400">
                <strong className="text-purple-600">.caixa-destaque</strong>
                <p className="text-gray-600">Caixa com borda colorida</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <p className="text-xs text-blue-700">
            💡 <strong>Dica:</strong> Selecione uma div e clique em qualquer componente da biblioteca para adicioná-lo automaticamente!
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Propriedades</h3>
            <p className="text-sm text-gray-500">{selectedElement.type}</p>
          </div>
          <button
            onClick={() => setEditorState(prev => ({ ...prev, selectedElementId: null }))}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Indicação quando div pode receber componentes */}
      {selectedElement.canHaveChildren && (
        <div className="p-3 bg-green-50 border-b border-green-200">
          <div className="flex items-center text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Div ativa para receber componentes</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Clique em qualquer componente da biblioteca para adicioná-lo aqui automaticamente!
          </p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {/* PROPRIEDADES BÁSICAS - PARA TODOS OS ELEMENTOS */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Settings size={16} className="mr-2 text-purple-500" />
            ⚙️ Propriedades Básicas
          </h4>
          
          {/* Nome/ID do Elemento */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              🏷️ Nome do Elemento (ID)
            </label>
            <input
              type="text"
              value={selectedElement.attributes?.id || ''}
              onChange={(e) => updateElementProperty(selectedElement.id, 'attributes', { 
                ...selectedElement.attributes, 
                id: e.target.value 
              }, editorState, setEditorState)}
              placeholder="ex: meuBotao, header, sidebar..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Use para identificar este elemento em JavaScript (sem espaços)
            </p>
          </div>
          
          {/* Visibilidade */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              👁️ Visibilidade
            </label>
            <select
              value={selectedElement.styles?.display === 'none' ? 'hidden' : 'visible'}
              onChange={(e) => updateElementStyle(selectedElement.id, 'display', e.target.value === 'hidden' ? 'none' : (selectedElement.styles?.display?.startsWith('flex') ? 'flex' : 'block'), editorState, setEditorState)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
            >
              <option value="visible" className="text-gray-900 bg-white">👁️ Visível</option>
              <option value="hidden" className="text-gray-900 bg-white">🙈 Oculto</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              💡 Elementos ocultos não aparecem na página, mas existem no código
            </p>
          </div>
          
          {/* Classe CSS Customizada */}
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              🎨 Classes CSS
            </label>
            <input
              type="text"
              value={selectedElement.attributes?.className || ''}
              onChange={(e) => updateElementProperty(selectedElement.id, 'attributes', { 
                ...selectedElement.attributes, 
                className: e.target.value 
              }, editorState, setEditorState)}
              placeholder="ex: botao-especial, texto-destaque"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Classes CSS personalizadas (separadas por espaço)
            </p>
          </div>
        </div>

        {/* Text Content */}
        {selectedElement.content !== undefined && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Type size={16} className="mr-2 text-blue-500" />
              ✏️ Texto
            </h4>
            <textarea
              value={selectedElement.content}
              onChange={(e) => {
                let content = e.target.value;
                
                // Função para detectar e corrigir texto invertido
                const correctInvertedText = (text: string) => {
                  // Lista de palavras comuns que podem estar invertidas
                  const commonWords = [
                    { original: 'teste', inverted: 'etset' },
                    { original: 'texto', inverted: 'otxet' },
                    { original: 'hello', inverted: 'olleh' },
                    { original: 'world', inverted: 'dlrow' },
                    { original: 'casa', inverted: 'asac' },
                    { original: 'nome', inverted: 'emon' },
                    { original: 'valor', inverted: 'rolav' },
                    { original: 'botao', inverted: 'oatob' },
                    { original: 'link', inverted: 'knil' },
                    { original: 'imagem', inverted: 'megami' },
                    { original: 'lista', inverted: 'atsil' }
                  ];
                  
                  let correctedText = text;
                  
                  // Corrige palavras invertidas conhecidas
                  commonWords.forEach(({ original, inverted }) => {
                    const regex = new RegExp(inverted, 'gi');
                    correctedText = correctedText.replace(regex, original);
                  });
                  
                  // Detecta se uma linha inteira pode estar invertida
                  const lines = correctedText.split('\n');
                  const correctedLines = lines.map(line => {
                    const trimmedLine = line.trim();
                    
                    // Se a linha tem mais de 2 caracteres e contém apenas letras/números
                    if (trimmedLine.length > 2 && /^[a-zA-Z0-9\s]+$/.test(trimmedLine)) {
                      // Verifica se invertendo a linha ela fica mais parecida com português
                      const reversed = trimmedLine.split('').reverse().join('');
                      
                      // Se a linha invertida contém palavras conhecidas, usa ela
                      const hasKnownWords = commonWords.some(({ original }) => 
                        reversed.toLowerCase().includes(original.toLowerCase())
                      );
                      
                      if (hasKnownWords) {
                        return line.replace(trimmedLine, reversed);
                      }
                    }
                    
                    return line;
                  });
                  
                  return correctedLines.join('\n');
                };
                
                // Aplica a correção
                const correctedContent = correctInvertedText(content);
                
                updateElementProperty(selectedElement.id, 'content', correctedContent, editorState, setEditorState);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Evita a quebra de linha padrão
                  
                  const textarea = e.target as HTMLTextAreaElement;
                  const cursorPos = textarea.selectionStart;
                  const textBefore = textarea.value.substring(0, cursorPos);
                  const textAfter = textarea.value.substring(cursorPos);
                  
                  // Insere <br> no lugar do Enter
                  const newContent = textBefore + '<br>' + textAfter;
                  
                  // Aplica correção de texto invertido se necessário
                  const correctInvertedText = (text: string) => {
                    const commonWords = [
                      { original: 'teste', inverted: 'etset' },
                      { original: 'texto', inverted: 'otxet' },
                      { original: 'casa', inverted: 'asac' },
                      { original: 'nome', inverted: 'emon' }
                    ];
                    
                    let corrected = text;
                    commonWords.forEach(({ original, inverted }) => {
                      corrected = corrected.replace(new RegExp(inverted, 'gi'), original);
                    });
                    return corrected;
                  };
                  
                  const finalContent = correctInvertedText(newContent);
                  updateElementProperty(selectedElement.id, 'content', finalContent, editorState, setEditorState);
                  
                  // Move o cursor para depois do <br>
                  setTimeout(() => {
                    const newCursorPos = cursorPos + 4; // 4 = comprimento de '<br>'
                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                  }, 0);
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none text-gray-900 bg-white text-left"
              rows={3}
              placeholder="Digite seu texto aqui..."
              dir="ltr"
              style={{ 
                textAlign: 'left',
                direction: 'ltr',
                unicodeBidi: 'normal'
              }}
            />
          </div>
        )}

        {/* Rich Text Formatting Controls */}
        {selectedElement.content !== undefined && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Type size={16} className="mr-2 text-purple-500" />
              🎨 Formatação Rich Text
            </h4>
            
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">
                💡 Selecione parte do texto no canvas e use os botões abaixo para formatar
              </p>
              
              {/* Text Formatting Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => applyTextFormatting('bold')}
                  className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  title="Negrito"
                >
                  <Bold size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => applyTextFormatting('italic')}
                  className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  title="Itálico"
                >
                  <Italic size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => applyTextFormatting('underline')}
                  className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  title="Sublinhado"
                >
                  <Underline size={14} className="text-gray-600" />
                </button>
              </div>
              
              {/* Text Alignment Controls */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-2 block">Alinhamento do Texto</label>
                <div className="grid grid-cols-4 gap-1">
                  <button
                    onClick={() => applyTextAlignment('left')}
                    className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    title="Alinhar à Esquerda"
                  >
                    <AlignLeft size={14} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => applyTextAlignment('center')}
                    className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    title="Centralizar"
                  >
                    <AlignCenter size={14} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => applyTextAlignment('right')}
                    className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    title="Alinhar à Direita"
                  >
                    <AlignRight size={14} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => applyTextAlignment('justify')}
                    className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-xs font-semibold"
                    title="Justificar"
                  >
                    ≡
                  </button>
                </div>
              </div>
              
              {/* Text Color Picker */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-2 block">🎨 Cor do Texto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    onChange={(e) => applyTextColor(e.target.value)}
                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                    title="Escolher cor para o texto selecionado"
                  />
                  <input
                    type="text"
                    placeholder="#000000"
                    onChange={(e) => applyTextColor(e.target.value)}
                    className="flex-1 p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Background Color Picker */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-2 block">🎭 Cor de Fundo do Texto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    onChange={(e) => applyBackgroundColor(e.target.value)}
                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                    title="Escolher cor de fundo para o texto selecionado"
                  />
                  <input
                    type="text"
                    placeholder="#FFFF00"
                    onChange={(e) => applyBackgroundColor(e.target.value)}
                    className="flex-1 p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                  />
                  <button
                    onClick={() => applyBackgroundColor('transparent')}
                    className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs hover:bg-gray-200 transition-colors"
                    title="Remover fundo"
                  >
                    🚫
                  </button>
                </div>
              </div>
              

              
              {/* Font Family Controls */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-2 block">Família da Fonte</label>
                <select
                  onChange={(e) => applyFontFamily(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Escolher fonte...</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Helvetica, sans-serif">Helvetica</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Tahoma, sans-serif">Tahoma</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="'Lucida Grande', sans-serif">Lucida Grande</option>
                  <option value="Impact, sans-serif">Impact</option>
                  <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                  <option value="'Palatino Linotype', serif">Palatino</option>
                  <option value="'Book Antiqua', serif">Book Antiqua</option>
                  <option value="'Lucida Console', monospace">Lucida Console</option>
                  <option value="'Brush Script MT', cursive">Brush Script</option>
                </select>
              </div>

              {/* Font Size Controls */}
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-2 block">Tamanho da Fonte</label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => applyFontSize(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>Tamanho...</option>
                    <option value="10px">10px</option>
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="24px">24px</option>
                    <option value="28px">28px</option>
                    <option value="32px">32px</option>
                    <option value="36px">36px</option>
                    <option value="48px">48px</option>
                    <option value="64px">64px</option>
                  </select>
                  <button
                    onClick={() => applyTextSize('larger')}
                    className="px-3 py-2 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors"
                    title="Aumentar"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => applyTextSize('smaller')}
                    className="px-3 py-2 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors"
                    title="Diminuir"
                  >
                    ⬇️
                  </button>
                </div>
              </div>
              
              {/* Clear Formatting */}
              <button
                onClick={() => clearTextFormatting()}
                className="w-full p-2 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100 transition-colors"
              >
                🧹 Limpar Formatação
              </button>
            </div>
          </div>
        )}
        
        {/* FUNÇÕES UTILITÁRIAS PARA DETERMINAR PROPRIEDADES */}
        {(() => {
          const elementType = selectedElement?.type;
          
          // Determinar quais seções mostrar baseado no tipo do elemento
          const shouldShowTypography = () => {
            return ['heading', 'paragraph', 'span', 'button', 'link', 'label', 'option'].includes(elementType || '') || 
                   selectedElement?.content !== undefined;
          };
          
          const shouldShowLayout = () => {
            return ['container', 'section', 'div', 'header', 'footer', 'nav', 'aside', 'article', 'main'].includes(elementType || '');
          };
          
          const shouldShowFlexbox = () => {
            return shouldShowLayout() && selectedElement?.styles?.display === 'flex';
          };
          
          const shouldShowGrid = () => {
            return shouldShowLayout() && selectedElement?.styles?.display === 'grid';
          };
          
          const shouldShowImageProps = () => {
            return elementType === 'image';
          };
          
          const shouldShowButtonProps = () => {
            return elementType === 'button';
          };
          
          const shouldShowFormProps = () => {
            return ['input', 'textarea', 'select', 'label'].includes(elementType || '');
          };
          
          const shouldShowLinkProps = () => {
            return elementType === 'link';
          };
          
          const shouldShowBasicStyles = () => {
            // Todos os elementos podem ter cores, padding, margin básicos
            return true;
          };
          
          const shouldShowPositioning = () => {
            // Elementos que podem ser posicionados
            return !['option'].includes(elementType || '');
          };
          
          const shouldShowDimensions = () => {
            // Elementos que podem ter largura/altura
            return !['span', 'strong', 'em', 'option'].includes(elementType || '');
          };
          
          return null; // Esta função só define as utilitárias
        })()}
        
        {/* Typography Controls */}
        {selectedElement && (() => {
          const elementType = selectedElement?.type;
          const shouldShowTypography = ['heading', 'paragraph', 'span', 'button', 'link', 'label', 'option'].includes(elementType || '') || 
                                     selectedElement?.content !== undefined;
          return shouldShowTypography;
        })() && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Bold size={16} className="mr-2 text-purple-500" />
              🔤 Tipografia
            </h4>
            
            {/* Font Size */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Tamanho: {selectedElement.styles.fontSize || '16px'}</label>
              <input
                type="range"
                min="12"
                max="72"
                value={parseInt(selectedElement.styles.fontSize?.replace('px', '') || '16')}
                onChange={(e) => updateElementStyle(selectedElement.id, 'fontSize', `${e.target.value}px`, editorState, setEditorState)}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Font Weight */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Peso da Fonte</label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { value: '300', label: 'Fino' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'bold', label: 'Negrito' },
                  { value: '800', label: 'Extra' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'fontWeight', value, editorState, setEditorState)}
                    className={`p-2 text-xs rounded border transition-all ${
                      selectedElement.styles.fontWeight === value || (value === 'normal' && !selectedElement.styles.fontWeight)
                        ? 'bg-purple-500 text-white border-purple-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50'
                    }`}
                    style={{ fontWeight: value === 'normal' ? 400 : value }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Text Alignment */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Alinhamento</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { value: 'left', icon: '⬅️' },
                  { value: 'center', icon: '⬄' },
                  { value: 'right', icon: '➡️' },
                  { value: 'justify', icon: '⬌' }
                ].map(({ value, icon }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'textAlign', value, editorState, setEditorState)}
                    className={`p-2 text-sm rounded border transition-all ${
                      selectedElement.styles.textAlign === value || (value === 'left' && !selectedElement.styles.textAlign)
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Color Controls */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Palette size={16} className="mr-2 text-pink-500" />
            🎨 Cores
          </h4>
          
          {/* Text Color */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Cor do Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.styles.color || '#000000'}
                onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value, editorState, setEditorState)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                title="Clique para escolher a cor do texto"
              />
              <input
                type="text"
                value={selectedElement.styles.color || '#000000'}
                onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value, editorState, setEditorState)}
                placeholder="#000000"
                className="flex-1 p-2 border border-gray-300 rounded text-xs font-mono text-gray-900 bg-white"
              />
            </div>
          </div>
          
          {/* Background Color */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Cor de Fundo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedElement.styles.backgroundColor || '#ffffff'}
                onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value, editorState, setEditorState)}
                className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                title="Clique para escolher a cor de fundo"
              />
              <input
                type="text"
                value={selectedElement.styles.backgroundColor || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value, editorState, setEditorState)}
                placeholder="Transparente ou #000000"
                className="flex-1 p-2 border border-gray-300 rounded text-xs font-mono text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
        
        {/* Spacing & Effects */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Square size={16} className="mr-2 text-green-500" />
            📏 Estilo
          </h4>
          
          {/* Padding */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Espaçamento Interno</label>
            <div className="grid grid-cols-4 gap-1">
              {['0', '10px', '20px', '30px'].map(padding => (
                <button
                  key={padding}
                  onClick={() => updateElementStyle(selectedElement.id, 'padding', padding, editorState, setEditorState)}
                  className={`p-2 text-xs rounded border transition-all ${
                    selectedElement.styles.padding === padding || (padding === '0' && !selectedElement.styles.padding)
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                  }`}
                >
                  {padding === '0' ? 'Nenhum' : padding}
                </button>
              ))}
            </div>
          </div>
          
          {/* Border Radius */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Cantos Arredondados</label>
            <div className="grid grid-cols-4 gap-1">
              {['0', '8px', '12px', '50px'].map(radius => (
                <button
                  key={radius}
                  onClick={() => updateElementStyle(selectedElement.id, 'borderRadius', radius, editorState, setEditorState)}
                  className={`p-2 text-xs rounded border transition-all ${
                    selectedElement.styles.borderRadius === radius || (radius === '0' && !selectedElement.styles.borderRadius)
                      ? 'bg-indigo-500 text-white border-indigo-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'
                  }`}
                  style={{ borderRadius: radius }}
                >
                  {radius === '0' ? '□' : radius === '8px' ? '▢' : radius === '12px' ? '▢' : '●'}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation Controls - Only for buttons */}
        {(selectedElement.type === 'ctaPrimary' || selectedElement.type === 'ctaSecondary' || selectedElement.tagName === 'button') && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <MousePointer2 size={16} className="mr-2 text-blue-500" />
              🔗 Navegação
            </h4>
            
            {/* Navigation Type Selector */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-2 block">Tipo de Ação</label>
              <select
                value={selectedElement.attributes?.['data-action'] || ''}
                onChange={(e) => {
                  const action = e.target.value;
                  updateElementAttribute(selectedElement.id, 'data-action', action, editorState, setEditorState);
                  // Clear other attributes when changing action type
                  if (action !== 'navigate') updateElementAttribute(selectedElement.id, 'data-url', '', editorState, setEditorState);
                  if (action !== 'scroll') updateElementAttribute(selectedElement.id, 'data-section', '', editorState, setEditorState);
                  if (action !== 'whatsapp') {
                    updateElementAttribute(selectedElement.id, 'data-number', '', editorState, setEditorState);
                    updateElementAttribute(selectedElement.id, 'data-message', '', editorState, setEditorState);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
              >
                <option value="">Selecione uma ação</option>
                <option value="navigate">🌐 Ir para URL</option>
                <option value="scroll">⬇️ Rolar para seção</option>
                <option value="whatsapp">📱 Abrir WhatsApp</option>
                <option value="email">📧 Enviar Email</option>
              </select>
            </div>
            
            {/* URL Configuration */}
            {selectedElement.attributes?.['data-action'] === 'navigate' && (
              <>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-2 block">URL de Destino</label>
                  <input
                    type="url"
                    value={selectedElement.attributes?.['data-url'] || ''}
                    onChange={(e) => {
                      updateElementAttribute(selectedElement.id, 'data-url', e.target.value, editorState, setEditorState);
                      updateElementEvent(selectedElement.id, 'onClick', NavigationHelpers.openExternal(e.target.value, selectedElement.attributes?.['data-target'] || '_blank'), editorState, setEditorState);
                    }}
                    placeholder="https://exemplo.com"
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                  />
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-2 block">Abrir em</label>
                  <select
                    value={selectedElement.attributes?.['data-target'] || '_blank'}
                    onChange={(e) => {
                      updateElementAttribute(selectedElement.id, 'data-target', e.target.value, editorState, setEditorState);
                      const url = selectedElement.attributes?.['data-url'] || '';
                      if (url) {
                        updateElementEvent(selectedElement.id, 'onClick', NavigationHelpers.openExternal(url, e.target.value), editorState, setEditorState);
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                  >
                    <option value="_blank">Nova aba</option>
                    <option value="_self">Mesma aba</option>
                  </select>
                </div>
              </>
            )}
            
            {/* Scroll to Section Configuration */}
            {selectedElement.attributes?.['data-action'] === 'scroll' && (
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-2 block">ID da Seção</label>
                <input
                  type="text"
                  value={selectedElement.attributes?.['data-section'] || ''}
                  onChange={(e) => {
                    updateElementAttribute(selectedElement.id, 'data-section', e.target.value, editorState, setEditorState);
                    updateElementEvent(selectedElement.id, 'onClick', NavigationHelpers.scrollToSection(e.target.value), editorState, setEditorState);
                  }}
                  placeholder="Ex: depoimentos, sobre, contato"
                  className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                />
                <p className="text-xs text-gray-400 mt-1">Digite o ID da seção para fazer scroll automático</p>
              </div>
            )}
            
            {/* WhatsApp Configuration */}
            {selectedElement.attributes?.['data-action'] === 'whatsapp' && (
              <>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-2 block">Número do WhatsApp</label>
                  <input
                    type="tel"
                    value={selectedElement.attributes?.['data-number'] || ''}
                    onChange={(e) => {
                      updateElementAttribute(selectedElement.id, 'data-number', e.target.value, editorState, setEditorState);
                      const message = selectedElement.attributes?.['data-message'] || '';
                      updateElementEvent(selectedElement.id, 'onClick', NavigationHelpers.openWhatsApp(e.target.value, message), editorState, setEditorState);
                    }}
                    placeholder="5511999999999"
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">Formato: código do país + DDD + número</p>
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-2 block">Mensagem Pré-definida</label>
                  <textarea
                    value={selectedElement.attributes?.['data-message'] || ''}
                    onChange={(e) => {
                      updateElementAttribute(selectedElement.id, 'data-message', e.target.value, editorState, setEditorState);
                      const number = selectedElement.attributes?.['data-number'] || '';
                      if (number) {
                        updateElementEvent(selectedElement.id, 'onClick', NavigationHelpers.openWhatsApp(number, e.target.value), editorState, setEditorState);
                      }
                    }}
                    placeholder="Olá! Tenho interesse no produto."
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white resize-none"
                    rows={2}
                  />
                </div>
              </>
            )}
            
            {/* Email Configuration */}
            {selectedElement.attributes?.['data-action'] === 'email' && (
              <>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-2 block">Email de Destino</label>
                  <input
                    type="email"
                    value={selectedElement.attributes?.['data-url'] || ''}
                    onChange={(e) => {
                      updateElementAttribute(selectedElement.id, 'data-url', e.target.value, editorState, setEditorState);
                      updateElementEvent(selectedElement.id, 'onClick', NavigationHelpers.openEmail(e.target.value, selectedElement.attributes?.['data-section'] || '', selectedElement.attributes?.['data-message'] || ''), editorState, setEditorState);
                    }}
                    placeholder="contato@exemplo.com"
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                  />
                </div>
                <div className="mb-3">
                  <label className="text-xs text-gray-500 mb-2 block">Assunto</label>
                  <input
                    type="text"
                    value={selectedElement.attributes?.['data-section'] || ''}
                    onChange={(e) => {
                      updateElementAttribute(selectedElement.id, 'data-section', e.target.value, editorState, setEditorState);
                      const email = selectedElement.attributes?.['data-url'] || '';
                      const message = selectedElement.attributes?.['data-message'] || '';
                      if (email) {
                        updateElementEvent(selectedElement.id, 'onClick', NavigationHelpers.openEmail(email, e.target.value, message), editorState, setEditorState);
                      }
                    }}
                    placeholder="Interesse no produto"
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Layout & Dimensions Controls */}
        {selectedElement && (() => {
          const elementType = selectedElement?.type;
          const shouldShowDimensions = !['span', 'strong', 'em', 'option'].includes(elementType || '');
          return shouldShowDimensions;
        })() && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Layout size={16} className="mr-2 text-green-500" />
            📐 Layout & Dimensões
          </h4>
          
          {/* Display Type */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Tipo de Display</label>
            <select
              value={selectedElement.styles.display || 'block'}
              onChange={(e) => updateElementStyle(selectedElement.id, 'display', e.target.value, editorState, setEditorState)}
              className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
            >
              <option value="block">Block</option>
              <option value="flex">Flex</option>
              <option value="grid">Grid</option>
              <option value="inline-block">Inline Block</option>
              <option value="inline">Inline</option>
              <option value="none">Oculto</option>
            </select>
          </div>

          {/* CONFIGURAÇÕES RÁPIDAS DE LAYOUT */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="text-xs font-medium text-blue-800 mb-2">⚡ Configurações Rápidas</div>
            
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => {
                  // Configurar para divs lado a lado
                  updateElementStyle(selectedElement.id, 'display', 'flex', editorState, setEditorState);
                  setTimeout(() => {
                    updateElementStyle(selectedElement.id, 'flexDirection', 'row', editorState, setEditorState);
                  }, 50);
                }}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                🔗 Divs Lado a Lado (Flex Row)
              </button>
              
              <button
                onClick={() => {
                  // Configurar para divs empilhadas
                  updateElementStyle(selectedElement.id, 'display', 'flex', editorState, setEditorState);
                  setTimeout(() => {
                    updateElementStyle(selectedElement.id, 'flexDirection', 'column', editorState, setEditorState);
                  }, 50);
                }}
                className="w-full px-3 py-2 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
              >
                📚 Divs Empilhadas (Flex Column)
              </button>

              <button
                onClick={() => {
                  // Configurar grid 2 colunas
                  updateElementStyle(selectedElement.id, 'display', 'grid', editorState, setEditorState);
                  setTimeout(() => {
                    updateElementStyle(selectedElement.id, 'gridTemplateColumns', '1fr 1fr', editorState, setEditorState);
                  }, 50);
                }}
                className="w-full px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
              >
                🎯 Grid 2 Colunas
              </button>
            </div>

            <div className="mt-2 text-xs text-blue-600">
              💡 <strong>Para usar:</strong> Primeiro clique na opção desejada, depois configure as larguras das divs filhas nas propriedades individuais
            </div>
          </div>

          {/* Width & Height */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Largura</label>
                <input
                  type="text"
                  value={(selectedElement.styles as any).originalWidth || selectedElement.styles.width || ''}
                  onChange={(e) => updateElementStyle(selectedElement.id, 'width', e.target.value, editorState, setEditorState)}
                  placeholder="40%, 300px, auto"
                  className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Altura</label>
                <input
                  type="text"
                value={selectedElement.styles.height || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'height', e.target.value, editorState, setEditorState)}
                placeholder="auto, 100vh, 200px"
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
            </div>
            
            {/* Quick Width Options */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-2 block">⚡ Larguras Rápidas</label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { value: '25%', label: '25%' },
                  { value: '50%', label: '50%' },
                  { value: '75%', label: '75%' },
                  { value: '100%', label: '100%' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'width', value, editorState, setEditorState)}
                    className={`p-2 text-xs rounded border transition-all ${
                      selectedElement.styles.width === value
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1 mt-2">
                {[
                  { value: 'auto', label: 'Auto' },
                  { value: 'fit-content', label: 'Ajustar' },
                  { value: 'max-content', label: 'Máximo' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'width', value, editorState, setEditorState)}
                    className={`p-2 text-xs rounded border transition-all ${
                      selectedElement.styles.width === value
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              {/* Percentage Help */}
              {selectedElement.styles.width && selectedElement.styles.width.includes('%') && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                  <div className="font-medium text-blue-800 mb-1">💡 Porcentagem Ativa:</div>
                  <div className="text-blue-700">
                    {selectedElement.styles.width} do elemento pai.
                    {!findParentElement() && (
                      <div className="text-orange-600 mt-1">
                        ⚠️ Este elemento não tem pai com largura definida.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CONFIGURAÇÃO ESPECÍFICA PARA IMAGENS */}
          {selectedElement.type === 'image' && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
              <div className="text-xs font-medium text-purple-800 mb-2">🖼️ Configurações de Imagem</div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => {
                    updateElementStyle(selectedElement.id, 'width', '100%', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'height', 'auto', editorState, setEditorState);
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                >
                  📏 100% da Div
                </button>
                
                <button
                  onClick={() => {
                    updateElementStyle(selectedElement.id, 'width', 'auto', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'height', 'auto', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'objectFit', '', editorState, setEditorState);
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                >
                  🔄 Tamanho Original
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 mb-2">
                <button
                  onClick={() => updateElementStyle(selectedElement.id, 'objectFit', 'cover', editorState, setEditorState)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedElement.styles.objectFit === 'cover'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  🎯 Cobrir
                </button>
                
                <button
                  onClick={() => updateElementStyle(selectedElement.id, 'objectFit', 'contain', editorState, setEditorState)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedElement.styles.objectFit === 'contain'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  📦 Conter
                </button>
                
                <button
                  onClick={() => updateElementStyle(selectedElement.id, 'objectFit', 'fill', editorState, setEditorState)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    selectedElement.styles.objectFit === 'fill'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  🔧 Esticar
                </button>
              </div>

              <div className="text-xs text-purple-600">
                <div><strong>📏 100% da Div:</strong> Imagem ocupa toda a div</div>
                <div><strong>🎯 Cobrir:</strong> Mantém proporção, corta se necessário</div>
                <div><strong>📦 Conter:</strong> Mantém proporção, imagem inteira visível</div>
                <div><strong>🔧 Esticar:</strong> Distorce para preencher exatamente</div>
              </div>
            </div>
          )}

          {/* CONFIGURAÇÃO ESPECÍFICA PARA BOTÕES */}
          {selectedElement.type === 'button' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="text-xs font-medium text-blue-800 mb-2">🔘 Configurações de Botão</div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => {
                    updateElementStyle(selectedElement.id, 'padding', '12px 24px', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'borderRadius', '6px', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'backgroundColor', '#3b82f6', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'color', 'white', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'border', 'none', editorState, setEditorState);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  🔵 Estilo Primário
                </button>
                
                <button
                  onClick={() => {
                    updateElementStyle(selectedElement.id, 'padding', '12px 24px', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'borderRadius', '6px', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'backgroundColor', 'transparent', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'color', '#3b82f6', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'border', '1px solid #3b82f6', editorState, setEditorState);
                  }}
                  className="px-3 py-2 bg-white text-blue-600 border border-blue-600 rounded text-xs hover:bg-blue-50 transition-colors"
                >
                  ⚪ Estilo Secundário
                </button>
              </div>
              
              <div className="text-xs text-blue-600">
                <div><strong>🔵 Primário:</strong> Botão principal da página</div>
                <div><strong>⚪ Secundário:</strong> Botão com borda, sem fundo</div>
              </div>
            </div>
          )}

          {/* CONFIGURAÇÃO ESPECÍFICA PARA FORMULÁRIOS */}
          {['input', 'textarea', 'select'].includes(selectedElement.type || '') && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-xs font-medium text-green-800 mb-2">📝 Configurações de Formulário</div>
              
              <div className="grid grid-cols-1 gap-2 mb-2">
                <button
                  onClick={() => {
                    updateElementStyle(selectedElement.id, 'width', '100%', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'padding', '12px 16px', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'border', '1px solid #d1d5db', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'borderRadius', '6px', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'fontSize', '16px', editorState, setEditorState);
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                >
                  📝 Estilo Padrão de Formulário
                </button>
              </div>
              
              <div className="text-xs text-green-600">
                <div><strong>📝 Padrão:</strong> Campo de formulário bem formatado</div>
              </div>
            </div>
          )}

          {/* CONFIGURAÇÃO ESPECÍFICA PARA LISTAS */}
          {['list', 'listOrdered'].includes(selectedElement.type || '') && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
              <div className="text-xs font-medium text-orange-800 mb-2">📋 Gerenciar Itens da Lista</div>
              
              {/* Lista de itens atuais */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  ✏️ Itens da Lista
                </label>
                
                {selectedElement.children.map((child, index) => (
                  <div key={child.id} className="flex items-start gap-2 mb-2">
                    <textarea
                      value={child.content || `Item ${index + 1}`}
                      onChange={(e) => {
                        let content = e.target.value;
                        
                        // Corrige texto invertido
                        const correctText = (text: string) => {
                          const corrections = [
                            { from: 'etset', to: 'teste' },
                            { from: 'otxet', to: 'texto' },
                            { from: 'asac', to: 'casa' },
                            { from: 'emon', to: 'nome' },
                            { from: 'atsil', to: 'lista' }
                          ];
                          
                          let corrected = text;
                          corrections.forEach(({ from, to }) => {
                            corrected = corrected.replace(new RegExp(from, 'gi'), to);
                          });
                          
                          return corrected;
                        };
                        
                        updateElementProperty(child.id, 'content', correctText(content), editorState, setEditorState);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          
                          const textarea = e.target as HTMLTextAreaElement;
                          const cursorPos = textarea.selectionStart;
                          const textBefore = textarea.value.substring(0, cursorPos);
                          const textAfter = textarea.value.substring(cursorPos);
                          
                          const newContent = textBefore + '<br>' + textAfter;
                          
                          // Corrige texto invertido
                          const correctText = (text: string) => {
                            const corrections = [
                              { from: 'etset', to: 'teste' },
                              { from: 'otxet', to: 'texto' }
                            ];
                            let corrected = text;
                            corrections.forEach(({ from, to }) => {
                              corrected = corrected.replace(new RegExp(from, 'gi'), to);
                            });
                            return corrected;
                          };
                          
                          updateElementProperty(child.id, 'content', correctText(newContent), editorState, setEditorState);
                          
                          setTimeout(() => {
                            textarea.setSelectionRange(cursorPos + 4, cursorPos + 4);
                          }, 0);
                        }
                      }}
                      placeholder={`Item ${index + 1}`}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-900 resize-none text-left"
                      rows={2}
                      dir="ltr"
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                    <button
                      onClick={() => {
                        setEditorState(prev => ({
                          ...prev,
                          elements: removeElement(prev.elements, child.id)
                        }));
                      }}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition-colors"
                      title="Remover item"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                
                {selectedElement.children.length === 0 && (
                  <p className="text-xs text-gray-500 italic mb-2">Nenhum item na lista</p>
                )}
              </div>
              
              {/* Botões de ação */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    const newItem = {
                      id: `item-${Date.now()}`,
                      type: 'li',
                      tagName: 'li',
                      content: `Novo item ${selectedElement.children.length + 1}`,
                      styles: { margin: '8px 0' },
                      attributes: {},
                      children: [],
                      canHaveChildren: false,
                      isContainer: false,
                      events: {} as ElementEvents
                    };
                    setEditorState(prev => ({
                      ...prev,
                      elements: prev.elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, children: [...el.children, newItem] }
                          : { ...el, children: updateElementInChildren(el.children, selectedElement.id, { children: [...(findElementById(el.children, selectedElement.id)?.children || []), newItem] }) }
                      )
                    }));
                  }}
                  className="px-3 py-2 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 transition-colors"
                >
                  ➕ Adicionar Item
                </button>
                
                <button
                  onClick={() => {
                    const items = [
                      { content: 'Primeiro item da lista' },
                      { content: 'Segundo item da lista' }, 
                      { content: 'Terceiro item da lista' }
                    ];
                    const newChildren = items.map((item, index) => ({
                      id: `item-${Date.now()}-${index}`,
                      type: 'li',
                      tagName: 'li', 
                      content: item.content,
                      styles: { margin: '8px 0' },
                      attributes: {},
                      children: [],
                      canHaveChildren: false,
                      isContainer: false,
                      events: {} as ElementEvents
                    }));
                    setEditorState(prev => ({
                      ...prev,
                      elements: prev.elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, children: newChildren }
                          : { ...el, children: updateElementInChildren(el.children, selectedElement.id, { children: newChildren }) }
                      )
                    }));
                  }}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200 transition-colors"
                >
                  🔄 Lista de Exemplo (3 itens)
                </button>
              </div>
              
              <div className="mt-2 text-xs text-orange-600">
                <p><strong>💡 Como usar:</strong></p>
                <p>• Clique "Adicionar Item" para novos itens</p>
                <p>• Digite o texto diretamente nos campos</p>
                <p>• Use 🗑️ para remover itens</p>
              </div>
            </div>
          )}

          {/* CONFIGURAÇÃO ESPECÍFICA PARA FAQ */}
          {selectedElement.type === 'faqSection' && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
              <div className="text-xs font-medium text-purple-800 mb-2">❓ Gerenciar Perguntas FAQ</div>
              
              {/* Lista de perguntas atuais */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  📝 Perguntas e Respostas
                </label>
                
                {selectedElement.children.map((faqItem, index) => (
                  <div key={faqItem.id} className="mb-3 p-2 border border-purple-200 rounded bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-600">Pergunta {index + 1}</span>
                      <button
                        onClick={() => {
                          setEditorState(prev => ({
                            ...prev,
                            elements: removeElement(prev.elements, faqItem.id)
                          }));
                        }}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition-colors"
                        title="Remover pergunta"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <textarea
                      value={faqItem.children[0]?.content || `Pergunta ${index + 1}`}
                      onChange={(e) => {
                        if (faqItem.children[0]) {
                          let content = e.target.value;
                          // Corrige texto invertido
                          const corrections = [
                            { from: 'etset', to: 'teste' },
                            { from: 'otxet', to: 'texto' }
                          ];
                          let corrected = content;
                          corrections.forEach(({ from, to }) => {
                            corrected = corrected.replace(new RegExp(from, 'gi'), to);
                          });
                          updateElementProperty(faqItem.children[0].id, 'content', corrected, editorState, setEditorState);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && faqItem.children[0]) {
                          e.preventDefault();
                          
                          const textarea = e.target as HTMLTextAreaElement;
                          const cursorPos = textarea.selectionStart;
                          const textBefore = textarea.value.substring(0, cursorPos);
                          const textAfter = textarea.value.substring(cursorPos);
                          
                          const newContent = textBefore + '<br>' + textAfter;
                          updateElementProperty(faqItem.children[0].id, 'content', newContent, editorState, setEditorState);
                          
                          setTimeout(() => {
                            textarea.setSelectionRange(cursorPos + 4, cursorPos + 4);
                          }, 0);
                        }
                      }}
                      placeholder="Digite a pergunta aqui..."
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-900 resize-none mb-2 text-left"
                      rows={2}
                      dir="ltr"
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                    
                    <textarea
                      value={faqItem.children[1]?.content || `Resposta ${index + 1}`}
                      onChange={(e) => {
                        if (faqItem.children[1]) {
                          let content = e.target.value;
                          // Corrige texto invertido
                          const corrections = [
                            { from: 'etset', to: 'teste' },
                            { from: 'otxet', to: 'texto' }
                          ];
                          let corrected = content;
                          corrections.forEach(({ from, to }) => {
                            corrected = corrected.replace(new RegExp(from, 'gi'), to);
                          });
                          updateElementProperty(faqItem.children[1].id, 'content', corrected, editorState, setEditorState);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && faqItem.children[1]) {
                          e.preventDefault();
                          
                          const textarea = e.target as HTMLTextAreaElement;
                          const cursorPos = textarea.selectionStart;
                          const textBefore = textarea.value.substring(0, cursorPos);
                          const textAfter = textarea.value.substring(cursorPos);
                          
                          const newContent = textBefore + '<br>' + textAfter;
                          updateElementProperty(faqItem.children[1].id, 'content', newContent, editorState, setEditorState);
                          
                          setTimeout(() => {
                            textarea.setSelectionRange(cursorPos + 4, cursorPos + 4);
                          }, 0);
                        }
                      }}
                      placeholder="Digite a resposta aqui..."
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white text-gray-900 resize-none text-left"
                      rows={2}
                      dir="ltr"
                      style={{ textAlign: 'left', direction: 'ltr' }}
                    />
                  </div>
                ))}
                
                {selectedElement.children.length === 0 && (
                  <p className="text-xs text-gray-500 italic mb-2">Nenhuma pergunta adicionada</p>
                )}
              </div>
              
              {/* Botões de ação */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    const questionCount = selectedElement.children.length + 1;
                    const newFaqItem = {
                      id: `faq-${Date.now()}`,
                      type: 'div',
                      tagName: 'div',
                      content: '',
                      styles: { marginBottom: '20px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' },
                      attributes: {},
                      children: [
                        {
                          id: `faq-q-${Date.now()}`,
                          type: 'h4',
                          tagName: 'h4',
                          content: `Pergunta ${questionCount}?`,
                          styles: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' },
                          attributes: {},
                          children: [],
                          canHaveChildren: false,
                          isContainer: false,
                          events: {} as ElementEvents
                        },
                        {
                          id: `faq-a-${Date.now()}`,
                          type: 'p',
                          tagName: 'p',
                          content: `Resposta para a pergunta ${questionCount}.`,
                          styles: { fontSize: '16px', color: '#6b7280', lineHeight: '1.6' },
                          attributes: {},
                          children: [],
                          canHaveChildren: false,
                          isContainer: false,
                          events: {} as ElementEvents
                        }
                      ],
                      canHaveChildren: true,
                      isContainer: true,
                      events: {} as ElementEvents
                    };
                    setEditorState(prev => ({
                      ...prev,
                      elements: prev.elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, children: [...el.children, newFaqItem] }
                          : { ...el, children: updateElementInChildren(el.children, selectedElement.id, { children: [...(findElementById(el.children, selectedElement.id)?.children || []), newFaqItem] }) }
                      )
                    }));
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                >
                  ➕ Adicionar Pergunta
                </button>
                
                <button
                  onClick={() => {
                    const faqItems = [
                      { q: 'Como funciona o produto?', a: 'Nosso produto é fácil de usar e oferece recursos avançados.' },
                      { q: 'Qual é o prazo de entrega?', a: 'O prazo de entrega é de 3 a 5 dias úteis.' },
                      { q: 'Posso cancelar minha compra?', a: 'Sim, você pode cancelar em até 24 horas após a compra.' }
                    ];
                    const newFaqChildren = faqItems.map((item, index) => ({
                      id: `faq-${Date.now()}-${index}`,
                      type: 'div',
                      tagName: 'div',
                      content: '',
                      styles: { marginBottom: '20px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' },
                      attributes: {},
                      children: [
                        {
                          id: `faq-q-${Date.now()}-${index}`,
                          type: 'h4',
                          tagName: 'h4',
                          content: item.q,
                          styles: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' },
                          attributes: {},
                          children: [],
                          canHaveChildren: false,
                          isContainer: false,
                          events: {} as ElementEvents
                        },
                        {
                          id: `faq-a-${Date.now()}-${index}`,
                          type: 'p',
                          tagName: 'p',
                          content: item.a,
                          styles: { fontSize: '16px', color: '#6b7280', lineHeight: '1.6' },
                          attributes: {},
                          children: [],
                          canHaveChildren: false,
                          isContainer: false,
                          events: {} as ElementEvents
                        }
                      ],
                      canHaveChildren: true,
                      isContainer: true,
                      events: {} as ElementEvents
                    }));
                    setEditorState(prev => ({
                      ...prev,
                      elements: prev.elements.map(el => 
                        el.id === selectedElement.id 
                          ? { ...el, children: newFaqChildren }
                          : { ...el, children: updateElementInChildren(el.children, selectedElement.id, { children: newFaqChildren }) }
                      )
                    }));
                  }}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                >
                  🔄 FAQ de Exemplo (3 perguntas)
                </button>
              </div>
              
              <div className="mt-2 text-xs text-purple-600">
                <p><strong>💡 Como usar:</strong></p>
                <p>• Clique "Adicionar Pergunta" para novas perguntas</p>
                <p>• Edite diretamente nos campos</p>
                <p>• Use 🗑️ para remover perguntas</p>
              </div>
            </div>
          )}

          {/* CONFIGURAÇÃO ESPECÍFICA PARA LINKS */}
          {selectedElement.type === 'link' && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded">
              <div className="text-xs font-medium text-indigo-800 mb-2">🔗 Configurações de Link</div>
              
              {/* URL/HREF do Link */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  🌐 URL do Link (href)
                </label>
                <input
                  type="text"
                  value={selectedElement.attributes?.href || ''}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'attributes', { 
                    ...selectedElement.attributes, 
                    href: e.target.value 
                  }, editorState, setEditorState)}
                  placeholder="https://exemplo.com ou #secao ou mailto:email@exemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Use: URLs (https://...), âncoras (#secao), emails (mailto:...), telefones (tel:...)
                </p>
              </div>
              
              {/* Target do Link */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  🎯 Como Abrir o Link
                </label>
                <select
                  value={selectedElement.attributes?.target || '_self'}
                  onChange={(e) => updateElementProperty(selectedElement.id, 'attributes', { 
                    ...selectedElement.attributes, 
                    target: e.target.value 
                  }, editorState, setEditorState)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                >
                  <option value="_self" className="text-gray-900 bg-white">📄 Mesma aba</option>
                  <option value="_blank" className="text-gray-900 bg-white">🆕 Nova aba</option>
                  <option value="_parent" className="text-gray-900 bg-white">📤 Janela pai</option>
                  <option value="_top" className="text-gray-900 bg-white">🔝 Janela principal</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => {
                    updateElementStyle(selectedElement.id, 'color', '#3b82f6', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'textDecoration', 'underline', editorState, setEditorState);
                  }}
                  className="px-3 py-2 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors"
                >
                  🔗 Link Normal
                </button>
                
                <button
                  onClick={() => {
                    updateElementStyle(selectedElement.id, 'color', '#3b82f6', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'textDecoration', 'none', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'padding', '8px 16px', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'backgroundColor', '#eff6ff', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'borderRadius', '4px', editorState, setEditorState);
                  }}
                  className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded text-xs hover:bg-indigo-200 transition-colors"
                >
                  🔘 Link Botão
                </button>
              </div>
              
              <div className="text-xs text-indigo-600">
                <div><strong>🔗 Normal:</strong> Link azul tradicional</div>
                <div><strong>🔘 Botão:</strong> Link com aparência de botão</div>
              </div>
            </div>
          )}

          {/* Position */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Posicionamento</label>
            <select
              value={selectedElement.styles.position || 'static'}
              onChange={(e) => updateElementStyle(selectedElement.id, 'position', e.target.value, editorState, setEditorState)}
              className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
            >
              <option value="static">Estático</option>
              <option value="relative">Relativo</option>
              <option value="absolute">Absoluto</option>
              <option value="fixed">Fixo</option>
              <option value="sticky">Grudado</option>
            </select>
          </div>

          {/* Position Values (only show if position is not static) */}
          {selectedElement.styles.position && selectedElement.styles.position !== 'static' && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Top</label>
                <input
                  type="text"
                  value={selectedElement.styles.top || ''}
                  onChange={(e) => updateElementStyle(selectedElement.id, 'top', e.target.value, editorState, setEditorState)}
                  placeholder="0px, 10%"
                  className="w-full p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Right</label>
                <input
                  type="text"
                  value={selectedElement.styles.right || ''}
                  onChange={(e) => updateElementStyle(selectedElement.id, 'right', e.target.value, editorState, setEditorState)}
                  placeholder="0px, 10%"
                  className="w-full p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Bottom</label>
                <input
                  type="text"
                  value={selectedElement.styles.bottom || ''}
                  onChange={(e) => updateElementStyle(selectedElement.id, 'bottom', e.target.value, editorState, setEditorState)}
                  placeholder="0px, 10%"
                  className="w-full p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Left</label>
                <input
                  type="text"
                  value={selectedElement.styles.left || ''}
                  onChange={(e) => updateElementStyle(selectedElement.id, 'left', e.target.value, editorState, setEditorState)}
                  placeholder="0px, 10%"
                  className="w-full p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                />
              </div>
            </div>
          )}

          {/* Z-Index (only show if position is not static) */}
          {selectedElement.styles.position && selectedElement.styles.position !== 'static' && (
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Z-Index (Profundidade)</label>
              <input
                type="number"
                value={selectedElement.styles.zIndex || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'zIndex', e.target.value, editorState, setEditorState)}
                placeholder="1, 10, 100"
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
          )}
        </div>
        )}

        {/* Flexbox Controls (only show if display is flex) */}
        {selectedElement && selectedElement.styles.display === 'flex' && (() => {
          const elementType = selectedElement?.type;
          const shouldShowFlexbox = ['container', 'section', 'div', 'header', 'footer', 'nav', 'aside', 'article', 'main'].includes(elementType || '');
          return shouldShowFlexbox;
        })() && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Layout size={16} className="mr-2 text-blue-500" />
              🔄 Flexbox
            </h4>
            
            {/* Flex Direction */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-2 block">Direção</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'row', label: 'Linha →' },
                  { value: 'column', label: 'Coluna ↓' },
                  { value: 'row-reverse', label: 'Linha ←' },
                  { value: 'column-reverse', label: 'Coluna ↑' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'flexDirection', value, editorState, setEditorState)}
                    className={`p-2 text-xs rounded border transition-all ${
                      selectedElement.styles.flexDirection === value || (value === 'row' && !selectedElement.styles.flexDirection)
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Justify Content */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-2 block">Justificar Conteúdo</label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { value: 'flex-start', label: 'Início' },
                  { value: 'center', label: 'Centro' },
                  { value: 'flex-end', label: 'Final' },
                  { value: 'space-between', label: 'Entre' },
                  { value: 'space-around', label: 'Em volta' },
                  { value: 'space-evenly', label: 'Uniforme' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'justifyContent', value, editorState, setEditorState)}
                    className={`p-1 text-xs rounded border transition-all ${
                      selectedElement.styles.justifyContent === value
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Align Items */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-2 block">Alinhar Itens</label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { value: 'stretch', label: 'Esticar' },
                  { value: 'flex-start', label: 'Início' },
                  { value: 'center', label: 'Centro' },
                  { value: 'flex-end', label: 'Final' },
                  { value: 'baseline', label: 'Base' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'alignItems', value, editorState, setEditorState)}
                    className={`p-1 text-xs rounded border transition-all ${
                      selectedElement.styles.alignItems === value || (value === 'stretch' && !selectedElement.styles.alignItems)
                        ? 'bg-purple-500 text-white border-purple-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gap */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Espaçamento (Gap)</label>
              <input
                type="text"
                value={selectedElement.styles.gap || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'gap', e.target.value, editorState, setEditorState)}
                placeholder="10px, 1rem, 20px 10px"
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
          </div>
        )}

        {/* Grid Controls (only show if display is grid) */}
        {selectedElement && selectedElement.styles.display === 'grid' && (() => {
          const elementType = selectedElement?.type;
          const shouldShowGrid = ['container', 'section', 'div', 'header', 'footer', 'nav', 'aside', 'article', 'main'].includes(elementType || '');
          return shouldShowGrid;
        })() && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Grid3X3 size={16} className="mr-2 text-green-500" />
              🏗️ CSS Grid
            </h4>
            
            {/* Grid Template Columns */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-2 block">Template Columns (larguras das colunas)</label>
              <input
                type="text"
                value={selectedElement.styles.gridTemplateColumns || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'gridTemplateColumns', e.target.value, editorState, setEditorState)}
                placeholder="50% 50%, 1fr 1fr, 200px 1fr"
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white mb-2"
              />
              
              {/* Quick Grid Templates */}
              <div className="grid grid-cols-2 gap-1">
                {[
                  { value: '50% 50%', label: 'Meio a meio' },
                  { value: '1fr 1fr', label: '1fr 1fr (igual)' },
                  { value: '25% 75%', label: '1/4 e 3/4' },
                  { value: '33.33% 66.67%', label: '1/3 e 2/3' },
                  { value: '1fr 2fr', label: '1fr 2fr' },
                  { value: '1fr 1fr 1fr', label: '3 colunas' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateElementStyle(selectedElement.id, 'gridTemplateColumns', value, editorState, setEditorState)}
                    className={`p-1 text-xs rounded border transition-all ${
                      selectedElement.styles.gridTemplateColumns === value
                        ? 'bg-green-500 text-white border-green-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Template Rows */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-2 block">Template Rows (alturas das linhas)</label>
              <input
                type="text"
                value={selectedElement.styles.gridTemplateRows || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'gridTemplateRows', e.target.value, editorState, setEditorState)}
                placeholder="auto, 100px 200px, 1fr 2fr"
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>

            {/* Grid Gap */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Gap (espaçamento entre células)</label>
              <input
                type="text"
                value={selectedElement.styles.gridGap || selectedElement.styles.gap || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'gap', e.target.value, editorState, setEditorState)}
                placeholder="10px, 20px 10px"
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
            
            {/* Grid Quick Setup */}
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-xs font-medium text-green-800 mb-2">💡 Setup Rápido - Divs Lado a Lado:</div>
              <div className="text-xs text-green-700 mb-2">
                <strong>Para divs na MESMA LINHA (horizontal):</strong><br/>
                • Template Columns: define quantas colunas<br/>
                • Template Rows: use "1fr" ou "auto" (uma linha só)<br/>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // SOLUÇÃO 1: Grid com auto-placement forçado
                    updateElementStyle(selectedElement.id, 'gridTemplateColumns', '1fr 1fr', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'gridTemplateRows', 'auto', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'gridAutoFlow', 'column', editorState, setEditorState); // FORÇA FLUXO HORIZONTAL
                    updateElementStyle(selectedElement.id, 'gap', '20px', editorState, setEditorState);
                    
                    // Forçar posicionamento manual das divs filhas
                    setTimeout(() => {
                      const containerElement = document.querySelector(`[data-element-id="${selectedElement.id}"]`);
                      const childDivs = containerElement?.children;
                      
                      if (childDivs && childDivs.length >= 2) {
                        // Primeira div: coluna 1, linha 1
                        (childDivs[0] as HTMLElement).style.gridColumn = '1';
                        (childDivs[0] as HTMLElement).style.gridRow = '1';
                        
                        // Segunda div: coluna 2, linha 1
                        (childDivs[1] as HTMLElement).style.gridColumn = '2';
                        (childDivs[1] as HTMLElement).style.gridRow = '1';
                      }
                    }, 100);
                  }}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors font-medium"
                >
                  🚀 Duas Divs Lado a Lado (Método 1)
                </button>
                
                <button
                  onClick={() => {
                    // SOLUÇÃO 2: Voltar para Flexbox (mais confiável)
                    updateElementStyle(selectedElement.id, 'display', 'flex', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'flexDirection', 'row', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'gap', '20px', editorState, setEditorState);
                    
                    // Forçar largura das divs filhas
                    setTimeout(() => {
                      const containerElement = document.querySelector(`[data-element-id="${selectedElement.id}"]`);
                      const childDivs = containerElement?.children;
                      
                      if (childDivs && childDivs.length >= 2) {
                        (childDivs[0] as HTMLElement).style.flex = '1 1 50%';
                        (childDivs[0] as HTMLElement).style.width = '50%';
                        (childDivs[0] as HTMLElement).style.maxWidth = '50%';
                        
                        (childDivs[1] as HTMLElement).style.flex = '1 1 50%';
                        (childDivs[1] as HTMLElement).style.width = '50%';
                        (childDivs[1] as HTMLElement).style.maxWidth = '50%';
                      }
                    }, 100);
                  }}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors font-medium"
                >
                  💪 Usar Flexbox (Método 2 - Mais Confiável)
                </button>
                
                <button
                  onClick={() => {
                    // SOLUÇÃO 3: Grid com posicionamento explícito
                    updateElementStyle(selectedElement.id, 'gridTemplateColumns', 'repeat(2, 1fr)', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'gridTemplateRows', 'min-content', editorState, setEditorState);
                    updateElementStyle(selectedElement.id, 'gap', '20px', editorState, setEditorState);
                    
                    // Aplicar estilos nas divs filhas via CSS direto
                    const cssId = `grid-fix-${selectedElement.id}`;
                    let styleElement = document.getElementById(cssId) as HTMLStyleElement;
                    
                    if (!styleElement) {
                      styleElement = document.createElement('style');
                      styleElement.id = cssId;
                      document.head.appendChild(styleElement);
                    }
                    
                    styleElement.textContent = `
                      [data-element-id="${selectedElement.id}"] > *:nth-child(1) {
                        grid-column: 1 !important;
                        grid-row: 1 !important;
                      }
                      [data-element-id="${selectedElement.id}"] > *:nth-child(2) {
                        grid-column: 2 !important;
                        grid-row: 1 !important;
                      }
                      [data-element-id="${selectedElement.id}"] > *:nth-child(3) {
                        grid-column: 3 !important;
                        grid-row: 1 !important;
                      }
                    `;
                  }}
                  className="w-full px-3 py-2 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors font-medium"
                >
                  🎯 Grid com CSS Forçado (Método 3)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spacing Controls */}
        {selectedElement && (() => {
          const elementType = selectedElement?.type;
          const shouldShowSpacing = !['option'].includes(elementType || ''); // Quase todos exceto option
          return shouldShowSpacing;
        })() && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Layout size={16} className="mr-2 text-orange-500" />
            📏 Espaçamento
          </h4>
          
          {/* Container/Section Spacing Info */}
          {(selectedElement.type === 'container' || selectedElement.type === 'section') && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-yellow-600 mt-0.5">💡</div>
                <div>
                  <p className="text-xs text-yellow-800 font-medium mb-1">
                    Problema de Espaçamento Detectado
                  </p>
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    {selectedElement.type === 'container' 
                      ? 'Containers têm padding padrão. Use "Container Colado" para remover espaçamentos.'
                      : 'Seções têm padding padrão de 40px. Use "Zerar Padding" para colar elementos no topo.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Spacing Presets */}
          <div className="mb-4">
            <label className="text-xs text-gray-500 mb-2 block">⚡ Presets Rápidos</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => resetAllSpacing(selectedElement.id, editorState, setEditorState)}
                className="p-2 bg-red-50 text-red-600 border border-red-200 rounded text-xs hover:bg-red-100 transition-colors"
                title="Remove todos os espaçamentos (margin e padding = 0)"
              >
                🧹 Zerar Tudo
              </button>
              <button
                onClick={() => resetPadding(selectedElement.id, editorState, setEditorState)}
                className="p-2 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs hover:bg-blue-100 transition-colors"
                title="Remove apenas o padding interno"
              >
                📦 Zerar Padding
              </button>
              <button
                onClick={() => resetMargin(selectedElement.id, editorState, setEditorState)}
                className="p-2 bg-green-50 text-green-600 border border-green-200 rounded text-xs hover:bg-green-100 transition-colors"
                title="Remove apenas o margin externo"
              >
                🎯 Zerar Margin
              </button>
              <button
                onClick={() => setContainerTight(selectedElement.id, editorState, setEditorState)}
                className="p-2 bg-purple-50 text-purple-600 border border-purple-200 rounded text-xs hover:bg-purple-100 transition-colors"
                title="Configuração para container sem espaçamentos"
              >
                🔒 Container Colado
              </button>
            </div>
          </div>
          
          {/* Padding */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Padding (Interno)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={selectedElement.styles.padding || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'padding', e.target.value, editorState, setEditorState)}
                placeholder="Todos: 10px"
                className="col-span-2 p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.paddingTop || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'paddingTop', e.target.value, editorState, setEditorState)}
                placeholder="Cima: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.paddingBottom || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'paddingBottom', e.target.value, editorState, setEditorState)}
                placeholder="Baixo: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.paddingLeft || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'paddingLeft', e.target.value, editorState, setEditorState)}
                placeholder="Esquerda: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.paddingRight || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'paddingRight', e.target.value, editorState, setEditorState)}
                placeholder="Direita: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Margin */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-2 block">Margin (Externo)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={selectedElement.styles.margin || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'margin', e.target.value, editorState, setEditorState)}
                placeholder="Todos: 10px"
                className="col-span-2 p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.marginTop || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'marginTop', e.target.value, editorState, setEditorState)}
                placeholder="Cima: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.marginBottom || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'marginBottom', e.target.value, editorState, setEditorState)}
                placeholder="Baixo: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.marginLeft || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'marginLeft', e.target.value, editorState, setEditorState)}
                placeholder="Esquerda: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                value={selectedElement.styles.marginRight || ''}
                onChange={(e) => updateElementStyle(selectedElement.id, 'marginRight', e.target.value, editorState, setEditorState)}
                placeholder="Direita: 10px"
                className="p-1 border border-gray-300 rounded text-xs text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
        )}

        {/* Troubleshooting Guide */}
        {selectedElement && (() => {
          const elementType = selectedElement?.type;
          const shouldShowTroubleshooting = ['container', 'section', 'div'].includes(elementType || '');
          return shouldShowTroubleshooting;
        })() && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
            💡 Dicas para Largura Lado a Lado
          </h4>
          
          <div className="text-xs space-y-2 text-blue-700">
            <div className="bg-white p-2 rounded border border-blue-200">
              <div className="font-semibold mb-1">📋 Passo a passo:</div>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Selecione o <strong>container pai</strong></li>
                <li>Configure <strong>Display: flex</strong></li>
                <li>Configure <strong>Direção: Linha →</strong></li>
                <li>Adicione as divs filhas dentro</li>
                <li>Configure largura das filhas (ex: 50% cada)</li>
              </ol>
            </div>
            
            {selectedElement.styles.display !== 'flex' && (
              <div className="bg-yellow-100 p-2 rounded border border-yellow-300">
                <div className="font-semibold text-yellow-800">⚠️ Para elementos lado a lado:</div>
                <div className="text-yellow-700">O container pai precisa ter <strong>Display: flex</strong></div>
              </div>
            )}
            
            {selectedElement.styles.display === 'flex' && selectedElement.styles.flexDirection !== 'row' && selectedElement.styles.flexDirection !== undefined && (
              <div className="bg-orange-100 p-2 rounded border border-orange-300">
                <div className="font-semibold text-orange-800">📐 Direção Flexbox:</div>
                <div className="text-orange-700">Para lado a lado, use <strong>Direção: Linha →</strong></div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Troubleshooting Section for Percentage Width Issues */}
        {selectedElement && selectedElement.styles.width && selectedElement.styles.width.includes('%') && (() => {
          const elementType = selectedElement?.type;
          const shouldShowPercentageTrouble = !['option', 'span', 'strong', 'em'].includes(elementType || '');
          return shouldShowPercentageTrouble;
        })() && (
          <div className="p-4 border-b border-gray-200 bg-yellow-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Settings size={16} className="mr-2 text-yellow-600" />
              🚨 Solução para Porcentagem
            </h4>
            
            <div className="text-xs space-y-2">
              {(() => {
                const parentElement = findParentElement();
                return (
                  <div>
                    <div className="font-medium text-yellow-800 mb-2">
                      Status da Largura {selectedElement.styles.width}:
                    </div>
                    
                    {!parentElement ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-red-600">❌</span>
                          <span className="text-red-700">Elemento no nível raiz - porcentagem pode não funcionar</span>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <strong>Solução:</strong> Use valores em px (ex: 300px) ou coloque dentro de um container com largura definida.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-green-600">✅</span>
                          <span className="text-green-700">Tem elemento pai: {parentElement.type}</span>
                        </div>
                        
                        {!parentElement.styles.width ? (
                          <div className="bg-orange-100 p-2 rounded border border-orange-300">
                            <div className="font-medium text-orange-800">⚠️ Elemento pai sem largura definida</div>
                            <div className="text-orange-700 mt-1">
                              <strong>Solução:</strong>
                              <button
                                onClick={() => updateElementStyle(parentElement.id, 'width', '100%', editorState, setEditorState)}
                                className="ml-1 px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600"
                              >
                                Definir largura do pai como 100%
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-green-100 p-2 rounded border border-green-300">
                            <div className="text-green-700">
                              ✅ Pai tem largura: {parentElement.styles.width}
                              <br />
                              Sua largura será: {selectedElement.styles.width} de {parentElement.styles.width}
                            </div>
                          </div>
                        )}
                        
                        {parentElement.styles.display === 'flex' && (
                          <div className="bg-blue-100 p-2 rounded border border-blue-300">
                            <div className="text-blue-700">
                              🔄 Pai é Flexbox - usando flex-basis para melhor compatibilidade
                            </div>
                            {(!parentElement.styles.flexDirection || parentElement.styles.flexDirection === 'row') && (
                              <div className="mt-2 bg-yellow-100 border border-yellow-300 rounded p-2">
                                <div className="text-yellow-800 font-medium text-xs">⚠️ PROBLEMA DETECTADO: Flexbox Row + Porcentagem</div>
                                <div className="text-yellow-700 text-xs mt-1">
                                  Em flex-direction: row, porcentagens podem não funcionar por causa do algoritmo de cálculo do flexbox.
                                </div>
                                <div className="mt-1 text-xs text-yellow-600 font-medium">
                                  📱 Escolha uma solução RESPONSIVA:
                                </div>
                                <div className="mt-2 space-y-1">
                                  <button
                                    onClick={() => {
                                      // Solução 1: Usar pixel calculado (NÃO RESPONSIVO)
                                      const parentWidth = document.querySelector(`[data-element-id="${parentElement.id}"]`)?.getBoundingClientRect().width || 0;
                                      const percentValue = parseFloat(selectedElement.styles.width!) / 100;
                                      const pixelWidth = Math.floor(parentWidth * percentValue);
                                      updateElementStyle(selectedElement.id, 'width', `${pixelWidth}px`, editorState, setEditorState);
                                    }}
                                    className="w-full px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600"
                                  >
                                    ⚠️ Converter para Pixels (NÃO responsivo)
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Solução 2: Usar CSS Grid (RESPONSIVO)
                                      updateElementStyle(parentElement.id, 'display', 'grid', editorState, setEditorState);
                                      const percentValue = parseFloat(selectedElement.styles.width!);
                                      const remainingPercent = 100 - percentValue;
                                      updateElementStyle(parentElement.id, 'gridTemplateColumns', `${percentValue}% ${remainingPercent}%`, editorState, setEditorState);
                                      updateElementStyle(selectedElement.id, 'width', 'auto', editorState, setEditorState);
                                    }}
                                    className="w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                  >
                                    ✅ Mudar Pai para Grid (responsivo)
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Solução 3: Usar vw (viewport width) - RESPONSIVO
                                      const currentPercent = parseFloat(selectedElement.styles.width!);
                                      updateElementStyle(selectedElement.id, 'width', `${currentPercent}vw`, editorState, setEditorState);
                                    }}
                                    className="w-full px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                  >
                                    🌐 Usar vw (responsivo global)
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Solução 4: Forçar flex com calc() - RESPONSIVO
                                      updateElementStyle(selectedElement.id, 'width', `calc(${selectedElement.styles.width!})`, editorState, setEditorState);
                                      updateElementStyle(selectedElement.id, 'flexShrink', '0', editorState, setEditorState);
                                      updateElementStyle(selectedElement.id, 'flexGrow', '0', editorState, setEditorState);
                                      updateElementStyle(selectedElement.id, 'minWidth', `calc(${selectedElement.styles.width!})`, editorState, setEditorState);
                                    }}
                                    className="w-full px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                                  >
                                    🧮 Usar calc() (responsivo)
                                  </button>
                                  
                                  <div className="mt-2 p-2 bg-gray-50 rounded border text-xs">
                                    <div className="font-medium text-gray-700 mb-1">📋 Qual escolher?</div>
                                    <div className="space-y-1 text-gray-600">
                                      <div><strong>Grid:</strong> Melhor para layouts lado a lado</div>
                                      <div><strong>vw:</strong> Porcentagem da tela toda</div>
                                      <div><strong>calc():</strong> Força o cálculo matemático</div>
                                      <div><strong className="text-orange-600">Pixels:</strong> Só para tamanho fixo (não responsivo)</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Debug Section - Shows current styles applied */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Settings size={16} className="mr-2 text-gray-500" />
            🔍 Debug - Estilos Aplicados
          </h4>
          
          <div className="text-xs space-y-1">
            {selectedElement.styles.width && (
              <div className="flex justify-between">
                <span className="text-gray-600">Largura:</span>
                <span className="font-mono bg-white px-1 rounded border border-green-300 text-green-700">{selectedElement.styles.width}</span>
              </div>
            )}
            {selectedElement.styles.height && (
              <div className="flex justify-between">
                <span className="text-gray-600">Altura:</span>
                <span className="font-mono bg-white px-1 rounded border border-green-300 text-green-700">{selectedElement.styles.height}</span>
              </div>
            )}
            {selectedElement.styles.display && (
              <div className="flex justify-between">
                <span className="text-gray-600">Display:</span>
                <span className={`font-mono bg-white px-1 rounded border ${
                  selectedElement.styles.display === 'flex' 
                    ? 'border-green-300 text-green-700' 
                    : 'border-gray-300 text-gray-700'
                }`}>
                  {selectedElement.styles.display}
                </span>
              </div>
            )}
            {selectedElement.styles.flexDirection && (
              <div className="flex justify-between">
                <span className="text-gray-600">Flex Direction:</span>
                <span className="font-mono bg-white px-1 rounded border border-green-300 text-green-700">{selectedElement.styles.flexDirection}</span>
              </div>
            )}
            {selectedElement.styles.flexBasis && (
              <div className="flex justify-between">
                <span className="text-gray-600">Flex Basis:</span>
                <span className="font-mono bg-white px-1 rounded border border-purple-300 text-purple-700">{selectedElement.styles.flexBasis}</span>
              </div>
            )}
            
            <div className="mt-3 p-2 bg-gray-100 rounded">
              <button
                onClick={() => {
                  const element = document.querySelector(`[data-element-id="${selectedElement.id}"]`);
                  if (element) {
                    const computedStyle = window.getComputedStyle(element);
                    const actualWidth = computedStyle.width;
                    const actualFlexBasis = computedStyle.flexBasis;
                    const actualFlexShrink = computedStyle.flexShrink;
                    
                    console.log('Debug Element:', {
                      element,
                      styles: selectedElement.styles,
                      computed: {
                        width: actualWidth,
                        flexBasis: actualFlexBasis,
                        flexShrink: actualFlexShrink,
                        display: computedStyle.display,
                        boxSizing: computedStyle.boxSizing
                      }
                    });
                    
                    alert(`🔍 DEBUG - Elemento ${selectedElement.type}:

📋 ESTILOS DEFINIDOS:
- Largura: ${selectedElement.styles.width || 'não definida'}
- Display: ${selectedElement.styles.display || 'padrão'}
- Flex-basis: ${selectedElement.styles.flexBasis || 'não definida'}

🖥️ VALORES REAIS NO NAVEGADOR:
- Largura computada: ${actualWidth}
- Flex-basis: ${actualFlexBasis}
- Flex-shrink: ${actualFlexShrink}
- Display: ${computedStyle.display}
- Box-sizing: ${computedStyle.boxSizing}

📊 ANÁLISE:
${actualWidth === selectedElement.styles.width ? '✅ Largura aplicada corretamente' : '❌ Largura não aplicada - verifique CSS conflitante'}

Veja o console para mais detalhes.`);
                  } else {
                    alert('❌ Elemento não encontrado no DOM!');
                  }
                }}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors font-medium"
              >
                🔍 Inspecionar no Navegador
              </button>
              <div className="text-xs text-gray-500 mt-1 text-center">
                Verifica os valores reais aplicados no DOM
              </div>
              
              <button
                onClick={() => {
                  const element = document.querySelector(`[data-element-id="${selectedElement.id}"]`) as HTMLElement;
                  const parentElement = element?.parentElement;
                  
                  if (element && selectedElement.styles.width) {
                    console.log('Forçando aplicação para:', {
                      element,
                      parentElement,
                      isFlexRow: parentElement && window.getComputedStyle(parentElement).display === 'flex' && 
                                (window.getComputedStyle(parentElement).flexDirection === 'row' || 
                                 !window.getComputedStyle(parentElement).flexDirection),
                      desiredWidth: selectedElement.styles.width
                    });
                    
                    // Aplicação específica para flexbox row
                    if (selectedElement.styles.width.includes('%')) {
                      // Método 1: Propriedades flex específicas
                      element.style.width = selectedElement.styles.width;
                      element.style.minWidth = selectedElement.styles.width;
                      element.style.maxWidth = selectedElement.styles.width;
                      element.style.flex = `0 0 ${selectedElement.styles.width}`;
                      element.style.flexBasis = selectedElement.styles.width;
                      element.style.flexShrink = '0';
                      element.style.flexGrow = '0';
                      element.style.boxSizing = 'border-box';
                      
                      // Método 2: Se ainda não funcionar, usar calc()
                      if (parentElement) {
                        const parentWidth = parentElement.getBoundingClientRect().width;
                        const percentValue = parseFloat(selectedElement.styles.width) / 100;
                        const calculatedWidth = parentWidth * percentValue;
                        element.style.width = `${calculatedWidth}px`;
                        element.style.minWidth = `${calculatedWidth}px`;
                      }
                    } else {
                      element.style.width = selectedElement.styles.width;
                      element.style.boxSizing = 'border-box';
                    }
                    
                    // Força re-render
                    element.style.display = 'none';
                    element.offsetHeight; // trigger reflow
                    element.style.display = '';
                    
                    // Verificação final
                    setTimeout(() => {
                      const finalWidth = window.getComputedStyle(element).width;
                      console.log('Largura final aplicada:', finalWidth);
                      alert(`✅ Estilos forçados aplicados!
                      
Largura desejada: ${selectedElement.styles.width}
Largura computada: ${finalWidth}

${finalWidth === selectedElement.styles.width ? '✅ Sucesso!' : '⚠️ Pode haver CSS conflitante ainda'}`);
                    }, 100);
                    
                  } else {
                    alert('❌ Elemento não encontrado ou sem largura definida');
                  }
                }}
                className="w-full mt-2 px-3 py-2 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors font-medium"
              >
                🚀 Forçar Aplicação (Flexbox Fix)
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// Utility functions
const findElementById = (elements: PageElement[], id: string | null): PageElement | null => {
  if (!id) return null;
  
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }
    if (element.children) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }
  }
  return null;
};

const updateElementInChildren = (elements: PageElement[], targetId: string, updates: Partial<PageElement>): PageElement[] => {
  return elements.map(element => {
    if (element.id === targetId) {
      return { ...element, ...updates };
    }
    if (element.children) {
      return {
        ...element,
        children: updateElementInChildren(element.children, targetId, updates)
      };
    }
    return element;
  });
};

// Spacing Preset Functions
const resetAllSpacing = (elementId: string, editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  setEditorState(prev => {
    const updateInElements = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            styles: {
              ...el.styles,
              margin: '0',
              marginTop: '0',
              marginBottom: '0',
              marginLeft: '0',
              marginRight: '0',
              padding: '0',
              paddingTop: '0',
              paddingBottom: '0',
              paddingLeft: '0',
              paddingRight: '0'
            }
          };
        }
        if (el.children) {
          return { ...el, children: updateInElements(el.children) };
        }
        return el;
      });
    };
    return { ...prev, elements: updateInElements(prev.elements) };
  });
};

const resetPadding = (elementId: string, editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  setEditorState(prev => {
    const updateInElements = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            styles: {
              ...el.styles,
              padding: '0',
              paddingTop: '0',
              paddingBottom: '0',
              paddingLeft: '0',
              paddingRight: '0'
            }
          };
        }
        if (el.children) {
          return { ...el, children: updateInElements(el.children) };
        }
        return el;
      });
    };
    return { ...prev, elements: updateInElements(prev.elements) };
  });
};

const resetMargin = (elementId: string, editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  setEditorState(prev => {
    const updateInElements = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            styles: {
              ...el.styles,
              margin: '0',
              marginTop: '0',
              marginBottom: '0',
              marginLeft: '0',
              marginRight: '0'
            }
          };
        }
        if (el.children) {
          return { ...el, children: updateInElements(el.children) };
        }
        return el;
      });
    };
    return { ...prev, elements: updateInElements(prev.elements) };
  });
};

const setContainerTight = (elementId: string, editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  setEditorState(prev => {
    const updateInElements = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            styles: {
              ...el.styles,
              margin: '0',
              padding: '0',
              position: 'relative',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0'
            }
          };
        }
        if (el.children) {
          return { ...el, children: updateInElements(el.children) };
        }
        return el;
      });
    };
    return { ...prev, elements: updateInElements(prev.elements) };
  });
};

const updateElementStyle = (elementId: string, property: string, value: string, editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>): void => {
  setEditorState(prev => {
    const updateInElements = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          const newStyles = { ...el.styles };
          
          // Aplicar a propriedade principal
          if (value.trim() === '') {
            delete newStyles[property as keyof typeof newStyles];
          } else {
            if (property === 'flexGrow' || property === 'flexShrink') {
              // Para propriedades numéricas, converter string para número
              (newStyles as any)[property] = parseFloat(value) || 0;
            } else {
              (newStyles as any)[property] = value;
            }
          }
          
          // CORREÇÃO PRINCIPAL: Quando user define display: flex, aplicar configuração completa
          if (property === 'display' && value === 'flex') {
            // Configuração padrão para flexbox que funciona
            newStyles.display = 'flex';
            // Se não tem flexDirection definida, assumir row (lado a lado)
            if (!newStyles.flexDirection) {
              newStyles.flexDirection = 'row';
            }
            // Garantir alinhamento padrão
            if (!newStyles.alignItems) {
              newStyles.alignItems = 'flex-start';
            }
            if (!newStyles.justifyContent) {
              newStyles.justifyContent = 'flex-start';
            }
            // Garantir box-sizing
            newStyles.boxSizing = 'border-box';
            // Largura total
            if (!newStyles.width) {
              newStyles.width = '100%';
            }
            
            console.log('✅ Display Flex aplicado com configuração automática:', {
              display: newStyles.display,
              flexDirection: newStyles.flexDirection,
              alignItems: newStyles.alignItems,
              justifyContent: newStyles.justifyContent
            });
          }
          
          // CORREÇÃO: Quando user define flexDirection: row, otimizar para layout horizontal
          if (property === 'flexDirection' && value === 'row') {
            newStyles.flexDirection = 'row';
            // Forçar display flex se não estiver definido
            if (!newStyles.display || newStyles.display !== 'flex') {
              newStyles.display = 'flex';
            }
            // Otimizar para layout horizontal
            newStyles.alignItems = 'flex-start';
            newStyles.justifyContent = 'flex-start';
            newStyles.boxSizing = 'border-box';
            
            console.log('✅ Flex Direction Row otimizado para layout horizontal');
          }
          
          // Para largura e altura, garantir que funcionem bem com flexbox e porcentagens
          if (property === 'width') {
            if (value && value !== 'auto') {
              // Para porcentagens em flexbox row, usar uma abordagem diferente
              if (value.includes('%')) {
                // CORREÇÃO: Em flexbox, usar FLEX ao invés de width puro
                // MAS manter o valor original visível no input
                newStyles.width = value; // Manter para mostrar no input
                
                // Usar flex: 0 0 [porcentagem] que é a forma correta no flexbox
                newStyles.flexShrink = 0;
                newStyles.flexGrow = 0;
                newStyles.flexBasis = value;
                newStyles.boxSizing = 'border-box';
                
                // Guardar a porcentagem original para o CSS forçado
                (newStyles as any).originalWidth = value;
                
                console.log(`🎯 PORCENTAGEM FLEXBOX: Elemento ${elementId} → Flex: 0 0 ${value}`, {
                  flexBasis: value,
                  flexGrow: 0,
                  flexShrink: 0,
                  width: value, // Mantido para input
                  originalWidth: value,
                  approach: 'flex-basis-with-width-display'
                });
                
                // Forçar re-render do componente para aplicar CSS dinâmico
                setTimeout(() => {
                  const element = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
                  if (element) {
                    // Verificar se o pai é flexbox
                    const parent = element.parentElement;
                    const parentDisplay = parent ? window.getComputedStyle(parent).display : 'none';
                    
                    console.log('🔍 Verificação DOM após aplicar largura:', {
                      element,
                      parentDisplay,
                      computedWidth: window.getComputedStyle(element).width,
                      computedFlexBasis: window.getComputedStyle(element).flexBasis,
                      computedFlex: window.getComputedStyle(element).flex,
                      isFlexChild: parentDisplay === 'flex'
                    });
                  }
                }, 100);
                
              } else if (value.includes('px') || value.includes('rem') || value.includes('em')) {
                // Para valores absolutos
                newStyles.flexShrink = 0;
                newStyles.flexBasis = value;
                newStyles.boxSizing = 'border-box';
                newStyles.width = value; // Para valores absolutos, pode manter width
                delete (newStyles as any).originalWidth; // Não precisa de originalWidth
                
                console.log(`✅ Largura ${value} configurada com flex-basis para valor absoluto`);
              }
            } else {
              // Se width é auto, permitir que flex funcione normalmente
              delete newStyles.flexShrink;
              delete newStyles.flexGrow;
              delete newStyles.flexBasis;
              delete newStyles.minWidth;
              delete newStyles.width;
              delete (newStyles as any).originalWidth;
              
              console.log('🔄 Largura removida, voltando para flex padrão');
            }
          }
          
          if (property === 'height') {
            // Para altura, garantir que min-height seja respeitado
            if (value && value !== 'auto') {
              newStyles.minHeight = value;
            } else {
              delete newStyles.minHeight;
            }
          }
          
          return {
            ...el,
            styles: newStyles
          };
        }
        if (el.children) {
          return {
            ...el,
            children: updateInElements(el.children)
          };
        }
        return el;
      });
    };

    return {
      ...prev,
      elements: updateInElements(prev.elements)
    };
  });
};

const deleteElement = (
  elementId: string,
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  setEditorState(prev => {
    const deleteFromElements = (elements: PageElement[]): PageElement[] => {
      return elements.reduce((acc: PageElement[], el) => {
        if (el.id === elementId) {
          return acc; // Remove this element
        } else if (el.children.length > 0) {
          return [...acc, { ...el, children: deleteFromElements(el.children) }];
        }
        return [...acc, el];
      }, []);
    };
    
    return {
      ...prev,
      elements: deleteFromElements(prev.elements),
      selectedElementId: prev.selectedElementId === elementId ? null : prev.selectedElementId
    };
  });
};

const updateElementProperty = (
  elementId: string,
  property: keyof PageElement,
  value: any,
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  setEditorState(prev => {
    const updateElement = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return { ...el, [property]: value };
        } else if (el.children.length > 0) {
          return { ...el, children: updateElement(el.children) };
        }
        return el;
      });
    };
    
    return {
      ...prev,
      elements: updateElement(prev.elements)
    };
  });
};

const updateElementAttribute = (
  elementId: string,
  attributeName: keyof ElementAttributes,
  value: any,
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  setEditorState(prev => {
    const updateElement = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            attributes: {
              ...el.attributes,
              [attributeName]: value
            }
          };
        } else if (el.children.length > 0) {
          return { ...el, children: updateElement(el.children) };
        }
        return el;
      });
    };
    
    return {
      ...prev,
      elements: updateElement(prev.elements)
    };
  });
};

const updateElementContent = (elementId: string, content: string, editorState: EditorState, setEditorState: React.Dispatch<React.SetStateAction<EditorState>>): void => {
  setEditorState(prev => {
    const updateInElements = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            content: content
          };
        }
        if (el.children) {
          return {
            ...el,
            children: updateInElements(el.children)
          };
        }
        return el;
      });
    };

    return {
      ...prev,
      elements: updateInElements(prev.elements)
    };
  });
};

const updateElementEvent = (
  elementId: string,
  eventName: keyof ElementEvents,
  value: string,
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
) => {
  setEditorState(prev => {
    const updateElement = (elements: PageElement[]): PageElement[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return {
            ...el,
            events: {
              ...el.events,
              [eventName]: value
            }
          };
        } else if (el.children.length > 0) {
          return { ...el, children: updateElement(el.children) };
        }
        return el;
      });
    };
    
    return {
      ...prev,
      elements: updateElement(prev.elements)
    };
  });
};

export default PageEditor;