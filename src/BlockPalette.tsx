import React from 'react';

interface Block {
    type: string;
    label: string;
}

const availableBlocks: Block[] = [
    { type: 'process', label: 'Proceso' },
    { type: 'conditional', label: 'Condicional' },
    { type: 'cycle', label: 'Ciclo' },
    { type: 'io', label: 'Entrada/Salida' },
    { type: 'function', label: 'Función' },
    { type: 'variable', label: 'Variable' },
];

interface BlockPaletteProps {
    onAddBlock: (block: Block) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
    return (
        <div style={{ padding: '0.5rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '0.5rem' }}>
            {availableBlocks.map((block) => (
                <button
                    key={block.type}
                    onClick={() => onAddBlock(block)}
                    style={{ cursor: 'pointer' }}
                >
                    {block.label}
                </button>
            ))}
        </div>
    );
};

export default BlockPalette;
