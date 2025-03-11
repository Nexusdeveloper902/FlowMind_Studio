import React, { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    Connection,
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

const initialNodes = [
    { id: '1', type: 'process', data: { label: 'Inicio', onChangeLabel: (newLabel: string) => {} }, position: { x: 250, y: 0 } },
];
const initialEdges = [];

interface DiagramEditorProps {
    projectPath: string | null;
    isNew?: boolean;
    onBackToProject: () => void;
}

function DiagramEditor({ projectPath, isNew = false, onBackToProject }: DiagramEditorProps) {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateNodeData = (id: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
            )
        );
    };

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );
    const onConnect = useCallback(
        (connection: Connection) => {
            // Verificamos si el nodo de origen es de tipo "cycle_end"
            const sourceNode = nodes.find((node) => node.id === connection.source);
            if (sourceNode && sourceNode.type === 'cycle_end') {
                const existingEdge = edges.find((edge) => edge.source === connection.source);
                if (existingEdge) {
                    alert("Un ciclo solo puede conectarse a un elemento.");
                    return; // No se agrega la conexión
                }
            }
            // Asignamos tipo custom y, en caso de condicional, evaluamos el handle
            connection.type = 'custom';
            if (connection.sourceHandle === 'true') {
                connection.data = { branch: 'Condición se cumple' };
            } else if (connection.sourceHandle === 'false') {
                connection.data = { branch: 'Condición no se cumple' };
            }
            setEdges((eds) => addEdge(connection, eds));
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

    // Agregar un nuevo nodo desde la paleta
    const addBlock = (block: { type: string; label: string }) => {
        if (block.type === 'cycle') {
            // Al agregar un ciclo, creamos dos nodos: inicio y fin de ciclo, y los conectamos automáticamente.
            const nodeIdStart = `${Date.now()}_start`;
            const nodeIdEnd = `${Date.now()}_end`;
            const cycleStartNode = {
                id: nodeIdStart,
                type: 'cycle_start',
                data: {
                    label: block.label || "Inicio Ciclo",
                    onChangeLabel: (newLabel: string) => updateNodeData(nodeIdStart, { label: newLabel }),
                },
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
            };
            const cycleEndNode = {
                id: nodeIdEnd,
                type: 'cycle_end',
                data: {
                    label: block.label || "Fin Ciclo",
                    onChangeLabel: (newLabel: string) => updateNodeData(nodeIdEnd, { label: newLabel }),
                },
                position: { x: cycleStartNode.position.x + 150, y: cycleStartNode.position.y + 150 },
            };
            setNodes((nds) => [...nds, cycleStartNode, cycleEndNode]);
            const cycleEdge = {
                id: `${nodeIdStart}_${nodeIdEnd}`,
                source: nodeIdStart,
                target: nodeIdEnd,
                type: 'custom',
                data: { branch: 'Ciclo' },
            };
            setEdges((eds) => [...eds, cycleEdge]);
        } else if (block.type === 'variable') {
            // Nodo Variable
            const nodeId = `${Date.now()}`;
            const newNode = {
                id: nodeId,
                type: 'variable',
                data: {
                    name: 'var1',
                    value: '0',
                    variableType: 'number',
                    onChangeName: (newName: string) => updateNodeData(nodeId, { name: newName }),
                    onChangeValue: (newValue: string) => updateNodeData(nodeId, { value: newValue }),
                    onChangeType: (newType: string) => updateNodeData(nodeId, { variableType: newType }),
                },
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
            };
            setNodes((nds) => [...nds, newNode]);
        } else {
            const nodeId = `${Date.now()}`;
            const newNode = {
                id: nodeId,
                type: block.type,
                data: {
                    label: block.label,
                    onChangeLabel: (newLabel: string) => updateNodeData(nodeId, { label: newLabel }),
                },
                position: { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 },
            };
            setNodes((nds) => [...nds, newNode]);
        }
    };

    // Funciones de carga y guardado (si projectPath existe)
    const handleLoad = async () => {
        if (!projectPath) return;
        try {
            const jsonStr = await invoke<string>('load_project', { path: projectPath });
            const loadedData = JSON.parse(jsonStr);
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
                <button onClick={handleLoad} style={{ marginLeft: '1rem' }}>Recargar</button>
                <button onClick={handleSave} style={{ marginLeft: '1rem' }}>Guardar</button>
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

    // Función para simular la ejecución del diagrama (se mantiene la lógica anterior)
    function simulateDiagram() {
        let currentNode = nodes.find((node) => node.data.label.toLowerCase() === 'inicio');
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
                            edge.target === currentNode.id &&
                            nodes.find((node) => node.id === edge.source)?.type === 'variable'
                    );
                    let condition: boolean;
                    if (incomingVarEdge) {
                        const varNode = nodes.find((node) => node.id === incomingVarEdge.source);
                        const varValue = varNode?.data.value;
                        condition = String(varValue).toLowerCase() === 'true';
                        console.log(`Condicional "${currentNode.data.label}" evaluada con variable: ${varValue}`);
                    } else {
                        condition = window.confirm(`Condición en "${currentNode.data.label}": ¿Es verdadera?`);
                        console.log(`Condicional "${currentNode.data.label}" evaluada manualmente como: ${condition}`);
                    }
                    const branchEdges = edges.filter((edge) => edge.source === currentNode.id);
                    if (branchEdges.length >= 2) {
                        currentNode = nodes.find((node) =>
                            node.id === (condition ? branchEdges[0].target : branchEdges[1].target)
                        ) || null;
                    } else {
                        currentNode = nodes.find((node) => node.id === branchEdges[0]?.target) || null;
                    }
                    break;
                }
                case 'cycle_start':
                    console.log(`Ejecutando inicio de ciclo: ${currentNode.data.label}`);
                    // Suponemos que el siguiente nodo es el fin del ciclo
                    const cycleEdge = edges.find((edge) => edge.source === currentNode.id);
                    currentNode = nodes.find((node) => node.id === cycleEdge?.target) || null;
                    break;
                case 'cycle_end':
                    console.log(`Fin de ciclo: ${currentNode.data.label}`);
                    // Aquí, para simplificar, terminamos el ciclo.
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
            const outgoingEdge = edges.find((edge) => edge.source === currentNode.id);
            if (!outgoingEdge) {
                currentNode = null;
            } else {
                currentNode = nodes.find((node) => node.id === outgoingEdge.target) || null;
            }
        }
        alert('Simulación finalizada.');
    }
}

export default DiagramEditor;
