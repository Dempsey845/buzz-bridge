import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "./firebase";

const functions = getFunctions();

export const secureHello = httpsCallable(functions, "secureHello");
