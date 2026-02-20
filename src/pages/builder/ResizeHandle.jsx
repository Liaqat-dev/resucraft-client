const ResizeHandle = ({ position, onMouseDown }) => {
    const positionStyles = {
        nw: { top: -4, left: -4 },
        n:  { top: -4, left: '50%', transform: 'translateX(-50%)' },
        ne: { top: -4, right: -4 },
        e:  { top: '50%', right: -4, transform: 'translateY(-50%)' },
        se: { bottom: -4, right: -4 },
        s:  { bottom: -4, left: '50%', transform: 'translateX(-50%)' },
        sw: { bottom: -4, left: -4 },
        w:  { top: '50%', left: -4, transform: 'translateY(-50%)' }
    };

    return (
        <div
            style={{
                position: 'absolute',
                width: '7px',
                height: '7px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #3b82f6',
                borderRadius: '2px',
                cursor: `${position}-resize`,
                zIndex: 1000,
                boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1), 0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.1s',
                ...positionStyles[position]
            }}
            onMouseDown={onMouseDown}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = (positionStyles[position].transform || '') + ' scale(1.3)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = positionStyles[position].transform || '';
            }}
        />
    );
};

export default ResizeHandle;
