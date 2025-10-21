import React, { useState, useEffect } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useAdmin } from '../contexts/AdminContext';

const EventForm = ({ event = null, onSubmit, onCancel }) => {
  const { addEvent, updateEvent } = useEvents();
  const { showNotification, closeModal } = useAdmin();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    time: '',
    location: '',
    category: 'Conference',
    image: '',
    maxAttendees: 100,
    price: 0,
    speakers: [],
    requireApproval: false,
    isUnlimited: false
  });

  const [newSpeaker, setNewSpeaker] = useState({ name: '', title: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Conference', 'Workshop', 'Seminar', 'Meetup',
    'Webinar', 'Training', 'Networking', 'Other'
  ];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        endDate: event.endDate || '',
        time: event.time || '',
        location: event.location || '',
        category: event.category || 'Conference',
        image: event.image || '',
        maxAttendees: event.maxAttendees || 100,
        price: event.price || 0,
        speakers: event.speakers || [],
        requireApproval: event.requireApproval || false,
        isUnlimited: event.maxAttendees === 0
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;
    
    if (type === 'number') {
      newValue = parseFloat(value) || 0;
    } else if (type === 'checkbox') {
      newValue = checked;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-fill end date if not set
    if (name === 'date' && !formData.endDate) {
      setFormData(prev => ({
        ...prev,
        endDate: value
      }));
    }

    // Handle unlimited capacity
    if (name === 'isUnlimited') {
      setFormData(prev => ({
        ...prev,
        maxAttendees: checked ? 0 : 100
      }));
    }
  };

  const handleSpeakerChange = (e) => {
    const { name, value } = e.target;
    setNewSpeaker(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSpeaker = () => {
    if (newSpeaker.name.trim() && newSpeaker.title.trim()) {
      const speaker = {
        id: Date.now(),
        name: newSpeaker.name.trim(),
        title: newSpeaker.title.trim()
      };
      
      setFormData(prev => ({
        ...prev,
        speakers: [...prev.speakers, speaker]
      }));
      
      setNewSpeaker({ name: '', title: '' });
    }
  };

  const removeSpeaker = (speakerId) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter(speaker => speaker.id !== speakerId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event name is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Event name must be at least 3 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Start date is required';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (eventDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.date && formData.endDate < formData.date) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.isUnlimited && formData.maxAttendees < 1) {
      newErrors.maxAttendees = 'Maximum attendees must be at least 1';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('error', 'Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        maxAttendees: formData.isUnlimited ? 0 : formData.maxAttendees
      };

      let result;
      if (event) {
        result = updateEvent({ ...event, ...submitData });
      } else {
        result = addEvent(submitData);
      }

      if (result.success) {
        showNotification('success', result.message);
        closeModal();
        if (onSubmit) onSubmit(result);
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      showNotification('error', 'An error occurred while saving the event');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeModal();
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="luma-event-form">
      {/* Left Panel - Event Preview */}
      <div className="event-preview-panel">
        <div className="event-preview-image">
          {/* 3D Abstract Elements */}
          <div className="abstract-element element-1"></div>
          <div className="abstract-element element-2"></div>
          <div className="abstract-element element-3"></div>
          <div className="abstract-element element-4"></div>
          <div className="abstract-element element-5"></div>
          
          {/* Central Eye Element */}
          <div className="central-element">
            <div className="eye-outer">
              <div className="eye-inner"></div>
            </div>
          </div>
        </div>
        
        <div className="event-preview-content">
          <h3 className="preview-title">
            {formData.title || 'Event Name'}
          </h3>
          <p className="preview-details">
            {formData.date && formData.endDate ? (
              formData.date === formData.endDate 
                ? formatDateForDisplay(formData.date)
                : `${formatDateForDisplay(formData.date)} - ${formatDateForDisplay(formData.endDate)}`
            ) : 'Select dates'}
            {formData.location && ` • ${formData.location}`}
          </p>
          <p className="preview-meta">
            {formData.category} • {formData.isUnlimited ? 'Unlimited' : formData.maxAttendees} attendees
          </p>
        </div>
        
        <div className="event-theme-section">
          <span className="theme-label">Theme</span>
          <span className="theme-value">Minimal</span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="event-form-panel">
        <form onSubmit={handleSubmit}>
          {/* Event Name */}
          <div className="form-field title-field">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Event Name"
              className={`title-input ${errors.title ? 'error' : ''}`}
              maxLength="100"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Start Date & Time */}
          <div className="form-field date-field">
            <div className="field-icon"></div>
            <div className="field-content">
              <label className="field-label">Start</label>
              <div className="date-time-row">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`date-input ${errors.date ? 'error' : ''}`}
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`time-input ${errors.time ? 'error' : ''}`}
                />
                <div className="timezone-display">
                  <span className="timezone-text">GMT+03:00</span>
                  <span className="timezone-city">Amman</span>
                </div>
              </div>
              {errors.date && <span className="error-message">{errors.date}</span>}
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          {/* End Date */}
          <div className="form-field date-field">
            <div className="field-icon"></div>
            <div className="field-content">
              <label className="field-label">End</label>
              <div className="date-time-row">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`date-input ${errors.endDate ? 'error' : ''}`}
                />
              </div>
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </div>

          {/* Location */}
          <div className="form-field location-field">
            <div className="field-icon location-icon"></div>
            <div className="field-content">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Add Event Location"
                className={`location-input ${errors.location ? 'error' : ''}`}
              />
              <span className="field-helper">Offline location or virtual link</span>
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="form-field description-field">
            <div className="field-icon description-icon"></div>
            <div className="field-content">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add Description"
                className={`description-input ${errors.description ? 'error' : ''}`}
                rows="3"
                maxLength="500"
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          {/* Speakers */}
          <div className="form-field speakers-field">
            <div className="field-icon speakers-icon"></div>
            <div className="field-content">
              <div className="speakers-header">
                <span className="field-placeholder">Add Speakers</span>
                <span className="field-helper">Event presenters and hosts</span>
              </div>
              
              {formData.speakers.length > 0 && (
                <div className="speakers-list">
                  {formData.speakers.map(speaker => (
                    <div key={speaker.id} className="speaker-item">
                      <div className="speaker-info">
                        <span className="speaker-name">{speaker.name}</span>
                        <span className="speaker-title">{speaker.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpeaker(speaker.id)}
                        className="remove-speaker-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="add-speaker-form">
                <input
                  type="text"
                  name="name"
                  value={newSpeaker.name}
                  onChange={handleSpeakerChange}
                  placeholder="Speaker name"
                  className="speaker-name-input"
                />
                <input
                  type="text"
                  name="title"
                  value={newSpeaker.title}
                  onChange={handleSpeakerChange}
                  placeholder="Speaker title"
                  className="speaker-title-input"
                />
                <button
                  type="button"
                  onClick={addSpeaker}
                  disabled={!newSpeaker.name.trim() || !newSpeaker.title.trim()}
                  className="add-speaker-btn"
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Event Options */}
          <div className="form-section">
            <h4 className="section-title">Event Options</h4>

            {/* Tickets/Price */}
            <div className="form-field option-field">
              <div className="field-icon ticket-icon"></div>
              <div className="field-content">
                <span className="option-label">Tickets</span>
                <div className="option-controls">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="price-input"
                  />
                  <span className="price-label">{formData.price > 0 ? `$${formData.price}` : 'Free'}</span>
                </div>
              </div>
            </div>

            {/* Require Approval */}
            <div className="form-field option-field">
              <div className="field-icon approval-icon"></div>
              <div className="field-content">
                <span className="option-label">Require Approval</span>
                <div className="option-controls">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="requireApproval"
                      checked={formData.requireApproval}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="form-field option-field">
              <div className="field-icon capacity-icon"></div>
              <div className="field-content">
                <span className="option-label">Capacity</span>
                <div className="option-controls">
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.isUnlimited ? '' : formData.maxAttendees}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="1"
                    max="10000"
                    disabled={formData.isUnlimited}
                    className="capacity-input"
                  />
                  <span className="capacity-label">
                    {formData.isUnlimited ? 'Unlimited' : `${formData.maxAttendees} people`}
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="isUnlimited"
                      checked={formData.isUnlimited}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                {errors.maxAttendees && <span className="error-message">{errors.maxAttendees}</span>}
              </div>
            </div>

            {/* Category */}
            <div className="form-field option-field">
              <div className="field-icon category-icon"></div>
              <div className="field-content">
                <span className="option-label">Category</span>
                <div className="option-controls">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="category-select"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="create-event-btn"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {event ? 'Updating Event...' : 'Creating Event...'}
              </>
            ) : (
              event ? 'Update Event' : 'Create Event'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;