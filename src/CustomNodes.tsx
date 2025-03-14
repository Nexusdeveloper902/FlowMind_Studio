// CustomNodes.tsx
import React, { useState, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

/**
 * Componente para editar etiquetas (texto) dentro de un nodo.
 */
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

/**
 * Nodo "Proceso"
 */
export const ProcessNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #66a0ff', // Borde azul claro
                backgroundColor: '#444',     // Fondo gris oscuro
                color: '#fff',               // Texto blanco
                position: 'relative',
                minWidth: '80px',
                textAlign: 'center',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            {data.label && data.onChangeLabel ? (
                <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
            ) : (
                <div>{data.label || 'Proceso'}</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Condicional"
 */
export const ConditionalNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#444',      // Gris oscuro
                border: '2px solid #ffd86f',  // Borde amarillo claro
                transform: 'rotate(45deg)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
            }}
        >
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#aaa', transform: 'rotate(-45deg)', left: '50%' }}
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

/**
 * Nodo "Inicio Ciclo"
 */
export const CycleStartNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#333',
                border: '2px solid #5bdb80', // Borde verde claro
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            {data.label && data.onChangeLabel ? (
                <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
            ) : (
                <div>Inicio Ciclo</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Fin Ciclo"
 */
export const CycleEndNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#333',
                border: '2px solid #ff7070', // Borde rojo claro
                borderRadius: '50%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            {data.label && data.onChangeLabel ? (
                <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
            ) : (
                <div>Fin Ciclo</div>
            )}
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Entrada/Salida"
 */
export const IONode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                width: '120px',
                height: '50px',
                backgroundColor: '#555',
                border: '2px solid #ff7f7f', // Borde rosa claro
                transform: 'skew(-20deg)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#aaa', transform: 'skew(20deg)' }}
            />
            <div style={{ transform: 'skew(20deg)' }}>
                {data.label && data.onChangeLabel ? (
                    <EditableLabel label={data.label} onChangeLabel={data.onChangeLabel} />
                ) : (
                    <div>{data.label || 'I/O'}</div>
                )}
            </div>
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#aaa', transform: 'skew(20deg)' }}
            />
        </div>
    );
};

/**
 * Nodo "Función (Definición)"
 */
export const FunctionDefinitionNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                padding: '10px',
                backgroundColor: '#444',
                border: '2px solid #54cedd', // Borde cian claro
                borderRadius: '15px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            <div>
                <strong>Función: {data.label || 'Definición'}</strong>
            </div>
            <textarea
                value={data.code || ''}
                onChange={(e) => data.onChangeCode && data.onChangeCode(e.target.value)}
                placeholder="Código de la función"
                style={{
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: '1px solid #999',
                }}
            />
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Función (Llamada)"
 */
export const FunctionCallNode = (props: NodeProps<any>) => {
    const { data } = props;
    return (
        <div
            style={{
                padding: '10px',
                backgroundColor: '#444',
                border: '2px solid #ffd86f', // Borde amarillo claro
                borderRadius: '15px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            <div>
                <strong>Llamada a función</strong>
            </div>
            <input
                type="text"
                value={data.functionName || ''}
                onChange={(e) => data.onChangeFunctionName && data.onChangeFunctionName(e.target.value)}
                placeholder="Nombre de la función"
                style={{
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: '1px solid #999',
                }}
            />
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Variable"
 */
export const VariableNode = (props: NodeProps<any>) => {
    const { data } = props;
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        data.onChangeType && data.onChangeType(e.target.value);
    };

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #a3a3a3',
                backgroundColor: '#333',
                borderRadius: '5px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
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
                    style={{
                        fontSize: '0.8rem',
                        backgroundColor: '#666',
                        color: '#fff',
                        border: '1px solid #999',
                        marginLeft: '5px',
                    }}
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
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Idea"
 */
export const IdeaNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#444');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #d162ed', // Borde violeta claro
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            <div><strong>Idea</strong></div>
            <textarea
                value={data.text || ''}
                onChange={(e) => data.onChangeText && data.onChangeText(e.target.value)}
                placeholder="Escribe tu idea..."
                style={{
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: '1px solid #999',
                }}
            />
            <div style={{ marginTop: '5px' }}>
                <label>Color: </label>
                <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ marginLeft: '5px' }}
                />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Nota"
 */
export const NoteNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#444');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #ffe666', // Borde amarillo suave
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            <div><strong>Nota</strong></div>
            <textarea
                value={data.text || ''}
                onChange={(e) => data.onChangeText && data.onChangeText(e.target.value)}
                placeholder="Escribe tu nota..."
                style={{
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: '1px solid #999',
                }}
            />
            <div style={{ marginTop: '5px' }}>
                <label>Color: </label>
                <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ marginLeft: '5px' }}
                />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Multimedia"
 */
export const MultimediaNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#444');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #3fe0c3', // Borde turquesa claro
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            <div><strong>Multimedia</strong></div>
            <input
                type="text"
                value={data.url || ''}
                onChange={(e) => data.onChangeUrl && data.onChangeUrl(e.target.value)}
                placeholder="URL de imagen/video"
                style={{
                    width: '100%',
                    marginTop: '5px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: '1px solid #999',
                }}
            />
            <div style={{ marginTop: '5px' }}>
                <label>Color: </label>
                <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ marginLeft: '5px' }}
                />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};

/**
 * Nodo "Decisión"
 */
export const DecisionNode = (props: NodeProps<any>) => {
    const { data } = props;
    const [bgColor, setBgColor] = useState(data.bgColor || '#444');

    useEffect(() => {
        data.onChangeBgColor && data.onChangeBgColor(bgColor);
    }, [bgColor]);

    const options = data.options || ['Opción 1', 'Opción 2'];

    return (
        <div
            style={{
                padding: '10px',
                border: '2px solid #ff7a67', // Borde rojizo claro
                backgroundColor: bgColor,
                borderRadius: '10px',
                position: 'relative',
                minWidth: '120px',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#aaa' }} />
            <div><strong>Decisión</strong></div>
            <div style={{ marginTop: '5px' }}>
                <label>Selecciona: </label>
                <select
                    value={data.selected || options[0]}
                    onChange={(e) => data.onChangeSelected && data.onChangeSelected(e.target.value)}
                    style={{
                        marginLeft: '5px',
                        backgroundColor: '#666',
                        color: '#fff',
                        border: '1px solid #999',
                    }}
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
                <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ marginLeft: '5px' }}
                />
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#aaa' }} />
        </div>
    );
};
