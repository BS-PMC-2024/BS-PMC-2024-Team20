import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { getAuth } from 'firebase/auth';
import { receiveMessages, sendMessage } from '../src/services/auth'; 
import TeacherStudentCom from '../src/components/TeacherToStudentCom'; 

jest.mock('firebase/auth');
jest.mock('../src/services/auth'); 

const mockAuth = {
  currentUser: {
    email: 'teacher@example.com',
  },
};

const mockMessages = [
  {
    id: '1',
    fromUser: 'student1@example.com',
    message: 'Hello, I need help with the assignment.',
    timestamp: { seconds: 1659302400 },
    fromRole: 'student',
  },
  {
    id: '2',
    fromUser: 'student2@example.com',
    message: 'Can you explain the topic again?',
    timestamp: { seconds: 1659388800 },
    fromRole: 'student',
  },
];

describe('TeacherStudentCom', () => {
  beforeEach(() => {
    getAuth.mockReturnValue(mockAuth);
    receiveMessages.mockResolvedValue(mockMessages);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays messages received from students', async () => {
    render(<TeacherStudentCom />);

    // Verify messages are displayed
    await waitFor(() => {
      expect(screen.getByText(/Hello, I need help with the assignment./)).toBeInTheDocument();
      expect(screen.getByText(/Can you explain the topic again?/)).toBeInTheDocument();
    });
  });

  test('allows the teacher to reply to a student\'s message', async () => {
    render(<TeacherStudentCom />);

    // Click reply button for the first message
    const replyButtons = await screen.findAllByText(/Reply/);
    fireEvent.click(replyButtons[0]);

    // Verify reply form is displayed
    await waitFor(() => {
      expect(screen.getByText(/Reply to student1@example.com/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Write your reply here.../)).toBeInTheDocument();
    });

    // Enter a reply message and send it
    const replyTextarea = screen.getByPlaceholderText(/Write your reply here.../);
    fireEvent.change(replyTextarea, { target: { value: 'Sure, I can help you with that.' } });
    fireEvent.click(screen.getByText(/Send Reply/));

    // Verify the sendMessage function is called with the correct arguments
    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith(
        'teacher',
        'teacher@example.com',
        'student',
        'student1@example.com',
        'Sure, I can help you with that.'
      );
    });

    // Verify the status message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Reply sent successfully./)).toBeInTheDocument();
    });
  });

  test('handles cases when the user is not logged in', async () => {
    getAuth.mockReturnValue({ currentUser: null });
    render(<TeacherStudentCom />);

    // Verify status message is displayed
    await waitFor(() => {
      expect(screen.getByText(/You need to be logged in./)).toBeInTheDocument();
    });
  });
});
