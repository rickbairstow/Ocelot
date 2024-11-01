import React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);
const colors = fullConfig.theme.colors;

const ColorPalette = () => (
    <div>
        {Object.entries(colors).map(([colorName, colorValues]) =>
            typeof colorValues === 'object' ? (
                <div key={colorName} style={{ marginBottom: '2rem' }}>
                    <h2 style={{ textTransform: 'capitalize' }}>{colorName}</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {Object.entries(colorValues).map(([weight, hex]) => (
                            <div
                                key={`${colorName}-${weight}`}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <div
                                    style={{
                                        height: '40px',
                                        width: '40px',
                                        borderRadius: '4px',
                                        backgroundColor: hex,
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                />
                                <div style={{ fontSize: '12px', color: '#0f172a' }}>{weight}</div>
                                <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#64748b' }}>{hex}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null
        )}
    </div>
);

export default ColorPalette;
