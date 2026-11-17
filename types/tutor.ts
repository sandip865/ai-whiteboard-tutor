export type ActionType =
  | 'clear'
  | 'draw_rect'
  | 'draw_circle'
  | 'draw_arrow'
  | 'draw_text'
  | 'draw_path'
  | 'highlight'
  | 'laser_pointer'
  | 'sticky_note'
  | 'card'
  | 'formula';

export interface Point {
  x: number;
  y: number;
}

export interface WhiteboardAction {
  id: string;
  type: ActionType;
  /** Relative time in seconds from beat start */
  timeOffset: number;
  /** Absolute time in seconds across whole lesson */
  absoluteTime?: number;
  // Spatial
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  toX?: number;
  toY?: number;
  points?: Point[];
  // Styling
  color?: string;
  fill?: string;
  strokeWidth?: number;
  text?: string;
  subtitle?: string;
  fontSize?: number;
  fontWeight?: string;
  dashed?: boolean;
  opacity?: number;
  badge?: string;
  icon?: string;
  // Animation
  animDuration?: number; // duration in seconds for drawing animation
}

export interface LessonBeat {
  id: string;
  beatIndex: number;
  title: string;
  summary: string;
  narration: string;
  duration: number; // in seconds
  startTime: number; // in seconds from lesson start
  actions: WhiteboardAction[];
  keyConcept: string;
}

export interface LessonPlan {
  id: string;
  topic: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  overview: string;
  totalDuration: number; // approximately 120 seconds
  beats: LessonBeat[];
  suggestedQuestions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  audioSpoken?: boolean;
  whiteboardAnnotation?: WhiteboardAction[];
  suggestedAction?: string;
}

export type WhiteboardTheme = 'blueprint' | 'dark' | 'clean' | 'chalkboard';

export interface UserDrawingStroke {
  id: string;
  tool: 'pen' | 'highlighter' | 'eraser';
  color: string;
  size: number;
  points: Point[];
}
