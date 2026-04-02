import React, {useState, useEffect, useContext} from 'react';
import './AdminExerciseModal.css';
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const AdminExerciseModal = ({ show, handleClose, exercise, onExerciseChange }) => {
  const [exerciseData, setExerciseData] = useState({
    name: '',
    equipment: '',
    muscleGroup: '',
    video_url: '',
  });

  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    if (exercise) {
      setExerciseData(exercise);
    }
  }, [exercise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExerciseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AddOrEdit();
    if (onExerciseChange) onExerciseChange();
    handleClose();
  };

  const handleRemove = async () => {
    if (!exercise) return;
    try {
      const apiBase = import.meta.env.VITE_API_URL;
      const url = `${apiBase}/admin/exercises/remove/${exercise.exercise_id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id,}),
      });
      if (!response.ok) {
        console.error('Failed to delete exercise');
      } else {
        toast.success('Exercise deleted!');
        if (onExerciseChange) onExerciseChange();
        handleClose();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!show) return null;

  const AddOrEdit = async () => {
    if (exercise) {
      try {
        const apiBase = import.meta.env.VITE_API_URL;
        const url = `${apiBase}/admin/exercises/update/${exercise.exercise_id}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            name: exerciseData.name,
            muscle_group: exerciseData.muscleGroup,
            equipment_needed: exerciseData.equipment,
            video_url: exerciseData.video_url,
          }),
        });
        if (!response.ok) {
          console.error('Failed to update exercise');
        } else {
          toast.success('Exercise edited!');
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      try {
        const apiBase = import.meta.env.VITE_API_URL;
        const url = `${apiBase}/admin/exercises/add`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            name: exerciseData.name,
            muscle_group: exerciseData.muscleGroup,
            equipment_needed: exerciseData.equipment,
            video_url: exerciseData.video_url,
          }),
        });
        if (!response.ok) {
          console.error('Failed to add exercise');
        } else {
          toast.success('Exercise added!');
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{exercise ? 'Edit Exercise' : 'Create Exercise'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Exercise Name:
            <input
              type="text"
              name="name"
              value={exerciseData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Equipment:
            <select
              name="equipment"
              value={exerciseData.equipment}
              onChange={handleChange}
              required
            >
              <option value="">Select Equipment</option>
              <option value="Free Weight">Free Weight</option>
              <option value="Body Weight">Body Weight</option>
              <option value="Machine">Machine</option>
            </select>
          </label>
          <label>
            Muscle Group:
            <select
              name="muscleGroup"
              value={exerciseData.muscleGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select Muscle Group</option>
              <option value="Arms">Arms</option>
              <option value="Legs">Legs</option>
              <option value="Chest">Chest</option>
              <option value="Back">Back</option>
              <option value="Cardio">Cardio</option>
              <option value="Core">Core</option>
              <option value="Bicep">Bicep</option>
              <option value="Tricep">Tricep</option>
              <option value="Shoulders">Shoulders</option>
              <option value="Forearms">Forearms</option>
              <option value="Abs">Abs</option>
              <option value="Lats">Lats</option>
              <option value="Traps">Traps</option>
              <option value="Lower Back">Lower Back</option>
              <option value="Glutes">Glutes</option>
              <option value="Hamstrings">Hamstrings</option>
              <option value="Quads">Quads</option>
              <option value="Calves">Calves</option>
            </select>
          </label>
          <label>
            Video URL:
            <input
              type="text"
              name="video_url"
              value={exerciseData.video_url}
              onChange={handleChange}
              required
            />
          </label>
          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-button"
            >
              Cancel
            </button>
            {exercise && (
              <button type="button" onClick={handleRemove} className="remove-button">
                Remove
              </button>
            )}
            <button type="submit" className="submit-button">
              {exercise ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminExerciseModal;
