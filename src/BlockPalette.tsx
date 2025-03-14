// BlockPalette.tsx
import React from 'react';
import { FaCog, FaCodeBranch, FaRedoAlt, FaKeyboard, FaRegLightbulb, FaStickyNote } from 'react-icons/fa';

interface Block {
    type: string;
    label: string;
    icon?: React.ComponentType; // El ícono
}

interface BlockPaletteProps {
    onAddBlock: (block: Block) => void;
    mode: 'programming' | 'creative';
}

/* Ejemplo con algunos íconos de react-icons */
const programmingBlocks: Block[] = [
    { type: 'process', label: 'Proceso', icon: FaCog },
    { type: 'conditional', label: 'Condicional', icon: FaCodeBranch },
    { type: 'cycle', label: 'Ciclo', icon: FaRedoAlt },
    { type: 'io', label: 'Entrada/Salida', icon: FaKeyboard },
];

const creativeBlocks: Block[] = [
    { type: 'idea', label: 'Idea', icon: FaRegLightbulb },
    { type: 'note', label: 'Nota', icon: FaStickyNote },
];

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock, mode }) => {
    const blocks = mode === 'creative' ? creativeBlocks : programmingBlocks;

    return (
        <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
            {blocks.map((block) => (
                <button
                    key={block.type}
                    onClick={() => onAddBlock(block)}
                    className="btn btn-custom"
                >
                    {/* Si existe un ícono, lo renderizamos */}
                    {block.icon && <block.icon />}
                    <span>{block.label}</span>
                </button>
            ))}
        </div>
    );
};

export default BlockPalette;
