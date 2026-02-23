"use client";

import ReactFlow, { MarkerType, Position } from "reactflow";
import type { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";

import { motion, useTransform, MotionValue } from "framer-motion";

type Props = {
  scroll: MotionValue<number>;
};

/* ---------------------------
   Visual tuning
--------------------------- */

const nodeStyle = {
  width: 110,
  height: 110,
  borderRadius: "50%",
  background: "rgba(37,99,235,0.06)",
  border: "1.5px solid rgba(37,99,235,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  color: "#1e3a8a",
  fontSize: 14,
  boxShadow: "0 8px 24px rgba(37,99,235,0.08)",
};

/* ---------------------------
   LEFT GRAPH (FLOW)
--------------------------- */

const nodes: Node[] = [
  {
    id: "supplier",
    position: { x: 80, y: 140 },
    data: { label: "Supplier" },
    targetPosition: Position.Right,
    style: nodeStyle,
  },
  {
    id: "product",
    position: { x: 260, y: 300 },
    data: { label: "Product" },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
    style: nodeStyle,
  },
  {
    id: "market",
    position: { x: 80, y: 480 },
    data: { label: "Market" },
    targetPosition: Position.Right,
    sourcePosition: Position.Right,
    style: nodeStyle,
  },
  {
    id: "region",
    position: { x: 260, y: 650 },
    data: { label: "Region" },
    targetPosition: Position.Left,
    style: nodeStyle,
  },
];

const edges: Edge[] = [
  {
    id: "e1",
    source: "product",
    target: "supplier",
    label: "supplied_by",
    type: "bezier",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: "rgba(100,116,139,0.55)",
    },
    style: {
      strokeWidth: 1.6,
      stroke: "rgba(100,116,139,0.55)",
    },
    labelStyle: {
      fontSize: 11,
      fill: "#94a3b8",
      fontWeight: 500,
    },
  },
  {
    id: "e2",
    source: "product",
    target: "market",
    label: "sold_in",
    type: "bezier",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: "rgba(100,116,139,0.55)",
    },
    style: {
      strokeWidth: 1.6,
      stroke: "rgba(100,116,139,0.55)",
    },
    labelStyle: {
      fontSize: 11,
      fill: "#94a3b8",
      fontWeight: 500,
    },
  },
  {
    id: "e3",
    source: "market",
    target: "region",
    label: "located_in",
    type: "bezier",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: "rgba(100,116,139,0.55)",
    },
    style: {
      strokeWidth: 1.6,
      stroke: "rgba(100,116,139,0.55)",
    },
    labelStyle: {
      fontSize: 11,
      fill: "#94a3b8",
      fontWeight: 500,
    },
  },
];

export default function GraphFlowLayer({ scroll }: Props) {
  const opacity = useTransform(scroll, [0.52, 0.60], [0, 1]);
  const scale = useTransform(scroll, [0.52, 0.60], [0.96, 1]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "40%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        scale,
        zIndex: 0,
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        fitView={false}
        proOptions={{ hideAttribution: true }}
      />
    </motion.div>
  );
}