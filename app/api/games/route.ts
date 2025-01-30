import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { customAlphabet } from "nanoid";

const CUSTOM_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Letters + Numbers
const generateGameCode = customAlphabet(CUSTOM_ALPHABET, 4);

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  try {
    const { gameName, playerName } = await request.json();

    if (!gameName) {
      return NextResponse.json(
        { error: "Game name is required" },
        { status: 400 }
      );
    }

    if (!playerName) {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        name: gameName,
        joinCode: generateGameCode(),
        creatorId: user.id,
        players: {
          create: {
            userId: user.id,
            name: playerName,
          },
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
