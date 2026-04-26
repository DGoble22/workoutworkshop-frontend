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
    thumbnail: '',
  });

  const { token, user } = useContext(AuthContext);
  const [thumbnail, setThumbnail] = useState(null);

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

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
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
    // 1. Create the FormData object
    const formDataToSend = new FormData();

    // 2. Append all text data
    formDataToSend.append('user_id', user.id);
    formDataToSend.append('name', exerciseData.name);
    formDataToSend.append('muscle_group', exerciseData.muscleGroup);
    formDataToSend.append('equipment_needed', exerciseData.equipment);
    formDataToSend.append('video_url', exerciseData.video_url);

    // 3. Append the file if one was selected
    if (thumbnail) {
      formDataToSend.append('thumbnail', thumbnail);
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL;
      const url = exercise
          ? `${apiBase}/admin/exercises/update/${exercise.exercise_id}`
          : `${apiBase}/admin/exercises/add`;

      const response = await fetch(url, {
        method: exercise ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        console.error(`Failed to ${exercise ? 'update' : 'add'} exercise`);
        toast.error(`Failed to ${exercise ? 'update' : 'add'} exercise`);
      } else {
        toast.success(`Exercise ${exercise ? 'edited' : 'added'}!`);
      }
    } catch (error) {
      toast.error(error.message);
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
          <label>
            Thumbnail Image:
            <input
                type="file"
                name="thumbnail_file"
                accept="image/*"
                onChange={handleFileChange}
                required={!exercise}
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
