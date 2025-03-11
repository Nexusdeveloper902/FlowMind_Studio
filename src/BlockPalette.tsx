import React from 'react';

const availableBlocks = [
    { type: 'process', label: 'Proceso' },
    { type: 'conditional', label: 'Condicional' },
    { type: 'cycle', label: 'Ciclo' }, // Usaremos "cycle" para agregar ambos nodos (inicio y fin)
    { type: 'io', label: 'Entrada/Salida' },
    { type: 'function', label: 'Función' },
    { type: 'variable', label: 'Variable' },
];

const BlockPalette = ({ onAddBlock }: { onAddBlock: (block: { type: string; label: string }) => void }) => {
    return (
        <div style={{ padding: '0.5rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '0.5rem' }}>
            {availableBlocks.map((block) => (
                <button key={block.type} onClick={() => onAddBlock(block)} style={{ cursor: 'pointer' }}>
                    {block.label}
                </button>
            ))}
        </div>
    );
};

export default BlockPalette;
