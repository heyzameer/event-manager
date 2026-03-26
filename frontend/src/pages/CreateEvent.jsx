import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';
import toast from 'react-hot-toast';
import { fetchEventsForProfile } from '../store/eventsSlice';

export default function CreateEvent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedProfileId } = useSelector(state => state.profiles);
    const { viewTimezone } = useSelector(state => state.events);

    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        endTime: '',
        createdBy: ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProfileId) {
            toast.error('Please select a profile first!');
            return;
        }

        try {
            // Send the request. We attach the currently selected timezone so the backend knows how to convert the local time!
            await api.post('/events', {
                title: formData.title,
                profiles: [selectedProfileId],
                timezone: viewTimezone,
                // Convert the HTML local datetime string into a proper JS Date ISO string before sending
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString(),
                createdBy: formData.createdBy
            });

            toast.success('Event created successfully!');

            // Refresh the events list globally
            dispatch(fetchEventsForProfile({ profileId: selectedProfileId, timezone: viewTimezone }));

            // Go back to the dashboard
            navigate('/');
        } catch (err) { }
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
                            <div style={{ flex: 1 }}>
                                <Input
                                    id="startTime" type="datetime-local" label={`Start Time (${viewTimezone})`} required
                                    value={formData.startTime} onChange={handleChange}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input
                                    id="endTime" type="datetime-local" label={`End Time (${viewTimezone})`} required
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
