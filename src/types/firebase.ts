import type { User } from "firebase/auth";
import type {
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export type FirebaseUser = User;
export type FirestoreTimestamp = Timestamp;
export type FirestoreDocument = DocumentData;
export type FirestoreSnapshot = QueryDocumentSnapshot<DocumentData>;
export type FirestoreSnapshotOptions = SnapshotOptions;