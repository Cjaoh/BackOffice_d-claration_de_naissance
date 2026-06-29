import { FirebaseError } from "firebase/app";

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
    // Auth
    "auth/email-already-in-use":
        "Cette adresse e-mail est déjà utilisée.",

    "auth/invalid-email":
        "Adresse e-mail invalide.",

    "auth/user-not-found":
        "Utilisateur introuvable.",

    "auth/wrong-password":
        "Mot de passe incorrect.",

    "auth/weak-password":
        "Le mot de passe est trop faible.",

    "auth/too-many-requests":
        "Trop de tentatives. Réessayez plus tard.",

    "auth/network-request-failed":
        "Impossible de contacter le serveur. Vérifiez votre connexion Internet.",

    "auth/requires-recent-login":
        "Reconnectez-vous avant d'effectuer cette opération.",

    // Firestore
    "permission-denied":
        "Vous n'avez pas les autorisations nécessaires.",

    "not-found":
        "La ressource demandée est introuvable.",

    "already-exists":
        "Cette ressource existe déjà.",

    "unavailable":
        "Le service est momentanément indisponible.",

    "deadline-exceeded":
        "Le délai de la requête est dépassé.",

    "cancelled":
        "L'opération a été annulée.",
};

export function getFirebaseErrorMessage(error: unknown): string {
    if (error instanceof FirebaseError) {
        return (
            FIREBASE_ERROR_MESSAGES[error.code] ??
            `Erreur Firebase : ${error.code}`
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Une erreur inattendue est survenue.";
}