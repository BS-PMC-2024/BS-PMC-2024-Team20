import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CustomSurvey.css';

const Survey = () => {
    const [surveyResponses, setSurveyResponses] = useState({
        question1: 0,
        question2: 0,
        question3: 0,
        openEnded: ''
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save the surveyResponses to the database
        // Redirect to the homepage after submission
        navigate('/studentDashboard');
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
                <button type="submit">Finish Survey</button>
            </form>
            
            <div className="ai-response">
                <h3>Answer From Ai:</h3>
                <textarea 
                    id="aiResponse" 
                    name="aiResponse" 
                    placeholder="Here will be the AI's response based on your survey answers.">
                </textarea>
            </div>
        </div>
    );
};

export default Survey;
