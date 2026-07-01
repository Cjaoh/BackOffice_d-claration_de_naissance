import {
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  limit,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";
import type {
  DashboardData,
  DashboardStats,
  RecentDeclaration,
} from "../types/dashboard";

const DECLARATIONS_COLLECTION = "declarations";
const USERS_COLLECTION = "users";

export async function getDashboardData(): Promise<DashboardData> {
  //------------------------------------------
  // Références Firestore
  //------------------------------------------

  const declarationsRef = collection(db, DECLARATIONS_COLLECTION);
  const usersRef = collection(db, USERS_COLLECTION);

  //------------------------------------------
  // Comptage total
  //------------------------------------------

  const [
    declarationsSnapshot,
    usersSnapshot,
    declarationsDocs,
  ] = await Promise.all([
    getCountFromServer(declarationsRef),
    getCountFromServer(usersRef),
    getDocs(declarationsRef),
  ]);

  //------------------------------------------
  // Statistiques
  //------------------------------------------

  let pendingDeclarations = 0;
  let approvedDeclarations = 0;

  declarationsDocs.forEach((doc) => {
    const status = String(doc.data().status ?? "").toLowerCase();

    switch (status) {
      case "pending":
      case "en attente":
        pendingDeclarations++;
        break;

      case "approved":
      case "approuvée":
      case "approuvee":
        approvedDeclarations++;
        break;

      default:
        break;
    }
  });

  const stats: DashboardStats = {
    totalDeclarations: declarationsSnapshot.data().count,
    activeUsers: usersSnapshot.data().count,
    pendingDeclarations,
    approvedDeclarations,
  };

  //------------------------------------------
  // 5 dernières déclarations
  //------------------------------------------

  const recentQuery = query(
    declarationsRef,
    orderBy("date", "desc"),
    limit(5)
  );

  const recentSnapshot = await getDocs(recentQuery);

  const recentDeclarations: RecentDeclaration[] =
    recentSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<RecentDeclaration, "id">),
    }));

  return {
    stats,
    recentDeclarations,
  };
}