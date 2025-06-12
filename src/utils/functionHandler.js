import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "./firebase";

const functions = getFunctions();

const getIdToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("User is not authenticated");
  }
  const idToken = await currentUser.getIdToken();
  return idToken;
};

export const secureHello = async () => {
  try {
    const token = await getIdToken();
    const secureHelloFunction = httpsCallable(functions, "secureHello");
    const result = await secureHelloFunction({ token });
    console.log(result.data);
  } catch (error) {
    console.error("Error calling secureHello:", error);
  }
};

export const getUserAlerts = async () => {
  try {
    const token = await getIdToken();
    const getUserAlertsFunction = httpsCallable(functions, "getUserAlerts");
    const result = await getUserAlertsFunction({ token });
    return result.data;
  } catch (error) {
    console.error("Error calling getUserAlerts:", error);
  }
};

export const createAlert = async (data) => {
  try {
    const token = await getIdToken();
    const createAlertFunction = httpsCallable(functions, "createAlert");
    const result = await createAlertFunction({
      token,
      app: data.app,
      subject: data.subject,
      snippet: data.snippet,
    });
    console.log(result.data);
  } catch (error) {
    console.error("Error calling createAlert:", error);
  }
};
