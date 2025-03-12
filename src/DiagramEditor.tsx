// src/DiagramEditor.tsx
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
    FunctionDefinitionNode,
    FunctionCallNode,
    VariableNode,
    IdeaNode,
    NoteNode,
    MultimediaNode,
    DecisionNode,
} from './CustomNodes';
import CustomEdge from './CustomEdge';
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

function DiagramEditor({ projectPath, isNew = false, onBackToProject, mode }: DiagramEditorProps) {
    const [nodes, setNodes] = useState<MyNode[]>([]);
    const [edges, setEdges] = useState<MyEdge[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Función para actualizar los datos de un nodo por su id
    const updateNode = (id: string, newData: Partial<NodeData>) => {
        setNodes((prevNodes) =>
            prevNodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...newData } } : n))
        );
    };

    // Inicializar los nodos después de definir updateNode
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
                data: { branch: '' } as any,
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

    // Función para agregar un nuevo nodo y asignar callbacks de edición
    const addBlock = (block: { type: string; label: string }) => {
        const randomPos = { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 };
        let newNode: MyNode | null = null;
        const nodeId = `${Date.now()}${block.type}`;

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
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
            };
            const cycleEndNode: MyNode = {
                id: nodeIdEnd,
                type: 'cycle_end',
                data: {
                    label: block.label || 'Fin Ciclo',
                    onChangeLabel: (newLabel: string) => updateNode(nodeIdEnd, { label: newLabel }),
                },
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
            return;
        } else if (block.type === 'variable') {
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
        } else if (block.type === 'functionDef') {
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
        } else if (block.type === 'functionCall') {
            newNode = {
                id: nodeId,
                type: 'functionCall',
                data: {
                    functionName: '',
                    onChangeFunctionName: (newFN: string) => updateNode(nodeId, { functionName: newFN }),
                },
                position: randomPos,
            };
        } else if (block.type === 'idea') {
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
        } else if (block.type === 'note') {
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
        } else if (block.type === 'multimedia') {
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
        } else if (block.type === 'decision') {
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
        } else {
            // Para nodos de programación restantes (ej. process, conditional)
            newNode = {
                id: nodeId,
                type: block.type,
                data: {
                    label: block.label || '',
                    onChangeLabel: (newLabel: string) => updateNode(nodeId, { label: newLabel }),
                },
                position: randomPos,
            };
        }
        if (newNode) {
            setNodes((nds) => [...nds, newNode as MyNode]);
        }
    };

    // Al cargar, se espera que el archivo tenga { mode, nodes, edges }
    const handleLoad = async () => {
        if (!projectPath) return;
        try {
            const jsonStr = await invoke<string>('load_project', { path: projectPath });
            const loadedData = JSON.parse(jsonStr) as { mode: 'programming' | 'creative'; nodes: MyNode[]; edges: MyEdge[] };
            if (loadedData.nodes && loadedData.edges) {
                setNodes(loadedData.nodes);
                setEdges(loadedData.edges);
                // Si quisieras actualizar el modo en el componente padre, podrías hacerlo vía un callback
                console.log(`Proyecto cargado en modo: ${loadedData.mode}`);
            }
        } catch (error) {
            console.error('Error al cargar el proyecto:', error);
        }
    };

    // Al guardar, incluimos el modo en el estado guardado
    const handleSave = async () => {
        if (!projectPath) return;
        const diagramState = { mode, nodes, edges };
        try {
            await invoke('save_project', { path: projectPath, data: JSON.stringify(diagramState, null, 2) });
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
        // Recopilamos definiciones de función para la simulación
        const functionDefinitions = nodes.reduce((acc: { [key: string]: string }, node) => {
            if (node.type === 'functionDef' && node.data.label && node.data.code) {
                acc[node.data.label] = node.data.code;
            }
            return acc;
        }, {});

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
                    if (!currentNode) break;

                    const incomingVarEdge = edges.find(
                        (edge) =>
                            edge.target === currentNode?.id && // Añadido ? para operador de encadenamiento opcional
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
                    const branchEdges = edges.filter((edge) => currentNode && edge.source === currentNode.id);
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
                    if (currentNode) {
                        const cycleEdge = edges.find((edge) => currentNode && edge.source === currentNode.id); // Añadido verificación
                        currentNode = nodes.find((n) => n.id === cycleEdge?.target) || null;
                    }
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
                case 'functionDef':
                    if (currentNode.data.label && currentNode.data.code) {
                        console.log(`Definición de función "${currentNode.data.label}": ${currentNode.data.code}`);
                    }
                    break;
                case 'functionCall': {
                    if (currentNode.data.functionName) {
                        const functionName = currentNode.data.functionName;
                        const code = functionDefinitions[functionName];
                        if (code) {
                            console.log(`Llamando a la función "${functionName}": ${code}`);
                        } else {
                            console.log(`Función "${functionName}" no está definida.`);
                        }
                    }
                    break;
                }
                case 'variable':
                    if (currentNode.data.name) {
                        console.log(`Variable "${currentNode.data.name}" con valor: ${currentNode.data.value}`);
                    }
                    break;
                case 'idea':
                    if (currentNode.data.text) {
                        console.log(`Idea: ${currentNode.data.text}`);
                    }
                    break;
                case 'note':
                    if (currentNode.data.text) {
                        console.log(`Nota: ${currentNode.data.text}`);
                    }
                    break;
                case 'multimedia':
                    if (currentNode.data.url) {
                        console.log(`Multimedia URL: ${currentNode.data.url}`);
                    }
                    break;
                case 'decision':
                    if (currentNode.data.selected) {
                        console.log(`Decisión seleccionada: ${currentNode.data.selected}`);
                    }
                    break;
                default:
                    if (currentNode.data.label) {
                        console.log(`Nodo desconocido: ${currentNode.data.label}`);
                    }
            }
            if (!currentNode) break;

            const outgoingEdge = edges.find((edge) => currentNode && edge.source === currentNode.id);
            if (!outgoingEdge) {
                currentNode = null;
            } else {
                currentNode = nodes.find((n) => n.id === outgoingEdge.target) || null;
            }
        }
        alert('Simulación finalizada.');
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ height: '100vh', outline: 'none' }}
        >
            <BlockPalette onAddBlock={addBlock} mode={mode} />
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
}

export default DiagramEditor;