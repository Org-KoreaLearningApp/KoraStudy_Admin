// src/hooks/useVocabularySets.ts
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

type VocabularyItem = {
  id: string;
  word: string;
  meaning: string;
  url: string;
  createdAt: any;
};

type VocabularySet = {
  id: string;
  name: string;
  topikLevel: string;
  vocabularies: VocabularyItem[];
};

const useVocabularySets = () => {
  const [vocabularySets, setVocabularySets] = useState<VocabularySet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVocabularySets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vocabulary_sets"));
        const sets: VocabularySet[] = [];

        for (const doc of querySnapshot.docs) {
          const vocabulariesSnapshot = await getDocs(collection(db, "vocabulary_sets", doc.id, "vocabularies"));
          const vocabularies: VocabularyItem[] = vocabulariesSnapshot.docs.map((vocabDoc) => ({
            id: vocabDoc.id,
            word: vocabDoc.data().word,
            meaning: vocabDoc.data().meaning,
            url: vocabDoc.data().url,
            createdAt: vocabDoc.data().createdAt.toDate(),
          }));

          sets.push({
            id: doc.id,
            name: doc.data().name,
            topikLevel: doc.data().topikLevel,
            vocabularies,
          });
        }

        setVocabularySets(sets);
      } catch (error) {
        console.error("Error fetching vocabulary sets: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularySets();
  }, []);

  const deleteVocabulary = async (setId: string, vocabId: string) => {
    try {
      await deleteDoc(doc(db, "vocabulary_sets", setId, "vocabularies", vocabId));
      setVocabularySets((prevSets) =>
        prevSets.map((set) =>
          set.id === setId
            ? { ...set, vocabularies: set.vocabularies.filter((vocab) => vocab.id !== vocabId) }
            : set
        )
      );
    } catch (error) {
      console.error("Error deleting vocabulary: ", error);
    }
  };

  return { vocabularySets, loading, deleteVocabulary };
};

export default useVocabularySets;