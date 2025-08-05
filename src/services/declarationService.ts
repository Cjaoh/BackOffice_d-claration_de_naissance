import { collection, addDoc, updateDoc, deleteDoc, doc as firebaseDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export interface Declaration {
  id?: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  heureNaissance?: string;
  lieuNaissance?: string;
  sexe?: string;
}

const declCollection = collection(db, "declarations");

export const getDeclarations = async (): Promise<Declaration[]> => {
  const snapshot = await getDocs(declCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Declaration, 'id'>) }));
};

export const createDeclaration = async (data: Omit<Declaration, "id">): Promise<string> => {
  const docRef = await addDoc(declCollection, data);
  return docRef.id;
};

export const updateDeclaration = async (
  id: string,
  data: Partial<Omit<Declaration, "id">>
): Promise<void> => {
  const docRef = firebaseDoc(db, "declarations", id);
  const dataToUpdate = { ...data };
  if ("id" in dataToUpdate) {
    delete (dataToUpdate as Partial<Declaration>).id;
  }
  await updateDoc(docRef, dataToUpdate);
};

export const deleteDeclaration = async (id: string): Promise<void> => {
  const docRef = firebaseDoc(db, "declarations", id);
  await deleteDoc(docRef);
};
