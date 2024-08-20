import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // שליחת בקשה לשרת שבו APIChat מאזין.

import '../../styles/CustomSurvey.css';

const Survey = () => {
    const [surveyResponses, setSurveyResponses] = useState({
        question1: 0,
        question2: 0,
        question3: 0,
        openEnded: ''
    });

    const [aiResponse, setAiResponse] = useState(''); 
    const [loading, setLoading] = useState(false); // סטייט לחיווי טעינה

    const sliderLabels = {
        question1: ["Poor Focus", "Excellent Focus"],
        question2: ["Poor Time Management", "Excellent Time Management"],
        question3: ["Easily Distracted", "Rarely Distracted"]
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSurveyResponses({
            ...surveyResponses,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // התחלת טעינה
        try {
            const response = await axios.post('http://localhost:3002/api/getSurveyTipsFromGPT', surveyResponses);
            if (response.status === 200) {
                console.log('Received message object:', response.data.gptResponse); // בדיקה שהתגובה נכונה
                setAiResponse(response.data.gptResponse); // עדכון תשובת ה-AI ב-state
            } else {
                console.error('Unexpected response status:', response.status);
            }
        } catch (error) {
            console.error('Error fetching GPT response:', error);
        } finally {
            setLoading(false); // סיום טעינה
        }
    };

    return (
        <div className="survey-container">
            <h1 style={{ textAlign: 'center' }}>Student Learning Survey</h1>
            <p style={{ textAlign: 'center', marginBottom: '50px' }}>
                Based on the answer of this survey, I will give you some tips to start:
            </p>
        
            <form onSubmit={handleSubmit}>
                <div className="survey-question" data-question-number="1">
                    <label><i className="fas fa-brain"></i> How do you rate your focus during study sessions?</label>
                    <div className="slider-container">
                        <span>{sliderLabels.question1[0]}</span>
                        <input type="range" name="question1" min="1" max="5" value={surveyResponses.question1} onChange={handleChange} />
                        <span>{sliderLabels.question1[1]}</span>
                    </div>
                </div>
                <div className="survey-question" data-question-number="2">
                    <label><i className="fas fa-clock"></i> How do you rate your time management skills?</label>
                    <div className="slider-container">
                        <span>{sliderLabels.question2[0]}</span>
                        <input type="range" name="question2" min="1" max="5" value={surveyResponses.question2} onChange={handleChange} />
                        <span>{sliderLabels.question2[1]}</span>
                    </div>
                </div>
                <div className="survey-question" data-question-number="3">
                    <label><i className="fas fa-tasks"></i> How often do you get distracted during studies?</label>
                    <div className="slider-container">
                        <span>{sliderLabels.question3[0]}</span>
                        <input type="range" name="question3" min="1" max="5" value={surveyResponses.question3} onChange={handleChange} />
                        <span>{sliderLabels.question3[1]}</span>
                    </div>
                </div>
                <div className="survey-question" data-question-number="4">
                    <label><i className="fas fa-pencil-alt"></i> Tell me about you: (max 100 characters):</label>
                    <input type="text" name="openEnded" maxLength="100" value={surveyResponses.openEnded} onChange={handleChange} />
                </div>
                <button type="submit" disabled={loading}>Finish Survey</button> {/* כפתור נטרל בזמן טעינה */}
            </form>

            {loading && <div className="loading-spinner"></div>} {/* סמן טעינה */}
            
            <div className="ai-response">
                <h3>Answer From Ai:</h3>
                <textarea 
                    id="aiResponse" 
                    name="aiResponse" 
                    placeholder="Here will be the AI's response based on your survey answers."
                    value={aiResponse} 
                    readOnly
                />
            </div>

            {/* כפתור ניווט שמופיע רק אם יש תשובה מ-GPT */}
            {aiResponse && !loading && (
                <button onClick={() => navigate('/student/dashboard')}>
                    Go to Dashboard
                </button>
            )}
        </div>
    );
};

export default Survey;
