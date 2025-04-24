import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ContactForm } from "schema/contact";

export async function POST(request) {
  const formData = await request.formData();
  const { name, email, contact_number, intention, message, budget } =
    Object.fromEntries(formData.entries());

  if (!name)
    return NextResponse.json({ error: "No name provided!" }, { status: 400 });

  if (!email)
    return NextResponse.json({ error: "No email provided!" }, { status: 400 });

  try {
    await db
      .insert(ContactForm)
      .values({ name, email, contact_number, intention, message, budget });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ success: "success" }, { status: 200 });
}
