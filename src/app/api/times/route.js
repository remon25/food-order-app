import mongoose from "mongoose";
import { Times } from "../../models/Times";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "../../models/User";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function checkAdmin(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user || !user.admin) {
    throw new Error("Forbidden");
  }
}

export async function PUT(req) {
  try {
    // Check if the user is an admin
    await checkAdmin(req);

    // Parse request body
    const { start, end } = await req.json();
    if (!start || !end) {
      return new Response(
        JSON.stringify({ error: "Start and end times are required" }),
        { status: 400 }
      );
    }

    // Update or create the single Times document
    const times = await Times.findOneAndUpdate(
      {}, // Match the single document
      { start, end }, // Update values
      { new: true, upsert: true } // Create if not found
    );

    return new Response(JSON.stringify({ success: true, times }), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update Times" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch the single Times document
    const times = await Times.findOne();
    if (!times) {
      return new Response(
        JSON.stringify({ error: "No times data found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(times), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch Times" }), {
      status: 500,
    });
  }
}
