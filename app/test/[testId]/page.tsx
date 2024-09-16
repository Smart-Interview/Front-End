'use client'; // Enforce client-side rendering

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

interface TestResult {
  numberQuestions: number;
  result: number;
}

export default function TestPage({ params }: { params: { testId: string } }) {
  const { testId } = params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ testAnswer: string; candidateAnswer: string }[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // Fetch questions from the API route
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/getQuestions?testId=${testId}`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0 && !isTestCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isTestCompleted) {
      handleSubmitTest(); // Auto-submit when time is up
    }
  }, [timeLeft, isTestCompleted]);

  const handleNextQuestion = () => {
    if (selectedAnswer.trim() === '') {
      alert('Please select an answer before proceeding.');
      return;
    }

    // Save the answer for the current question
    const currentQuestion = questions[currentQuestionIndex];
    const updatedAnswers = [
      ...answers,
      {
        testAnswer: currentQuestion.answer,
        candidateAnswer: selectedAnswer,
      },
    ];

    setAnswers(updatedAnswers);

    // Move to the next question or submit the test
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      handleSubmitTest(updatedAnswers); // Pass updated answers to the submit function
    }
  };

  const handleSubmitTest = async (finalAnswers = answers) => {
    setIsTestCompleted(true);

    // Ensure answers include all questions
    if (finalAnswers.length < questions.length) {
      const remainingQuestions = questions.slice(finalAnswers.length);
      finalAnswers = [
        ...finalAnswers,
        ...remainingQuestions.map((question) => ({
          testAnswer: question.answer,
          candidateAnswer: '', // Empty answers for unanswered questions
        })),
      ];
    }

    try {
      const response = await fetch(`/api/answers/${testId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalAnswers),
      });

      if (response.ok) {
        const result: TestResult = await response.json();
        setTestResult(result); // Save the test result
      } else {
        console.error('Error submitting test:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  if (isTestCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full text-center">
          {testResult ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
              <p className="text-gray-600 mb-4">
                You answered {testResult.numberQuestions} questions, and your score is {testResult.result}.
              </p>
            </>
          ) : (
            <p>Submitting your answers...</p>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-lg font-semibold text-blue-600">
            {formatTime(timeLeft)}
          </span>
        </div>
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          className="mb-6"
        />
        <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          className="space-y-2"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {selectedAnswer === '' && (
          <div className="flex items-center text-yellow-600 mt-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Please select an answer before proceeding.</span>
          </div>
        )}
        <Button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === ''}
          className="w-full mt-6"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit Test' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}