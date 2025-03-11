// CustomEdge.jsx
import React, { useState } from 'react';
import { getBezierPath } from 'reactflow';

const CustomEdge = ({
                        id,
                        sourceX,
                        sourceY,
                        targetX,
                        targetY,
                        sourcePosition,
                        targetPosition,
                        style = {},
                        markerEnd,
                        data,
                    }) => {
    const [hovered, setHovered] = useState(false);
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
    });

    const branchLabel = data?.branch || '';

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
            {hovered && branchLabel && (
                <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fill="black"
                    fontSize={12}
                    dy={-5}
                >
                    {branchLabel}
                </text>
            )}
        </>
    );
};

export default CustomEdge;
