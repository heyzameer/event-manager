import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';
import toast from 'react-hot-toast';
import { fetchEventsForProfile, createEventThunk } from '../store/eventsSlice';
import dayjs from 'dayjs';

export default function CreateEvent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedProfileId } = useSelector(state => state.profiles);
    const { viewTimezone } = useSelector(state => state.events);

    const [formData, setFormData] = useState({
        title: '',
        startDate: dayjs().tz(viewTimezone).format('YYYY-MM-DD'),
        startTime: dayjs().tz(viewTimezone).format('HH:mm'),
        endDate: dayjs().tz(viewTimezone).add(1, 'hour').format('YYYY-MM-DD'),
        endTime: dayjs().tz(viewTimezone).add(1, 'hour').format('HH:mm'),
        createdBy: ''
    });

    const today = dayjs().tz(viewTimezone).format('YYYY-MM-DD');

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProfileId) {
            toast.error('Please select a profile first!');
            return;
        }

        const startLocal = `${formData.startDate}T${formData.startTime}`;
        const endLocal = `${formData.endDate}T${formData.endTime}`;

        if (new Date(endLocal) <= new Date(startLocal)) {
            toast.error('End time must be after start time');
            return;
        }

        try {
            await dispatch(createEventThunk({
                title: formData.title,
                profiles: [selectedProfileId],
                timezone: viewTimezone,
                startTime: startLocal,
                endTime: endLocal,
                createdBy: formData.createdBy
            })).unwrap();

            toast.success('Event created successfully!');

            // Refresh the events list globally
            dispatch(fetchEventsForProfile({ profileId: selectedProfileId, timezone: viewTimezone }));

            // Go back to the dashboard
            navigate('/');
        } catch {
            // Error is handled by toast
        }
    };

    return (
        <div>
            <Navbar />
            <main style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 2rem' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Button variant="secondary" onClick={() => navigate('/')}>&larr; Back</Button>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Create Event</h1>
                </div>

                <div className="glass-panel">
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="title" label="Event Title" required
                            value={formData.title} onChange={handleChange} placeholder="e.g. Weekly Standup"
                        />

                        <Input
                            id="createdBy" label="Your Name (Created By)" required
                            value={formData.createdBy} onChange={handleChange} placeholder="e.g. Alice"
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1.5 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
                                <input 
                                    className="input-field" type="date" required id="startDate" min={today}
                                    value={formData.startDate} onChange={handleChange} 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                <input 
                                    className="input-field" type="time" required id="startTime"
                                    value={formData.startTime} onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ flex: 1.5 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
                                <input 
                                    className="input-field" type="date" required id="endDate" min={formData.startDate || today}
                                    value={formData.endDate} onChange={handleChange} 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Time</label>
                                <input 
                                    className="input-field" type="time" required id="endTime"
                                    value={formData.endTime} onChange={handleChange} 
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}>
                            Create Event
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}
