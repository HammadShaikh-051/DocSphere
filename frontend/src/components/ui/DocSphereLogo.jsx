import React from 'react';

/**
 * DocSphere unified branding component
 * - Displays the official DocSphere logo (/logo.png)
 * - Restrained, modern, non-rainbow wordmark adaptive to current theme (dark & light)
 * - Supports horizontal (sidebar/landing) and vertical (auth cards) layouts
 */
export default function DocSphereLogo({
    size = 32,
    showWordmark = true,
    wordmarkSize,
    subtitle,
    layout = 'horizontal',
    className = '',
    style = {},
    iconStyle = {},
    wordmarkStyle = {},
    onClick,
}) {
    const defaultWordmarkSize = size >= 40 ? '24px' : size >= 32 ? '17px' : size >= 24 ? '15px' : '13px';
    const finalWordmarkSize = wordmarkSize || defaultWordmarkSize;
    const borderRadius = Math.max(6, Math.round(size * 0.22));

    return (
        <div
            className={`docsphere-brand-container ${className}`}
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: layout === 'vertical' ? '12px' : '10px',
                flexDirection: layout === 'vertical' ? 'column' : 'row',
                textDecoration: 'none',
                cursor: onClick ? 'pointer' : 'inherit',
                userSelect: 'none',
                ...style,
            }}
        >
            {/* DocSphere Official Logo Icon */}
            <img
                src="/logo.png"
                alt="DocSphere Logo"
                width={size}
                height={size}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: `${borderRadius}px`,
                    objectFit: 'contain',
                    flexShrink: 0,
                    boxShadow: size >= 32 ? '0 2px 8px rgba(0, 0, 0, 0.14)' : 'none',
                    ...iconStyle,
                }}
            />

            {/* Wordmark & Optional Subtitle */}
            {showWordmark && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: layout === 'vertical' ? 'center' : 'flex-start',
                        justifyContent: 'center',
                    }}
                >
                    <span
                        className="docsphere-wordmark"
                        style={{
                            fontSize: finalWordmarkSize,
                            fontWeight: 700,
                            letterSpacing: '-0.025em',
                            lineHeight: 1.15,
                            color: 'var(--text-primary)',
                            ...wordmarkStyle,
                        }}
                    >
                        DocSphere
                    </span>
                    {subtitle && (
                        <span
                            style={{
                                fontSize: '10px',
                                color: 'var(--text-muted)',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                marginTop: '1.5px',
                                lineHeight: 1,
                            }}
                        >
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
