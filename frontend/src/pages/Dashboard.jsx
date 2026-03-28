import { useEffect, useState, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfiles, setSelectedProfile, createProfileThunk } from '../store/profilesSlice';
import { fetchEventsForProfile, setViewTimezone, createEventThunk, updateEventThunk } from '../store/eventsSlice';
import EventCard from '../components/EventCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import SearchableSelect from '../components/SearchableSelect';
import MultiSelect from '../components/MultiSelect';
import api from '../services/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { ENDPOINTS } from '../config/endpoints';
import { STANDARD_TIMEZONES } from '../config/timezones';
import { Search } from 'lucide-react';

// Memoized EventCard to avoid unnecessary re-renders
const MemoizedEventCard = memo(EventCard);

export default function Dashboard() {
    const dispatch = useDispatch();

    const { list: profiles, selectedProfileId } = useSelector(state => state.profiles);
    const { list: events, viewTimezone, loading: eventsLoading, pagination } = useSelector(state => state.events);

    const [page, setPage] = useState(1);
    const limit = 5;

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');

    // Action Modals State
    const [activeEvent, setActiveEvent] = useState(null);
    const [modalMode, setModalMode] = useState(null); // edit, logs, participants
    const [editForm, setEditForm] = useState({ 
        title: '', 
        startDate: '', 
        startTime: '', 
        endDate: '', 
        endTime: '', 
        profileIds: [], 
        referenceTimezone: 'UTC',
        updatedBy: '' 
    });
    const [eventLogs, setEventLogs] = useState([]);
    const [logSearch, setLogSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Check if Edit Form has actual changes
    const hasEditChanges = useMemo(() => {
        if (!activeEvent || modalMode !== 'edit') return false;

        const currentProfiles = activeEvent.profiles?.map(p => p._id || p.id || p) || [];
        const profilesChanged = JSON.stringify([...currentProfiles].sort()) !== JSON.stringify([...editForm.profileIds].sort());

        const refTZ = activeEvent.timezone || viewTimezone;
        const tzChanged = editForm.referenceTimezone !== refTZ;

        const originalStartStr = dayjs.utc(activeEvent.startTime).tz(refTZ).format('YYYY-MM-DDTHH:mm');
        const newStartStr = `${editForm.startDate}T${editForm.startTime}`;
        
        const originalEndStr = dayjs.utc(activeEvent.endTime).tz(refTZ).format('YYYY-MM-DDTHH:mm');
        const newEndStr = `${editForm.endDate}T${editForm.endTime}`;

        return editForm.title !== activeEvent.title ||
            profilesChanged ||
            tzChanged ||
            originalStartStr !== newStartStr ||
            originalEndStr !== newEndStr;
    }, [editForm, activeEvent, modalMode, viewTimezone]);

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(logSearch), 300);
        return () => clearTimeout(timer);
    }, [logSearch]);

    // Memoized Participant Filtering (O(n))
    const filteredParticipants = useMemo(() => {
        if (!activeEvent || modalMode !== 'participants') return [];
        return activeEvent.profiles
            .map(pOrId => {
                if (pOrId?.name) return pOrId;
                return profiles.find(p => (p._id?.toString() === pOrId?.toString()) || (p.id?.toString() === pOrId?.toString()));
            })
            .filter(p => p && p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }, [activeEvent, modalMode, profiles, debouncedSearch]);

    // Creation Form State
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        profileIds: [],
        creationTimezone: STANDARD_TIMEZONES.find(t => t.zone === Intl.DateTimeFormat().resolvedOptions().timeZone)?.zone || 'Etc/GMT',
        createdBy: ''
    });

    const today = dayjs().tz(formData.creationTimezone).format('YYYY-MM-DD');

    useEffect(() => {
        dispatch(fetchProfiles());
    }, [dispatch]);

    useEffect(() => {
        if (selectedProfileId) {
            dispatch(fetchEventsForProfile({ profileId: selectedProfileId, timezone: viewTimezone, page, dispatch }));
            
            const profile = profiles.find(p => (p._id || p.id) === selectedProfileId);
            if (profile) {
                // eslint-disable-next-line
                setFormData(prev => ({ ...prev, createdBy: profile.name }));
            }
        }
    }, [selectedProfileId, viewTimezone, page, dispatch, profiles]);

    const handleCreateProfile = async (e) => {
        if (e) e.preventDefault();
        if (!newProfileName) return;
        try {
            const res = await dispatch(createProfileThunk({ name: newProfileName })).unwrap();
            dispatch(fetchProfiles());
            dispatch(setSelectedProfile(res.id || res._id));
            setNewProfileName('');
            setIsProfileModalOpen(false);
            toast.success('Profile created!');
        } catch {
            // Error managed by global interceptor
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (formData.profileIds.length === 0) {
            toast.error('Please select at least one participant!');
            return;
        }
        if (!formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime || !formData.createdBy) {
            toast.error('Please fill in all event fields including "Created By"');
            return;
        }

        const startLocal = `${formData.startDate}T${formData.startTime}`;
        const endLocal = `${formData.endDate}T${formData.endTime}`;

        if (dayjs(endLocal).isBefore(dayjs(startLocal)) || dayjs(endLocal).isSame(dayjs(startLocal))) {
            toast.error('End time must be after start time');
            return;
        }

        try {
            await dispatch(createEventThunk({
                title: formData.title,
                profiles: formData.profileIds,
                timezone: formData.creationTimezone,
                startTime: startLocal,
                endTime: endLocal,
                createdBy: formData.createdBy
            })).unwrap();
            toast.success('Event created successfully!');
            setFormData({ ...formData, title: '', startDate: '', startTime: '', endDate: '', endTime: '', profileIds: [] });
            if (selectedProfileId) dispatch(fetchEventsForProfile({ profileId: selectedProfileId, timezone: viewTimezone, page: 1, limit }));
        } catch {
            // Handled or ignored
        }
    };

    const openActionModal = async (event, mode) => {
        setActiveEvent(event);
        setModalMode(mode);
        if (mode === 'edit') {
            const refTZ = event.timezone || viewTimezone;
            const currentProfile = profiles.find(p => (p._id || p.id) === selectedProfileId);
            setEditForm({
                title: event.title,
                startDate: dayjs.utc(event.startTime).tz(refTZ).format('YYYY-MM-DD'),
                startTime: dayjs.utc(event.startTime).tz(refTZ).format('HH:mm'),
                endDate: dayjs.utc(event.endTime).tz(refTZ).format('YYYY-MM-DD'),
                endTime: dayjs.utc(event.endTime).tz(refTZ).format('HH:mm'),
                profileIds: event.profiles?.map(p => p._id || p.id || p) || [],
                referenceTimezone: refTZ,
                updatedBy: currentProfile?.name || ''
            });
        } else if (mode === 'logs') {
            try {
                const res = await api.get(ENDPOINTS.EVENT_LOGS(event._id), {
                    params: { timezone: viewTimezone }
                });
                setEventLogs(res.data || []);
            } catch {
            // Handled or ignored
            }
        }
    };
    // Re-fetch logs if viewTimezone changes while modal is open
    useEffect(() => {
        if (modalMode === 'logs' && activeEvent) {
            const fetchLogs = async () => {
                try {
                    const res = await api.get(ENDPOINTS.EVENT_LOGS(activeEvent._id), {
                        params: { timezone: viewTimezone }
                    });
                    setEventLogs(res.data || []);
                } catch {
                    // Handled or ignored
                }
            };
            fetchLogs();
        }
    }, [viewTimezone, modalMode, activeEvent]);

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!editForm.updatedBy) {
            toast.error('Please specify who is updating this event');
            return;
        }

        const startLocal = `${editForm.startDate}T${editForm.startTime}`;
        const endLocal = `${editForm.endDate}T${editForm.endTime}`;

        if (new Date(endLocal) <= new Date(startLocal)) {
            toast.error('End time must be after start time');
            return;
        }

        try {
            await dispatch(updateEventThunk({
                id: activeEvent._id,
                eventData: {
                    title: editForm.title,
                    startTime: startLocal,
                    endTime: endLocal,
                    profiles: editForm.profileIds,
                    timezone: editForm.referenceTimezone,
                    updatedBy: editForm.updatedBy
                }
            })).unwrap();
            toast.success('Event updated!');
            setModalMode(null);
            if (selectedProfileId) dispatch(fetchEventsForProfile({ profileId: selectedProfileId, timezone: viewTimezone, page, limit }));
        } catch {
            // Handled or ignored
        }
    };

    return (
        <div className="dashboard-container">

            <header className="dashboard-header">
                <div>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>Event Management</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Create and manage events across multiple timezones</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>
                    <SearchableSelect
                        placeholder="Search & Select Profile..."
                        options={profiles.map(p => p.name)}
                        value={profiles.find(p => (p._id || p.id) === selectedProfileId)?.name || ''}
                        onChange={(name) => {
                            const p = profiles.find(x => x.name === name);
                            if (p) {
                                dispatch(setSelectedProfile(p._id || p.id));
                                setPage(1);
                                setFormData(prev => ({ ...prev, createdBy: p.name }));
                            }
                        }}
                    />
                    <Button variant="primary" style={{ width: '100%', padding: '0.6rem' }} onClick={() => setIsProfileModalOpen(true)}>
                        + Add Profile
                    </Button>
                </div>
            </header>

            <div className="dashboard-grid">

                {/* Left Column: Create Event */}
                <div className="glass-panel" style={{ height: '780px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 600 }}>Create Event</h3>

                    <form onSubmit={handleCreateEvent}>
                        <Input
                            id="title" label="Event Title" required
                            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Weekly Sync"
                        />

                        <MultiSelect
                            label="Participants"
                            options={profiles}
                            selectedIds={formData.profileIds}
                            onChange={(ids) => setFormData({ ...formData, profileIds: ids })}
                            onAddProfile={() => setIsProfileModalOpen(true)}
                        />

                        <SearchableSelect
                            label="Reference Timezone"
                            options={STANDARD_TIMEZONES.map(t => t.label)}
                            value={STANDARD_TIMEZONES.find(t => t.zone === formData.creationTimezone)?.label || ''}
                            onChange={(label) => {
                                const tz = STANDARD_TIMEZONES.find(t => t.label === label);
                                if (tz) setFormData({ ...formData, creationTimezone: tz.zone });
                            }}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ flex: 1.5 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
                                <input
                                    className="input-field" type="date" min={today} required
                                    value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                <input
                                    className="input-field" type="time" required
                                    value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ flex: 1.5 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
                                <input
                                    className="input-field" type="date" min={formData.startDate || today} required
                                    value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                <input
                                    className="input-field" type="time" required
                                    value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Creating as: <strong style={{ color: 'var(--primary-color)' }}>{formData.createdBy || 'No profile selected'}</strong>
                        </div>

                        <Button 
                            type="submit" 
                            variant="primary" 
                            style={{ width: '100%', marginTop: 'auto', padding: '1rem', fontSize: '1rem' }}
                            disabled={!formData.title || formData.profileIds.length === 0}
                        >
                            + Create Event
                        </Button>
                    </form>
                </div>

                {/* Right Column: Events List */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '780px' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 600 }}>Active Events</h3>

                    {/* Sticky Timezone Selector */}
                    <div className="sticky-timezone-header">
                        <SearchableSelect
                            label="View in Timezone"
                            options={STANDARD_TIMEZONES.map(t => t.label)}
                            value={STANDARD_TIMEZONES.find(t => t.zone === viewTimezone)?.label || ''}
                            onChange={(label) => {
                                const tz = STANDARD_TIMEZONES.find(t => t.label === label);
                                if (tz) {
                                    dispatch(setViewTimezone(tz.zone));
                                    setPage(1);
                                }
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', marginTop: '1rem' }}>
                        {eventsLoading ? (
                            <p style={{ color: 'var(--text-secondary)' }}>Loading events...</p>
                        ) : events.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {events.map(event => (
                                    <MemoizedEventCard
                                        key={event._id}
                                        event={event}
                                        profiles={profiles}
                                        viewTimezone={viewTimezone}
                                        onClick={() => openActionModal(event, 'participants')}
                                        onEdit={() => openActionModal(event, 'edit')}
                                        onViewLogs={() => openActionModal(event, 'logs')}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    {profiles.length === 0 ? 'Create a profile to get started' :
                                        !selectedProfileId ? 'Select a profile to view events' :
                                            'No events found for this profile'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {pagination?.totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: 'auto' }}>
                            <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                ← Prev
                            </Button>
                            <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Page {page} of {pagination.totalPages}</span>
                            <Button variant="secondary" onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                Next →
                            </Button>
                        </div>
                    )}
                </div>

            </div>

            {/* Profile Modal */}
            <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Create New Profile">
                <form onSubmit={handleCreateProfile}>
                    <Input label="Name" placeholder="e.g. Global Team" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} autoFocus />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                        <Button type="button" variant="secondary" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Create</Button>
                    </div>
                </form>
            </Modal>

            {/* Action Modal (Edit / Logs / Participants) */}
            <Modal
                isOpen={!!modalMode}
                onClose={() => setModalMode(null)}
                title={modalMode === 'edit' ? 'Edit Event' : modalMode === 'logs' ? 'Change History' : `Event Participants (${activeEvent?.profiles?.length || 0})`}
            >
                {modalMode === 'participants' && activeEvent && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            <input
                                className="input-field"
                                style={{ paddingLeft: '38px' }}
                                placeholder="Search participants..."
                                value={logSearch}
                                onChange={(e) => setLogSearch(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '150px' }}>
                            {filteredParticipants.length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No participants found.</p>
                            ) : (
                                filteredParticipants.map(p => (
                                    <div key={p._id || p.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.4)' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {(p.name || 'U')[0].toUpperCase()}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{p.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {modalMode === 'logs' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                        {eventLogs.length === 0 ? (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No changes logged yet.</p>
                        ) : (
                            eventLogs.map(log => (
                                <div key={log._id} className="glass-panel" style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <strong style={{ color: 'var(--primary-color)' }}>{log.updatedBy}</strong>
                                        <span style={{ opacity: 0.6 }}>{dayjs.utc(log.timestamp).tz(viewTimezone).format('MMM D, h:mm A')}</span>
                                    </div>
                                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                        {log.changes.map((c, i) => (
                                            <li key={i}>
                                                Changed <strong>{c.field}</strong>
                                                {c.field === 'profiles' && (
                                                    <span style={{ color: 'var(--primary-color)', marginLeft: '4px', fontWeight: 600 }}>
                                                        : {c.newValue}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {modalMode === 'edit' && (
                    <form onSubmit={handleUpdateEvent}>
                        <Input label="Title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                        <MultiSelect label="Participants" options={profiles} selectedIds={editForm.profileIds} onChange={ids => setEditForm({ ...editForm, profileIds: ids })} onAddProfile={() => setIsProfileModalOpen(true)} />
                        
                        <SearchableSelect 
                            label="Reference Timezone"
                            options={STANDARD_TIMEZONES.map(t => t.label)}
                            value={STANDARD_TIMEZONES.find(t => t.zone === editForm.referenceTimezone)?.label || ''}
                            onChange={(label) => {
                                const tz = STANDARD_TIMEZONES.find(t => t.label === label);
                                if (tz) {
                                    setEditForm(prev => ({
                                        ...prev, 
                                        referenceTimezone: tz.zone,
                                    }));
                                }
                            }}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ flex: 1.5 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
                                <input className="input-field" type="date" min={today} required value={editForm.startDate} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                <input className="input-field" type="time" required value={editForm.startTime} onChange={e => setEditForm({ ...editForm, startTime: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ flex: 1.5 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
                                <input className="input-field" type="date" min={editForm.startDate || today} required value={editForm.endDate} onChange={e => setEditForm({ ...editForm, endDate: e.target.value })} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                <input className="input-field" type="time" required value={editForm.endTime} onChange={e => setEditForm({ ...editForm, endTime: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Updating as: <strong style={{ color: 'var(--primary-color)' }}>{editForm.updatedBy || 'Active Profile'}</strong>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <Button type="button" variant="secondary" onClick={() => setModalMode(null)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={!hasEditChanges}>Save Changes</Button>
                        </div>
                    </form>
                )}
            </Modal>

        </div>
    );
}
