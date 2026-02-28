import { db } from "./firebase.js";
import {
  runTransaction,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/**
 * Atomically deducts coins from the owner and unlocks a submission.
 * Throws a descriptive error if anything is wrong.
 */
export async function unlockSubmission(uid, submissionId) {
  const userRef = doc(db, "users", uid);
  const subRef  = doc(db, "submissions", submissionId);

  await runTransaction(db, async (tx) => {
    const userSnap = await tx.get(userRef);
    const subSnap  = await tx.get(subRef);

    if (!userSnap.exists()) throw new Error("User not found.");
    if (!subSnap.exists())  throw new Error("Submission not found.");

    const user = userSnap.data();
    const sub  = subSnap.data();

    if (!sub.locked)          throw new Error("already_unlocked");
    if (sub.ownerId !== uid)  throw new Error("Not your submission.");

    const cost = sub.unlockCost ?? 1;
    if (user.coins < cost)    throw new Error(`Not enough coins. Need ${cost}, you have ${user.coins}.`);

    tx.update(userRef, { coins: user.coins - cost });
    tx.update(subRef,  { locked: false, unlocked: true });
  });
}
