import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, UserPlus, X } from 'lucide-react';

export default function MultiSelect({ 
    options, 
    selectedIds, 
    onChange, 
    onAddProfile,
    placeholder = "Select profiles...", 
    label 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (id) => {
        const newSelection = selectedIds.includes(id)
            ? selectedIds.filter(i => i !== id)
            : [...selectedIds, id];
        onChange(newSelection);
    };

    const count = selectedIds.length;
    const displayText = count === 0 ? placeholder : `${count} profile${count > 1 ? 's' : ''} selected`;

    return (
        <div className="input-group" ref={containerRef} style={{ position: 'relative' }}>
            {label && <label className="input-label">{label}</label>}
            
            <div 
                className="input-field" 
                style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.8)'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflow: 'hidden' }}>
                    <span style={{ 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        color: count > 0 ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>
                        {displayText}
                    </span>
                    {count > 0 && (
                        <div style={{ background: 'var(--primary-color)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>
                            {count}
                        </div>
                    )}
                </div>
                <ChevronDown size={16} />
            </div>

            {isOpen && (
                <div 
                    className="glass-panel" 
                    style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: 0, 
                        right: 0, 
                        zIndex: 100, 
                        marginTop: '6px',
                        padding: '10px',
                        maxHeight: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        background: 'var(--floating-surface)',
                        boxShadow: 'var(--floating-shadow)',
                        border: '1px solid rgba(0,0,0,0.15)'
                    }}
                >
                    <div style={{ overflowY: 'auto', flex: 1, marginBottom: '8px' }}>
                        {options.map(opt => (
                            <div 
                                key={opt._id}
                                style={{ 
                                    padding: '8px 12px', 
                                    borderRadius: '6px', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: selectedIds.includes(opt._id) ? 'rgba(0,0,0,0.05)' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                                onClick={() => toggleOption(opt._id)}
                            >
                                <span style={{ fontSize: '0.9rem' }}>{opt.name}</span>
                                {selectedIds.includes(opt._id) && <Check size={14} color="var(--primary-color)" />}
                            </div>
                        ))}
                    </div>

                    <div 
                        style={{ 
                            borderTop: '1px solid rgba(0,0,0,0.05)', 
                            paddingTop: '8px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <button 
                            type="button"
                            className="btn btn-secondary"
                            style={{ width: '100%', fontSize: '0.85rem', padding: '6px' }}
                            onClick={() => {
                                onAddProfile();
                                setIsOpen(false);
                            }}
                        >
                            <UserPlus size={14} /> Create New Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
