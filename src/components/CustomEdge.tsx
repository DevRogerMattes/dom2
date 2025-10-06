import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps,
} from '@xyflow/react';
import { X, Unlink } from 'lucide-react';
import { Button } from './ui/button';

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const { setEdges } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-auto"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button
            size="sm"
            variant="destructive"
            className="w-6 h-6 p-0 rounded-full shadow-lg border-2 border-white bg-red-500 hover:bg-red-600 text-white"
            onClick={onEdgeClick}
            title="Desconectar"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};