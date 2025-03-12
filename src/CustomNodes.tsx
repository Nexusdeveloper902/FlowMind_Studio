// src/CustomNodes.tsx
import React, { useState, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

/* ---------------------- Edición Inline ---------------------- */
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

/* ---------------------- Nodos de Programación ---------------------- */

// Nodo para procesos (rectangular)
export const ProcessNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #007bff',
                backgroundColor: '#e7f1ff',
                position: 'relative',
                minWidth: '80px',
                textAlign: 'center',
            }}
        >
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
export const ConditionalNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#fff3cd',
                border: '2px solid #ffc107',
                transform: 'rotate(45deg)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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
export const CycleStartNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#d4edda',
                border: '2px solid #28a745',
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
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
export const CycleEndNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#f0d9d9',
                border: '2px solid #dc3545',
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
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
export const IONode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '120px',
                height: '50px',
                backgroundColor: '#f8d7da',
                border: '2px solid #dc3545',
                transform: 'skew(-20deg)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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

/* ---------------------- Nodos de Funciones (Programación) ---------------------- */

// Nodo para definir una función (definición)
export const FunctionDefinitionNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                padding: '10px',
                backgroundColor: '#d1ecf1',
                border: '2px solid #17a2b8',
                borderRadius: '15px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div>
                <strong>Función: {data.label || 'Definición'}</strong>
            </div>
            <textarea
                value={data.code || ''}
                onChange={(e) => data.onChangeCode && data.onChangeCode(e.target.value)}
                placeholder="Código de la función"
                style={{ width: '100%', marginTop: '5px' }}
            />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo para llamar a una función (invocación)
export const FunctionCallNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                padding: '10px',
                backgroundColor: '#fff3cd',
                border: '2px solid #ffc107',
                borderRadius: '15px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div>
                <strong>Llamada a función</strong>
            </div>
            <input
                type="text"
                value={data.functionName || ''}
                onChange={(e) => data.onChangeFunctionName && data.onChangeFunctionName(e.target.value)}
                placeholder="Nombre de la función"
                style={{ width: '100%', marginTop: '5px' }}
            />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo para variables
export const VariableNode = (props: NodeProps<any>) => {
    const { data } = props;
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        data.onChangeType && data.onChangeType(e.target.value);
    };

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #6c757d',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
            }}
        >
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

/* ---------------------- Nodos Creativos ---------------------- */

// Nodo de Idea (lluvia de ideas)
export const IdeaNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#ffffff');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #8e44ad',
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div><strong>Idea</strong></div>
            <textarea
                value={data.text || ''}
                onChange={(e) => data.onChangeText && data.onChangeText(e.target.value)}
                placeholder="Escribe tu idea..."
                style={{ width: '100%', marginTop: '5px' }}
            />
            <div style={{ marginTop: '5px' }}>
                <label>Color: </label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo de Nota
export const NoteNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#f9e79f');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #f1c40f',
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div><strong>Nota</strong></div>
            <textarea
                value={data.text || ''}
                onChange={(e) => data.onChangeText && data.onChangeText(e.target.value)}
                placeholder="Escribe tu nota..."
                style={{ width: '100%', marginTop: '5px' }}
            />
            <div style={{ marginTop: '5px' }}>
                <label>Color: </label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo Multimedia (imagen, video, etc.)
export const MultimediaNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#d1f2eb');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #1abc9c',
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div><strong>Multimedia</strong></div>
            <input
                type="text"
                value={data.url || ''}
                onChange={(e) => data.onChangeUrl && data.onChangeUrl(e.target.value)}
                placeholder="URL de imagen/video"
                style={{ width: '100%', marginTop: '5px' }}
            />
            <div style={{ marginTop: '5px' }}>
                <label>Color: </label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};

// Nodo de Decisión (con desplegable)
export const DecisionNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#fadbd8');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    // Opciones para el desplegable (pueden venir desde data.options)
    const options = data.options || ['Opción 1', 'Opción 2'];

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #e74c3c',
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div><strong>Decisión</strong></div>
            <div style={{ marginTop: '5px' }}>
                <label>Selecciona: </label>
                <select
                    value={data.selected || options[0]}
                    onChange={(e) => data.onChangeSelected && data.onChangeSelected(e.target.value)}
                >
                    {options.map((opt: string, index: number) => (
                        <option key={index} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ marginTop: '5px' }}>
                <label>Color: </label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </div>
    );
};
