import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setViewTimezone } from '../store/eventsSlice';
import { Calendar, Globe } from 'lucide-react';

export default function Navbar() {
    const dispatch = useDispatch();
    const viewTimezone = useSelector((state) => state.events.viewTimezone);

    const timezones = Intl.supportedValuesOf('timeZone');

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.2rem 2rem',
            borderBottom: '1px solid var(--surface-border)',
            background: 'rgba(22, 27, 34, 0.4)',
            backdropFilter: 'var(--glass-blur)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar color="var(--primary-color)" size={28} />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
                    Event<span style={{ color: 'var(--primary-color)' }}>Sync</span>
                </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Globe size={18} color="var(--text-secondary)" />
                <select
                    className="input-field"
                    style={{ width: 'auto', padding: '0.4rem 0.8rem', margin: 0, cursor: 'pointer' }}
                    value={viewTimezone}
                    onChange={(e) => dispatch(setViewTimezone(e.target.value))}
                >
                    {/* This will render the complete global list */}
                    {timezones.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                    ))}
                </select>
            </div>
        </nav>
    );
}
