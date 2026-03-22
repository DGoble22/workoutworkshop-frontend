import React from "react";

// Days of week options
const DOW_OPTIONS = ["M", "T", "W", "TH", "F", "SAT", "SUN"];

// default slot
function createDefaultSlot(dow) {
  return {
    dow,
    start_time: "09:00",
    end_time: "17:00",
  };
}

// forces HH:MM format
function normalizeTime(value) {
  if (!value) return "";
  return value.length === 5 ? value : value.slice(0, 5);
}

// Component for editing coach availability
export default function CoachAvailabilityEditor({ value = [], onChange, disabled = false }) {
    const slots = Array.isArray(value) ? value : [];
  const getSlotForDay = (dow) => slots.find((s) => s?.dow === dow);
  const isDayActive = (dow) => !!getSlotForDay(dow);

  // Toggle a day on/off in the availability grid
  const toggleDay = (dow) => {
    if (disabled) return;
    const existing = getSlotForDay(dow);
    if (existing) {
      onChange(slots.filter((s) => s?.dow !== dow));
      return;
    }
    onChange([...slots, createDefaultSlot(dow)]);
  };

  // Update the time slot for a specific day
  const updateDaySlot = (dow, patch) => {
    const next = slots.map((slot) => (slot.dow === dow ? { ...slot, ...patch } : slot));
    onChange(next);
  };

  return (
    <div className="availability-editor">
        {/* ui for toggling active days */}
      <div className="availability-day-grid">
        {DOW_OPTIONS.map((dow) => (
          <button key={dow} type="button" className={`availability-day-btn ${isDayActive(dow) ? "is-active" : ""}`} onClick={() => toggleDay(dow)} disabled={disabled}>
            {dow}
          </button>
        ))}
      </div>

        {/* ui for editing time slots of active days */}
      <div className="availability-slots-list">
        {DOW_OPTIONS.filter((dow) => isDayActive(dow)).map((dow) => {
          const slot = getSlotForDay(dow);
          const invalidRange = slot?.start_time && slot?.end_time && slot.start_time >= slot.end_time;
          return (
            <div key={`slot-${dow}`} className="availability-row">
              <div className="availability-row-day">{dow}</div>
              <input type="time" value={normalizeTime(slot?.start_time)} onChange={(e) => updateDaySlot(dow, { start_time: e.target.value })} disabled={disabled} aria-label={`${dow} start time`}/>
              <input type="time" value={normalizeTime(slot?.end_time)} onChange={(e) => updateDaySlot(dow, { end_time: e.target.value })} disabled={disabled} aria-label={`${dow} end time`}/>
              {invalidRange && <div className="availability-row-error">End time must be after start time.</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
