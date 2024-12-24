// src/hooks/useGrammarSets.ts
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

type GrammarItem = {
  id: string;
  name: string;
  use: string;
  mean: string;
  example: string;
  describe: string;
};

type GrammarSet = {
  id: string;
  title: string;
  topikLevel: string;
  grammars: GrammarItem[];
};

const useGrammarSets = () => {
  const [GrammarSets, setGrammarSets] = useState<GrammarSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrammarSets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "grammar_sets"));
        const sets: GrammarSet[] = [];

        for (const doc of querySnapshot.docs) {
          const grammarsSnapshot = await getDocs(collection(db, "grammar_sets", doc.id, "grammars"));
          const grammars: GrammarItem[] = grammarsSnapshot.docs.map((GramDoc) => ({
            id: GramDoc.id,
            name: GramDoc.data().name,
            use: GramDoc.data().use,
            mean: GramDoc.data().mean,
            example: GramDoc.data().example,
            describe: GramDoc.data().describe,
          }));

          sets.push({
            id: doc.id,
            title: doc.data().name,
            topikLevel: doc.data().topikLevel,
            grammars,
          });
        }

        setGrammarSets(sets);
      } catch (error) {
        console.error("Error fetching Grammar sets: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrammarSets();
  }, []);

  const deleteGrammar = async (setId: string, vocabId: string) => {
    try {
      await deleteDoc(doc(db, "grammar_sets", setId, "grammars", vocabId));
      setGrammarSets((prevSets) =>
        prevSets.map((set) =>
          set.id === setId
            ? { ...set, grammars: set.grammars.filter((vocab) => vocab.id !== vocabId) }
            : set
        )
      );
    } catch (error) {
      console.error("Error deleting Grammar: ", error);
    }
  };

  return { GrammarSets, loading, deleteGrammar };
};

export default useGrammarSets;