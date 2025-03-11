// types.d.ts o types.ts
import { Node, Edge, Position } from 'reactflow';

/** Datos que cada nodo puede tener */
export interface NodeData {
    /** Texto principal del nodo */
    label?: string;
    /** Función para cambiar el label */
    onChangeLabel?: (newLabel: string) => void;

    /** Solo para variables */
    name?: string;
    value?: string;
    variableType?: string;
    onChangeName?: (newName: string) => void;
    onChangeValue?: (newValue: string) => void;
    onChangeType?: (newType: string) => void;
}

/** Datos adicionales que puede tener un edge */
export interface EdgeData {
    branch?: string; // Para condicionales, ciclos, etc.
}

/** Tipos concretos de nodos y edges */
export type MyNode = Node<NodeData>;
export type MyEdge = Edge<EdgeData>;
