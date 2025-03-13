import React from 'react';

interface Block {
    type: string;
    label: string;
}

interface BlockPaletteProps {
    onAddBlock: (block: Block) => void;
    mode: "programming" | "creative";
}

const programmingBlocks: Block[] = [
    { type: 'process', label: 'Proceso' },
    { type: 'conditional', label: 'Condicional' },
    { type: 'cycle', label: 'Ciclo' },
    { type: 'io', label: 'Entrada/Salida' },
    { type: 'functionDef', label: 'Función (Definición)' },
    { type: 'functionCall', label: 'Función (Llamada)' },
    { type: 'variable', label: 'Variable' },
];

const creativeBlocks: Block[] = [
    { type: 'idea', label: 'Idea' },
    { type: 'note', label: 'Nota' },
    { type: 'multimedia', label: 'Multimedia' },
    { type: 'decision', label: 'Decisión' },
];

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock, mode }) => {
    const blocks = mode === 'creative' ? creativeBlocks : programmingBlocks;
    return (
        <div className="d-flex p-2 border-bottom">
            {blocks.map((block) => (
                <button
                    key={block.type}
                    onClick={() => onAddBlock(block)}
                    className="btn btn-custom me-2"
                >
                    {block.label}
                </button>
            ))}
        </div>
    );
};

export default BlockPalette;
