import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../components/Button';
import Input from '../components/Input';
import SearchableSelect from '../components/SearchableSelect';
import MultiSelect from '../components/MultiSelect';
import api from '../services/api';
import toast from 'react-hot-toast';
import { fetchEventsForProfile } from '../store/eventsSlice';
import dayjs from 'dayjs';
import { Clock, Edit, History, Users } from 'lucide-react';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { list: allProfiles } = useSelector(state => state.profiles);
    const { viewTimezone } = useSelector(state => state.events);
    const { selectedProfileId } = useSelector(state => state.profiles);
    
    const [eventData, setEventData] = useState(null);
    const [logs, setLogs] = useState([]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ 
        title: '', 
        startDate: '', 
        startTime: '', 
        endDate: '', 
        endTime: '', 
        profileIds: [],
        updatedBy: '' 
    });

    const timezones = Intl.supportedValuesOf('timeZone');
    const today = dayjs().tz(viewTimezone).format('YYYY-MM-DD');

    useEffect(() => {
        // Load the single event and its logs
        const fetchEventAndLogs = async () => {
            try {
                const [resEvent, resLogs] = await Promise.all([
                    api.get(`/events/${id}?timezone=${viewTimezone}`),
                    api.get(`/events/${id}/logs?timezone=${viewTimezone}`)
                ]);
                setEventData(resEvent.data);
                setLogs(resLogs.data || []);

                setEditForm({
                    title: resEvent.data.title,
                    startDate: dayjs(resEvent.data.startTime).tz(viewTimezone).format('YYYY-MM-DD'),
                    startTime: dayjs(resEvent.data.startTime).tz(viewTimezone).format('HH:mm'),
                    endDate: dayjs(resEvent.data.endTime).tz(viewTimezone).format('YYYY-MM-DD'),
                    endTime: dayjs(resEvent.data.endTime).tz(viewTimezone).format('HH:mm'),
                    profileIds: resEvent.data.profiles || [],
                    updatedBy: ''
                });
            } catch (err) {
                if (err.status === 404) navigate('/');
            }
        };

        fetchEventAndLogs();
    }, [id, viewTimezone, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editForm.updatedBy.trim()) {
            toast.error('Please enter your name to log this update');
            return;
        }

        const startLocal = `${editForm.startDate}T${editForm.startTime}`;
        const endLocal = `${editForm.endDate}T${editForm.endTime}`;

        if (new Date(endLocal) <= new Date(startLocal)) {
            toast.error('End time must be after start time');
            return;
        }

        try {
            await api.put(`/events/${id}`, {
                title: editForm.title,
                startTime: startLocal,
                endTime: endLocal,
                profiles: editForm.profileIds,
                timezone: viewTimezone,
                updatedBy: editForm.updatedBy
            });
            
            toast.success('Event updated!');
            setIsEditing(false);
            
            // Re-fetch local data
            const [resEvent, resLogs] = await Promise.all([
                api.get(`/events/${id}?timezone=${viewTimezone}`),
                api.get(`/events/${id}/logs?timezone=${viewTimezone}`)
            ]);
            setEventData(resEvent.data);
            setLogs(resLogs.data || []);

            if (selectedProfileId) dispatch(fetchEventsForProfile({ profileId: selectedProfileId, timezone: viewTimezone }));
            
        } catch {
            // Error is handled by toast
        }
    };

    if (!eventData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ paddingBottom: '4rem' }}>
            <main style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 2rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Button variant="secondary" onClick={() => navigate('/')}>&larr; Back to Dashboard</Button>
                    <h1 style={{ fontSize: '1.8rem', margin: 0, flex: 1, color: 'var(--text-primary)' }}>{eventData.title}</h1>
                    <Button variant={isEditing ? 'secondary' : 'primary'} onClick={() => setIsEditing(!isEditing)}>
                        <Edit size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Event'}
                    </Button>
                </div>

                {/* Editing Mode */}
                {isEditing ? (
                    <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Update Event</h3>
                        <form onSubmit={handleUpdate}>
                            <Input 
                                id="title" label="Title" 
                                value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} 
                            />

                            <MultiSelect 
                                label="Profiles"
                                options={allProfiles}
                                selectedIds={editForm.profileIds}
                                onChange={(ids) => setEditForm({...editForm, profileIds: ids})}
                                onAddProfile={() => navigate('/')} // Take them back to dashboard to add profile for now
                            />

                            <SearchableSelect 
                                label={`Timezone (${viewTimezone})`}
                                options={timezones}
                                value={viewTimezone}
                                onChange={(val) => {
                                    // Normally we might want to update the view context or just the form's target conversion
                                    toast.success(`Switching view to ${val}`);
                                }}
                            />

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1.5 }}>
                                    <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
                                    <input 
                                        className="input-field" type="date" min={today} required
                                        value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                    <input 
                                        className="input-field" type="time" required
                                        value={editForm.startTime} onChange={e => setEditForm({...editForm, startTime: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1.5 }}>
                                    <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
                                    <input 
                                        className="input-field" type="date" min={editForm.startDate || today} required
                                        value={editForm.endDate} onChange={e => setEditForm({...editForm, endDate: e.target.value})} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                    <input 
                                        className="input-field" type="time" required
                                        value={editForm.endTime} onChange={e => setEditForm({...editForm, endTime: e.target.value})} 
                                    />
                                </div>
                            </div>

                            <Input 
                                id="updatedBy" label="Your Name (Required for Logging)" required
                                value={editForm.updatedBy} onChange={e => setEditForm({...editForm, updatedBy: e.target.value})} 
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="primary" style={{ padding: '0.8rem 2rem' }}>Save Changes</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* View Mode */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-panel">
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                                <div style={{ background: 'var(--primary-color)', color: '#fff', padding: '10px', borderRadius: '12px' }}>
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                        {dayjs(eventData.startTime).tz(viewTimezone).format('dddd, MMMM D, YYYY')}
                                    </p>
                                    <p style={{ fontSize: '1.1rem', color: 'var(--primary-color)', fontWeight: 500 }}>
                                        {dayjs(eventData.startTime).tz(viewTimezone).format('h:mm A')} — {dayjs(eventData.endTime).tz(viewTimezone).format('h:mm A')}
                                    </p>
                                    <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        Viewing in <strong>{viewTimezone}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profiles Box */}
                        <div className="glass-panel">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                                <Users size={20} color="var(--primary-color)" />
                                <h4 style={{ margin: 0, fontWeight: 600 }}>Associated Profiles</h4>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {eventData.profiles?.length > 0 ? (
                                    eventData.profiles.map(pId => {
                                        const p = allProfiles.find(x => x._id === pId);
                                        return (
                                            <div key={pId} style={{ background: 'rgba(0,0,0,0.05)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                {p ? p.name : 'Unknown Profile'}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No profiles linked.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Logs Section */}
                <div style={{ marginTop: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <History size={20} />
                        <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Change History</h2>
                    </div>

                    {logs.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No changes have been made to this event yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {logs.map(log => (
                                <div key={log._id} className="glass-panel" style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{log.updatedBy}</span>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {dayjs(log.timestamp).format('MMM D, YYYY • h:mm A')}
                                        </span>
                                    </div>

                                    <ul style={{ listStylePosition: 'inside', color: 'var(--text-primary)', fontSize: '0.9rem', paddingLeft: '1rem' }}>
                                        {log.changes.map((change, idx) => (
                                            <li key={idx} style={{ marginBottom: '0.4rem' }}>
                                                Changed <strong>{change.field}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
