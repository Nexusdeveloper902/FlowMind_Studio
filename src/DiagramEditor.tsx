// DiagramEditor.tsx
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
import { FaArrowLeft } from 'react-icons/fa';

import BlockPalette from './BlockPalette';
import CustomEdge from './CustomEdge';
import {
    ProcessNode,
    ConditionalNode,
    CycleStartNode,
    CycleEndNode,
    IONode,
    FunctionDefinitionNode,
    FunctionCallNode,
    VariableNode,
    IdeaNode,
    NoteNode,
    MultimediaNode,
    DecisionNode,
} from './CustomNodes';
import { MyNode, MyEdge, NodeData } from './types';

const nodeTypes = {
    process: ProcessNode,
    conditional: ConditionalNode,
    cycle_start: CycleStartNode,
    cycle_end: CycleEndNode,
    io: IONode,
    functionDef: FunctionDefinitionNode,
    functionCall: FunctionCallNode,
    variable: VariableNode,
    idea: IdeaNode,
    note: NoteNode,
    multimedia: MultimediaNode,
    decision: DecisionNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

interface DiagramEditorProps {
    projectPath: string | null;
    isNew?: boolean;
    onBackToProject: () => void;
    mode: 'programming' | 'creative';
}

function rehydrateNodes(
    loadedNodes: MyNode[],
    updateNode: (id: string, newData: Partial<NodeData>) => void
): MyNode[] {
    return loadedNodes.map((node) => {
        const newData = { ...node.data };

        switch (node.type) {
            case 'process':
            case 'conditional':
            case 'cycle_start':
            case 'cycle_end':
            case 'io':
                newData.onChangeLabel = (newLabel: string) =>
                    updateNode(node.id, { label: newLabel });
                break;

            case 'variable':
                newData.onChangeName = (newName: string) =>
                    updateNode(node.id, { name: newName });
                newData.onChangeValue = (newValue: string) =>
                    updateNode(node.id, { value: newValue });
                newData.onChangeType = (newType: string) =>
                    updateNode(node.id, { variableType: newType });
                break;

            case 'functionDef':
                newData.onChangeLabel = (newLabel: string) =>
                    updateNode(node.id, { label: newLabel });
                newData.onChangeCode = (newCode: string) =>
                    updateNode(node.id, { code: newCode });
                break;

            case 'functionCall':
                newData.onChangeFunctionName = (newFN: string) =>
                    updateNode(node.id, { functionName: newFN });
                break;

            case 'idea':
            case 'note':
                newData.onChangeText = (newText: string) =>
                    updateNode(node.id, { text: newText });
                newData.onChangeBgColor = (newColor: string) =>
                    updateNode(node.id, { bgColor: newColor });
                break;

            case 'multimedia':
                newData.onChangeUrl = (newUrl: string) =>
                    updateNode(node.id, { url: newUrl });
                newData.onChangeBgColor = (newColor: string) =>
                    updateNode(node.id, { bgColor: newColor });
                break;

            case 'decision':
                newData.onChangeText = (newText: string) =>
                    updateNode(node.id, { text: newText });
                newData.onChangeBgColor = (newColor: string) =>
                    updateNode(node.id, { bgColor: newColor });
                newData.onChangeSelected = (newSel: string) =>
                    updateNode(node.id, { selected: newSel });
                break;
        }

        return { ...node, data: newData };
    });
}

function DiagramEditor({
                           projectPath,
                           isNew = false,
                           onBackToProject,
                           mode,
                       }: DiagramEditorProps) {
    const [nodes, setNodes] = useState<MyNode[]>([]);
    const [edges, setEdges] = useState<MyEdge[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateNode = (id: string, newData: Partial<NodeData>) => {
        setNodes((prevNodes) =>
            prevNodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...newData } } : n))
        );
    };

    useEffect(() => {
        setNodes([
            {
                id: '1',
                type: 'process',
                data: {
                    label: 'Inicio',
                    onChangeLabel: (newLabel: string) => updateNode('1', { label: newLabel }),
                },
                position: { x: 250, y: 0 },
            },
        ]);
        setEdges([]);
    }, []);

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
            const newEdge: MyEdge = {
                ...(connection as any),
                type: 'custom',
                data: { branch: '' },
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
        const randomPos = { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 };
        const nodeId = `${Date.now()}${block.type}`;
        let newNode: MyNode | null = null;

        if (block.type === 'cycle') {
            const nodeIdStart = `${Date.now()}_start`;
            const nodeIdEnd = `${Date.now()}_end`;

            const cycleStartNode: MyNode = {
                id: nodeIdStart,
                type: 'cycle_start',
                data: {
                    label: block.label || 'Inicio Ciclo',
                    onChangeLabel: (newLabel: string) => updateNode(nodeIdStart, { label: newLabel }),
                },
                position: { x: randomPos.x, y: randomPos.y },
            };

            const cycleEndNode: MyNode = {
                id: nodeIdEnd,
                type: 'cycle_end',
                data: {
                    label: block.label || 'Fin Ciclo',
                    onChangeLabel: (newLabel: string) => updateNode(nodeIdEnd, { label: newLabel }),
                },
                position: { x: randomPos.x + 150, y: randomPos.y + 150 },
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
            return;
        }

        switch (block.type) {
            case 'variable':
                newNode = {
                    id: nodeId,
                    type: 'variable',
                    data: {
                        name: 'var1',
                        value: '0',
                        variableType: 'number',
                        onChangeName: (newName: string) => updateNode(nodeId, { name: newName }),
                        onChangeValue: (newValue: string) => updateNode(nodeId, { value: newValue }),
                        onChangeType: (newType: string) => updateNode(nodeId, { variableType: newType }),
                    },
                    position: randomPos,
                };
                break;
            case 'functionDef':
                newNode = {
                    id: nodeId,
                    type: 'functionDef',
                    data: {
                        label: 'miFuncion',
                        code: '',
                        onChangeLabel: (newLabel: string) => updateNode(nodeId, { label: newLabel }),
                        onChangeCode: (newCode: string) => updateNode(nodeId, { code: newCode }),
                    },
                    position: randomPos,
                };
                break;
            case 'functionCall':
                newNode = {
                    id: nodeId,
                    type: 'functionCall',
                    data: {
                        functionName: '',
                        onChangeFunctionName: (newFN: string) =>
                            updateNode(nodeId, { functionName: newFN }),
                    },
                    position: randomPos,
                };
                break;
            case 'idea':
                newNode = {
                    id: nodeId,
                    type: 'idea',
                    data: {
                        text: '',
                        bgColor: '#ffffff',
                        onChangeText: (newText: string) => updateNode(nodeId, { text: newText }),
                        onChangeBgColor: (newColor: string) => updateNode(nodeId, { bgColor: newColor }),
                    },
                    position: randomPos,
                };
                break;
            case 'note':
                newNode = {
                    id: nodeId,
                    type: 'note',
                    data: {
                        text: '',
                        bgColor: '#f9e79f',
                        onChangeText: (newText: string) => updateNode(nodeId, { text: newText }),
                        onChangeBgColor: (newColor: string) => updateNode(nodeId, { bgColor: newColor }),
                    },
                    position: randomPos,
                };
                break;
            case 'multimedia':
                newNode = {
                    id: nodeId,
                    type: 'multimedia',
                    data: {
                        url: '',
                        bgColor: '#d1f2eb',
                        onChangeUrl: (newUrl: string) => updateNode(nodeId, { url: newUrl }),
                        onChangeBgColor: (newColor: string) => updateNode(nodeId, { bgColor: newColor }),
                    },
                    position: randomPos,
                };
                break;
            case 'decision':
                newNode = {
                    id: nodeId,
                    type: 'decision',
                    data: {
                        selected: 'Opción 1',
                        options: ['Opción 1', 'Opción 2'],
                        bgColor: '#fadbd8',
                        onChangeSelected: (newSel: string) => updateNode(nodeId, { selected: newSel }),
                        onChangeBgColor: (newColor: string) => updateNode(nodeId, { bgColor: newColor }),
                    },
                    position: randomPos,
                };
                break;
            default:
                newNode = {
                    id: nodeId,
                    type: block.type,
                    data: {
                        label: block.label || '',
                        onChangeLabel: (newLabel: string) => updateNode(nodeId, { label: newLabel }),
                    },
                    position: randomPos,
                };
                break;
        }

        if (newNode) {
            setNodes((nds) => [...nds, newNode as MyNode]);
        }
    };

    const handleLoad = async () => {
        if (!projectPath) return;
        try {
            const jsonStr = await invoke<string>('load_project', { path: projectPath });
            const loadedData = JSON.parse(jsonStr) as {
                mode: 'programming' | 'creative';
                nodes: MyNode[];
                edges: MyEdge[];
            };
            if (loadedData.nodes && loadedData.edges) {
                const rehydrated = rehydrateNodes(loadedData.nodes, updateNode);
                setNodes(rehydrated);
                setEdges(loadedData.edges);
                console.log(`Proyecto cargado en modo: ${loadedData.mode}`);
            }
        } catch (error) {
            console.error('Error al cargar el proyecto:', error);
        }
    };

    const handleSave = async () => {
        if (!projectPath) return;
        const diagramState = { mode, nodes, edges };
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

    const simulateDiagram = () => {
        alert('Simulación finalizada.');
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
                marginTop: '25px',
                height: 'calc(100vh - 90px)',
                display: 'flex',
                flexDirection: 'column',
                outline: 'none',
            }}
        >
            <BlockPalette onAddBlock={addBlock} mode={mode} />

            <div style={{ padding: '1rem' }}>
                <button onClick={onBackToProject} className="btn btn-custom">
                    <FaArrowLeft />
                    <span>Volver</span>
                </button>
                <button onClick={handleLoad} className="btn btn-custom" style={{ marginLeft: '1rem' }}>
                    Recargar
                </button>
                <button onClick={handleSave} className="btn btn-custom" style={{ marginLeft: '1rem' }}>
                    Guardar
                </button>
            </div>

            <div style={{ flexGrow: 1, border: '1px solid #ccc', margin: '0 1rem' }}>
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
                <button onClick={simulateDiagram} className="btn btn-custom">
                    Ejecutar Diagrama
                </button>
            </div>
        </div>
    );
}

export default DiagramEditor;
