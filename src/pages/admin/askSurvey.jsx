import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const susQuestions = [
  "1. I think that I would like to use this website frequently.",
  "2. I found the website unnecessarily complex.",
  "3. I thought the website was easy to use.",
  "4. I think that I would need the support of a technical person to be able to use this website.",
  "5. I found the various functions in this website were well integrated."
];

const askSurvey = () => {
  return MySwal.fire({
    title: 'Please answer the following questions',
    html: (
      <div>
        {susQuestions.map((question, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <p>{question}</p>
            <select id={`question${index + 1}`} className="swal2-select">
              <option value="1">1 - Strongly Agree</option>
              <option value="2">2 - Agree</option>
              <option value="3">3 - Neutral</option>
              <option value="4">4 - Disagree</option>
              <option value="5">5 - Strongly Disagree</option>
            </select>
          </div>
        ))}
      </div>
    ),
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Ignore',
    preConfirm: () => {
      const results = susQuestions.map((_, index) => {
        const value = document.getElementById(`question${index + 1}`).value;
        return value;
      });
      return results;
    }
  });
};

export default askSurvey;
