import React, { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    Connection,
    NodeChange,
    EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { invoke } from '@tauri-apps/api/tauri';
import BlockPalette from './BlockPalette';
import {
    ProcessNode,
    ConditionalNode,
    CycleStartNode,
    CycleEndNode,
    IONode,
    FunctionNode,
    VariableNode,
} from './CustomNodes';
import CustomEdge from './CustomEdge';
import { MyNode, MyEdge } from './types';

const nodeTypes = {
    process: ProcessNode,
    conditional: ConditionalNode,
    cycle_start: CycleStartNode,
    cycle_end: CycleEndNode,
    io: IONode,
    function: FunctionNode,
    variable: VariableNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

const initialNodes: MyNode[] = [
    {
        id: '1',
        type: 'process',
        data: { label: 'Inicio' },
        position: { x: 250, y: 0 },
    },
];
const initialEdges: MyEdge[] = [];

interface DiagramEditorProps {
    projectPath: string | null;
    isNew?: boolean;
    onBackToProject: () => void;
}

function DiagramEditor({ projectPath, isNew = false, onBackToProject }: DiagramEditorProps) {
    const [nodes, setNodes] = useState<MyNode[]>(initialNodes);
    const [edges, setEdges] = useState<MyEdge[]>(initialEdges);
    const containerRef = useRef<HTMLDivElement>(null);



    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            // Ejemplo: si el nodo de origen es 'cycle_start', elimina su edge con 'cycle_end'
            const sourceNode = nodes.find((n) => n.id === connection.source);
            if (sourceNode && sourceNode.type === 'cycle_start') {
                const existingEdge = edges.find((edge) => {
                    if (edge.source === sourceNode.id) {
                        const targetNode = nodes.find((nd) => nd.id === edge.target);
                        return targetNode?.type === 'cycle_end';
                    }
                    return false;
                });
                if (existingEdge) {
                    setEdges((eds) => eds.filter((e) => e.id !== existingEdge.id));
                }
            }

            // Create a new edge object with the properties we need
            const newEdge: MyEdge = {
                ...connection as any,
                type: 'custom',
                data: {} as any
            };

            if (connection.sourceHandle === 'true') {
                newEdge.data = { branch: 'Condición se cumple' };
            } else if (connection.sourceHandle === 'false') {
                newEdge.data = { branch: 'Condición no se cumple' };
            }

            setEdges((eds) => addEdge(newEdge, eds));
        },
        [nodes, edges]
    );

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Delete') {
            setNodes((nds) => {
                const nodesToRemove = nds.filter((n) => n.selected).map((n) => n.id);
                setEdges((eds) =>
                    eds.filter((e) => !nodesToRemove.includes(e.source) && !nodesToRemove.includes(e.target))
                );
                return nds.filter((n) => !n.selected);
            });
        }
    };

    const addBlock = (block: { type: string; label: string }) => {
        if (block.type === 'cycle') {
            const nodeIdStart = `${Date.now()}_start`;
            const nodeIdEnd = `${Date.now()}_end`;
            const cycleStartNode: MyNode = {
                id: nodeIdStart,
                type: 'cycle_start',
                data: { label: block.label || 'Inicio Ciclo' },
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
            };
            const cycleEndNode: MyNode = {
                id: nodeIdEnd,
                type: 'cycle_end',
                data: { label: block.label || 'Fin Ciclo' },
                position: { x: cycleStartNode.position.x + 150, y: cycleStartNode.position.y + 150 },
            };
            setNodes((nds) => [...nds, cycleStartNode, cycleEndNode]);
            const cycleEdge: MyEdge = {
                id: `${nodeIdStart}_${nodeIdEnd}`,
                source: nodeIdStart,
                target: nodeIdEnd,
                type: 'custom',
                data: { branch: 'Ciclo' },
            };
            setEdges((eds) => [...eds, cycleEdge]);
        } else if (block.type === 'variable') {
            const nodeId = `${Date.now()}`;
            const newNode: MyNode = {
                id: nodeId,
                type: 'variable',
                data: {
                    name: 'var1',
                    value: '0',
                    variableType: 'number',
                },
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
            };
            setNodes((nds) => [...nds, newNode]);
        } else {
            const nodeId = `${Date.now()}`;
            const newNode: MyNode = {
                id: nodeId,
                type: block.type,
                data: { label: block.label },
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
            };
            setNodes((nds) => [...nds, newNode]);
        }
    };

    const handleLoad = async () => {
        if (!projectPath) return;
        try {
            const jsonStr = await invoke<string>('load_project', { path: projectPath });
            const loadedData = JSON.parse(jsonStr) as { nodes: MyNode[]; edges: MyEdge[] };
            if (loadedData.nodes && loadedData.edges) {
                setNodes(loadedData.nodes);
                setEdges(loadedData.edges);
            }
        } catch (error) {
            console.error('Error al cargar el proyecto:', error);
        }
    };

    const handleSave = async () => {
        if (!projectPath) return;
        const diagramState = { nodes, edges };
        try {
            await invoke('save_project', {
                path: projectPath,
                data: JSON.stringify(diagramState, null, 2),
            });
        } catch (error) {
            console.error('Error al guardar el proyecto:', error);
        }
    };

    useEffect(() => {
        if (projectPath && !isNew) {
            handleLoad();
        }
    }, [projectPath, isNew]);

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ height: '100vh', outline: 'none' }}
        >
            <BlockPalette onAddBlock={addBlock} />
            <div style={{ padding: '1rem' }}>
                <button onClick={onBackToProject}>&larr; Volver</button>
                <button onClick={handleLoad} style={{ marginLeft: '1rem' }}>
                    Recargar
                </button>
                <button onClick={handleSave} style={{ marginLeft: '1rem' }}>
                    Guardar
                </button>
            </div>
            <div style={{ height: '80%', border: '1px solid #ccc' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                >
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
            <div style={{ padding: '1rem' }}>
                <button onClick={simulateDiagram}>Ejecutar Diagrama</button>
            </div>
        </div>
    );

    function simulateDiagram() {
        let currentNode: MyNode | null = nodes.find(
            (node) => node.data.label && node.data.label.toLowerCase() === 'inicio'
        ) || null;

        if (!currentNode) {
            alert('No se encontró un nodo de inicio.');
            return;
        }

        while (currentNode) {
            switch (currentNode.type) {
                case 'process':
                    console.log(`Ejecutando proceso: ${currentNode.data.label}`);
                    break;

                case 'conditional': {
                    const incomingVarEdge = edges.find(
                        (edge) =>
                            edge.target === currentNode?.id &&
                            nodes.find((n) => n.id === edge.source)?.type === 'variable'
                    );
                    let condition: boolean;
                    if (incomingVarEdge) {
                        const varNode = nodes.find((n) => n.id === incomingVarEdge.source);
                        const varValue = varNode?.data.value;
                        condition = String(varValue).toLowerCase() === 'true';
                        console.log(`Condicional "${currentNode.data.label}" con variable: ${varValue}`);
                    } else {
                        condition = window.confirm(`Condición en "${currentNode.data.label}": ¿Es verdadera?`);
                    }
                    const branchEdges = edges.filter((edge) => edge.source === currentNode?.id);
                    if (branchEdges.length >= 2) {
                        currentNode =
                            nodes.find((n) =>
                                n.id === (condition ? branchEdges[0].target : branchEdges[1].target)
                            ) || null;
                    } else {
                        currentNode =
                            nodes.find((n) => n.id === branchEdges[0]?.target) || null;
                    }
                    break;
                }

                case 'cycle_start':
                    console.log(`Ejecutando inicio de ciclo: ${currentNode.data.label}`);
                    const cycleEdge = edges.find((edge) => edge.source === currentNode?.id);
                    currentNode = nodes.find((n) => n.id === cycleEdge?.target) || null;
                    break;

                case 'cycle_end':
                    console.log(`Fin de ciclo: ${currentNode.data.label}`);
                    currentNode = null;
                    break;

                case 'io': {
                    const input = window.prompt(`Entrada en "${currentNode.data.label}": ingresa un valor`);
                    console.log(`Valor ingresado: ${input}`);
                    break;
                }

                case 'function':
                    console.log(`Ejecutando función: ${currentNode.data.label}`);
                    break;

                case 'variable':
                    console.log(`Variable "${currentNode.data.name}" con valor: ${currentNode.data.value}`);
                    break;

                default:
                    console.log(`Nodo desconocido: ${currentNode.data.label}`);
            }

            if (!currentNode) break;

            const outgoingEdge = edges.find((edge) => edge.source === currentNode?.id);
            if (!outgoingEdge) {
                currentNode = null;
            } else {
                currentNode = nodes.find((n) => n.id === outgoingEdge.target) || null;
            }
        }

        alert('Simulación finalizada.');
    }
}

export default DiagramEditor;