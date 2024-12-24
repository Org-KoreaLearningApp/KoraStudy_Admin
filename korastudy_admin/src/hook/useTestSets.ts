import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

type QuestionItem = {
  id: string;
  audioUrl: string | null;
  choiceA: string;
  choiceB: string;
  choiceC: string;
  choiceD: string;
  correctAnswer: string;
  questionText: string;
  questionType: string;
  score: string;
  order: number;
};

type TestSet = {
  id: string;
  testName: string;
  description: string;
  listeningScore: string;
  readingScore: string;
  totalQuestion: string;
  totalScore: number;
  audioUrl: string | null;
  createdAt: Date;
  questions: QuestionItem[];
};

const useTestSets = () => {
  const [testSets, setTestSets] = useState<TestSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestSets = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "testpage"), orderBy("createdAt", "desc"))
        );
        const sets: TestSet[] = [];

        for (const doc of querySnapshot.docs) {
          console.log("Fetched test set document:", doc.data());
          const questionsQuery = query(
            collection(db, "testpage", doc.id, "questions"),
            orderBy("order")
          );
          const questionsSnapshot = await getDocs(questionsQuery);
          const questions: QuestionItem[] = questionsSnapshot.docs.map(
            (questionDoc) => {
              const data = questionDoc.data();
              return {
                id: questionDoc.id,
                audioUrl: data.audioUrl || "default-audio-url",
                choiceA: data.choiceA || "default-choiceA",
                choiceB: data.choiceB || "default-choiceB",
                choiceC: data.choiceC || "default-choiceC",
                choiceD: data.choiceD || "default-choiceD",
                correctAnswer: data.correctAnswer || "default-correctAnswer",
                questionText: data.questionText || "default-questionText",
                questionType: data.questionType || "default-questionType",
                score: data.score || "0",
                order: data.order || 0,
              };
            }
          );

          console.log("Fetched questions for test set:", questions);

          const data = doc.data();
          sets.push({
            id: doc.id,
            testName: data.testName,
            description: data.description,
            listeningScore: data.listeningScore,
            readingScore: data.readingScore,
            totalQuestion: data.totalQuestion,
            totalScore: data.totalScore,
            audioUrl: data.audioUrl || null,
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            questions,
          });
        }

        console.log("Final test sets array:", sets);
        setTestSets(sets);
      } catch (error) {
        console.error("Error fetching test sets: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestSets();
  }, []);

  const deleteQuestion = async (setId: string, questionId: string) => {
    try {
      await deleteDoc(doc(db, "testpage", setId, "questions", questionId));
      setTestSets((prevSets) =>
        prevSets.map((set) =>
          set.id === setId
            ? {
                ...set,
                questions: set.questions.filter(
                  (question) => question.id !== questionId
                ),
              }
            : set
        )
      );
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };

  return { testSets, loading, deleteQuestion };
};

export default useTestSets;
