import { NextResponse } from "next/server";
import { dbAdmin } from "../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // 🔹 Query Firestore to find a document where email matches
    const usersRef = dbAdmin
      .collection("ecosystem")
      .doc("AstonMartin")
      .collection("verified_users");

    const querySnapshot = await usersRef.where("email", "==", email).limit(1).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ verified: false, message: "User not found" }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    return NextResponse.json({ verified: userDoc.data()?.status === "active", uid: userDoc.data()?.uid });
  } catch (error) {
    console.error("Error fetching user verification status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
