import { Node, Edge } from 'reactflow';

// Base node data interface
export interface NodeData {
    label?: string;
    onChangeLabel?: (newLabel: string) => void;
    name?: string;
    value?: string;
    variableType?: string;
    onChangeName?: (newName: string) => void;
    onChangeValue?: (newValue: string) => void;
    onChangeType?: (newType: string) => void;
    code?: string;
    onChangeCode?: (newCode: string) => void;
    functionName?: string;
    onChangeFunctionName?: (newFn: string) => void;
    text?: string;
    onChangeText?: (newText: string) => void;
    bgColor?: string;
    onChangeBgColor?: (newColor: string) => void;
    url?: string;
    onChangeUrl?: (newUrl: string) => void;
    selected?: string;
    options?: string[];
    onChangeSelected?: (newSel: string) => void;
    branch?: string;
}

// Custom node type that extends ReactFlow's Node
export type MyNode = Node<NodeData>;

// Custom edge data interface
export interface EdgeData {
    branch?: string;
}

// Custom edge type that extends ReactFlow's Edge
export type MyEdge = Edge<EdgeData>;