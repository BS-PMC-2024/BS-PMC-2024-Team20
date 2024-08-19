import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const db = getFirestore(app);

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbackCollection = collection(db, 'feedbackSurvey');
      const feedbackSnapshot = await getDocs(feedbackCollection);
      const feedbackData = feedbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbackList(feedbackData);
    };

    fetchFeedback();
  }, []);

  const handleDeleteFeedback = async (id) => {
    try {
      await deleteDoc(doc(db, 'feedbackSurvey', id));
      setFeedbackList(prevList => prevList.filter(feedback => feedback.id !== id));
      console.log('Feedback successfully deleted.');
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  return (
    <div>
      <h2>User Feedback</h2>
      <ul>
        {feedbackList.map((feedback, index) => (
          <li key={index}>
            <p>{feedback.feedback}</p>
            <button onClick={() => handleDeleteFeedback(feedback.id)}>
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackList;
