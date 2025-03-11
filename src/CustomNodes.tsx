import React, { useState, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { NodeData } from './types';

// Componente para edición inline del label
export const EditableLabel = ({
                                  label,
                                  onChangeLabel,
                              }: {
    label: string;
    onChangeLabel: (newLabel: string) => void;
}) => {
    const [editing, setEditing] = useState(false);
    const [tempLabel, setTempLabel] = useState(label);

    useEffect(() => {
        setTempLabel(label);
    }, [label]);

    const handleBlur = () => {
        setEditing(false);
        onChangeLabel(tempLabel);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditing(false);
            onChangeLabel(tempLabel);
        }
    };

    return editing ? (
        <input
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            style={{ width: '100%', textAlign: 'center' }}
        />
    ) : (
        <div onDoubleClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
            {label}
        </div>
    );
};

// Nodo para procesos (rectangular)
export const ProcessNode = (props: NodeProps<NodeData>) => {
    const { data } = props;
    return (
        <div style={{
            padding: '10px',
            border: '2px solid #007bff',
            backgroundColor: '#e7f1ff',
            position: 'relative',
            minWidth: '80px',
            textAlign: 'center'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            {data.label && data.onChangeLabel ? (
                <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
            ) : (
                <div>{data.label || 'Proceso'}</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo para condicionales (diamante)
export const ConditionalNode = (props: NodeProps<NodeData>) => {
    const { data } = props;
    return (
        <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#fff3cd',
            border: '2px solid #ffc107',
            transform: 'rotate(45deg)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#555', transform: 'rotate(-45deg)', left: '50%' }}
            />
            <div style={{ transform: 'rotate(-45deg)', textAlign: 'center' }}>
                {data.label && data.onChangeLabel ? (
                    <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
                ) : (
                    <div>{data.label || 'Condicional'}</div>
                )}
            </div>
            <Handle
                id="true"
                type="source"
                position={Position.Left}
                style={{ background: 'green', transform: 'rotate(-45deg)', top: '50%' }}
            />
            <Handle
                id="false"
                type="source"
                position={Position.Right}
                style={{ background: 'red', transform: 'rotate(-45deg)', top: '50%' }}
            />
        </div>
    );
};

// Nodo para ciclo: inicio del ciclo
export const CycleStartNode = (props: NodeProps<NodeData>) => {
    const { data } = props;
    return (
        <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#d4edda',
            border: '2px solid #28a745',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            {data.label && data.onChangeLabel ? (
                <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
            ) : (
                <div>Inicio Ciclo</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo para ciclo: fin del ciclo
export const CycleEndNode = (props: NodeProps<NodeData>) => {
    const { data } = props;
    return (
        <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#f0d9d9',
            border: '2px solid #dc3545',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            {data.label && data.onChangeLabel ? (
                <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
            ) : (
                <div>Fin Ciclo</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo para entrada/salida (paralelogramo)
export const IONode = (props: NodeProps<NodeData>) => {
    const { data } = props;
    return (
        <div style={{
            width: '120px',
            height: '50px',
            backgroundColor: '#f8d7da',
            border: '2px solid #dc3545',
            transform: 'skew(-20deg)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Handle type="target" position={Position.Left} style={{ background: '#555', transform: 'skew(20deg)' }} />
            <div style={{ transform: 'skew(20deg)' }}>
                {data.label && data.onChangeLabel ? (
                    <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
                ) : (
                    <div>{data.label || 'I/O'}</div>
                )}
            </div>
            <Handle type="source" position={Position.Right} style={{ background: '#555', transform: 'skew(20deg)' }} />
        </div>
    );
};

// Nodo para funciones (rectángulo con bordes redondeados)
export const FunctionNode = (props: NodeProps<NodeData>) => {
    const { data } = props;
    return (
        <div style={{
            padding: '10px',
            backgroundColor: '#d1ecf1',
            border: '2px solid #17a2b8',
            borderRadius: '15px',
            position: 'relative',
            minWidth: '80px',
            textAlign: 'center'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            {data.label && data.onChangeLabel ? (
                <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
            ) : (
                <div>{data.label || 'Función'}</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo para variables
export const VariableNode = (props: NodeProps<NodeData>) => {
    const { data } = props;
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        data.onChangeType && data.onChangeType(e.target.value);
    };

    return (
        <div style={{
            padding: '10px',
            border: '2px solid #6c757d',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            position: 'relative',
            minWidth: '120px',
            textAlign: 'center'
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div>
                <strong>Var:</strong>
                {data.name && data.onChangeName ? (
                    <EditableLabel label={data.name} onChangeLabel={data.onChangeName} />
                ) : (
                    <div>var1</div>
                )}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem' }}>Tipo:</label>
                <select
                    value={data.variableType || 'number'}
                    onChange={handleTypeChange}
                    style={{ fontSize: '0.8rem' }}
                >
                    <option value="number">Number</option>
                    <option value="string">String</option>
                    <option value="boolean">Boolean</option>
                </select>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <strong>Val:</strong>
                {data.value && data.onChangeValue ? (
                    <EditableLabel label={data.value} onChangeLabel={data.onChangeValue} />
                ) : (
                    <div>0</div>
                )}
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};
