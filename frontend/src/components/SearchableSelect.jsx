import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

export default function SearchableSelect({ 
    options, 
    value, 
    onChange, 
    placeholder = 'Select...', 
    label 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);

    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = value || placeholder;

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
                <span style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    color: value ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}>
                    {selectedLabel}
                </span>
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
                        gap: '8px',
                        background: 'var(--floating-surface)',
                        boxShadow: 'var(--floating-shadow)',
                        border: '1px solid rgba(0,0,0,0.15)'
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input 
                            className="input-field"
                            style={{ paddingLeft: '32px', fontSize: '0.9rem', marginBottom: 0 }}
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <div 
                                    key={opt}
                                    style={{ 
                                        padding: '8px 12px', 
                                        borderRadius: '6px', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: value === opt ? 'rgba(0,0,0,0.05)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = value === opt ? 'rgba(0,0,0,0.05)' : 'transparent'}
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                >
                                    <span style={{ fontSize: '0.9rem' }}>{opt}</span>
                                    {value === opt && <Check size={14} />}
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
