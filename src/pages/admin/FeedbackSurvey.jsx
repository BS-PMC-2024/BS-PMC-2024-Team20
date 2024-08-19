import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import Swal from 'sweetalert2';

const db = getFirestore(app);

const FeedbackSurvey = () => {
  const [feedback, setFeedback] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (input.length <= 100) {
      setFeedback(input);
      setCharCount(input.length);
    }
  };

  const handleSubmit = async () => {
    if (feedback.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter your feedback before submitting!',
      });
      return;
    }

    try {
      await addDoc(collection(db, 'feedbackSurvey'), {
        feedback,
        timestamp: new Date(),
      });
      Swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: 'Your feedback has been submitted.',
      });
      setFeedback('');
      setCharCount(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was a problem submitting your feedback. Please try again later.',
      });
    }
  };

  return (
    <div>
      <h2>User Feedback Survey</h2>
      <textarea
        value={feedback}
        onChange={handleInputChange}
        placeholder="Write your feedback here (up to 100 characters)..."
        maxLength="100"
        style={{ width: '100%', height: '100px' }}
      />
      <div>
        <small>{charCount}/100 characters</small>
      </div>
      <button onClick={handleSubmit}>Submit Feedback</button>
    </div>
  );
};

export default FeedbackSurvey;
