import { Calendar, Users, Edit3, ClipboardList, Clock } from 'lucide-react';
import dayjs from 'dayjs';

export default function EventCard({ event, profiles = [], viewTimezone = 'UTC', onClick, onEdit, onViewLogs }) {
    const formatFull = (d) => dayjs.utc(d).tz(viewTimezone).format('MMM D, YYYY');
    const formatTime = (d) => dayjs.utc(d).tz(viewTimezone).format('h:mm A');
    const formatAudit = (d) => dayjs.utc(d).tz(viewTimezone).format('MMM D, YYYY [at] hh:mm A');

    // Participant logic
    const participantCount = event.profiles?.length || 0;
    let participantText = 'No participants';
    
    if (participantCount > 0) {
        const getProfileName = (pOrId) => {
            if (pOrId?.name) return pOrId.name;
            const found = profiles.find(p => (p._id?.toString() === pOrId?.toString()) || (p.id?.toString() === pOrId?.toString()));
            return found ? found.name : 'Unknown';
        };
        const firstProfileName = getProfileName(event.profiles[0]);
        participantText = participantCount === 1 ? firstProfileName : `${firstProfileName} + ${participantCount - 1} more`;
    }

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            
            {/* Title Display */}
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>{event.title}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {/* 2. Start Date/Time */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Calendar size={20} style={{ marginTop: '4px', opacity: 0.6 }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>Start: {formatFull(event.startTime)}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            {formatTime(event.startTime)}
                        </div>
                    </div>
                </div>

                {/* 3. End Date/Time */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Calendar size={20} style={{ marginTop: '4px', opacity: 0.6 }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>End: {formatFull(event.endTime)}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            {formatTime(event.endTime)}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Participants */}
            <div 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)', marginBottom: '1.5rem', cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
            >
                <Users size={18} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{participantText}</span>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Created: {formatAudit(event.createdAt)} {event.createdBy ? `by ${event.createdBy}` : ''}
                </div>
                {dayjs(event.updatedAt).isAfter(dayjs(event.createdAt).add(1, 'second')) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Updated: {formatAudit(event.updatedAt)} {event.updatedBy ? `by ${event.updatedBy}` : ''}
                    </div>
                )}
            </div>

            {/* 4. Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    style={{ 
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                        padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600
                    }}
                >
                    <Edit3 size={16} /> Edit
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onViewLogs(); }}
                    style={{ 
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                        padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600
                    }}
                >
                    <ClipboardList size={16} /> View Logs
                </button>
            </div>
        </div>
    );
}
