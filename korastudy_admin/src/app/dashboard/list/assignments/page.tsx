"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableList from "@/components/TableList";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import { useState } from "react";
import useTestSets from "@/hook/useTestSets";

const columns = [
  { header: "Test Name", accessor: "testName" },
  { header: "Description", accessor: "description" },
  { header: "Listening Score", accessor: "listeningScore" },
  { header: "Reading Score", accessor: "readingScore" },
  { header: "Total Questions", accessor: "totalQuestion" },
  { header: "Total Score", accessor: "totalScore" },
  { header: "Created At", accessor: "createdAt" },
  { header: "Action", accessor: "action" },
];

interface Question {
  id: string;
  questionText: string;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correctAnswer: string;
  score: number;
  order: number;
}

interface QuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  audioUrl: string | null;
}

const QuestionsModal = ({
  isOpen,
  onClose,
  questions,
  audioUrl,
}: QuestionsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md w-1/2 max-h-full overflow-y-auto">
        <h2 className="text-lg font-semibold">Questions</h2>
        {audioUrl && (
          <div className="mb-4">
            <strong>Audio URL:</strong>{" "}
            <a href={audioUrl} target="_blank" rel="noopener noreferrer">
              {audioUrl}
            </a>
          </div>
        )}
        <ul>
          {questions.map((question) => (
            <li key={question.id} className="mb-2">
              <p>
                <strong>Question Text:</strong> {question.questionText}
              </p>
              <p>
                <strong>Choice A:</strong> {question.choiceA}
              </p>
              <p>
                <strong>Choice B:</strong> {question.choiceB}
              </p>
              <p>
                <strong>Choice C:</strong> {question.choiceC}
              </p>
              <p>
                <strong>Choice D:</strong> {question.choiceD}
              </p>
              <p>
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
              <p>
                <strong>Score:</strong> {question.score}
              </p>
            </li>
          ))}
        </ul>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const TestPage = () => {
  const { testSets, loading, deleteQuestion } = useTestSets();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 7;

  if (loading) {
    return <div>Loading...</div>;
  }

  // Tính toán dữ liệu dựa trên trang hiện tại
  const paginatedData = testSets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(testSets.length / itemsPerPage);

  const renderRow = (item: {
    id: string;
    testName: string;
    description: string;
    listeningScore: number;
    readingScore: number;
    totalQuestion: number;
    totalScore: number;
    createdAt: Date;
  }) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-koraPurpleLight"
    >
      <td className="p-4">{item.testName}</td>
      <td className="p-4">{item.description}</td>
      <td className="p-4">{item.listeningScore}</td>
      <td className="p-4">{item.readingScore}</td>
      <td className="p-4">{item.totalQuestion}</td>
      <td className="p-4">{item.totalScore}</td>
      <td className="p-4">{new Date(item.createdAt).toLocaleString()}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="assignment" type="update" data={item} />
              <FormModal
                table="assignment"
                type="delete"
                id={Number(item.id)}
              />
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => {
                  setSelectedTestId(item.id);
                  setIsModalOpen(true);
                }}
              >
                View Questions
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const selectedTest = testSets.find((test) => test.id === selectedTestId);

  const sortedQuestions = selectedTest
    ? selectedTest.questions
        .map((question) => ({ ...question, score: Number(question.score) }))
        .sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Danh sách bài kiểm tra
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-koraYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-koraYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="assignment" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <TableList columns={columns} renderRow={renderRow} data={paginatedData} />
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {/* QUESTIONS MODAL */}
      <QuestionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        questions={sortedQuestions}
        audioUrl={selectedTest ? selectedTest.audioUrl : null}
      />
    </div>
  );
};

export default TestPage;
