// src/types.ts
import { Node, Edge } from 'reactflow';

/** Datos personalizados para cada nodo */
export interface NodeData {
    label?: string;
    onChangeLabel?: (newLabel: string) => void;
    name?: string;
    value?: string;
    variableType?: string;
    onChangeName?: (newName: string) => void;
    onChangeValue?: (newValue: string) => void;
    onChangeType?: (newType: string) => void;
}

/** Datos adicionales que pueden tener las conexiones */
export interface EdgeData {
    branch?: string;
}

/** Tipos específicos de nodos y conexiones */
export type MyNode = Node<NodeData>;
export type MyEdge = Edge<EdgeData>;
