export const dynamic = "force-static";

export async function GET() {
  const content = `# Word Assassins

A modern real-life social deduction game that combines stealth, strategy, and vocabulary. Players compete to eliminate targets through clever wordplay while avoiding their own assassination.

## Overview

Word Assassins is a multiplayer game where each player receives:
- A secret word they must avoid saying
- A target player they must eliminate
- The goal of tricking their target into saying their secret word

Players engage in natural conversations over days or weeks, carefully planning their eliminations while staying vigilant about their own secret word. The last player standing wins.

## Core Gameplay Mechanics

### Getting Started
- One player creates a game and shares the invite code
- Players join using the code
- Game creator starts the game when all players are ready
- Each player receives their secret word and target assignment

### Making a Kill
- Trick your target into saying their secret word in conversation
- Target must self-report when they say their word
- Killer inherits the eliminated player's target
- Chain continues until one player remains

### Rules and Fair Play
- Homophones count (e.g., "two" = "to")
- Plurals count (e.g., "shoe" = "shoes")
- Accidental utterances still count
- Players can lie about their word and target
- Never lie about eliminations
- You can say your target's word
- Other players can help with eliminations

## Key Features

### Game Management
- Create and join games with unique codes
- Real-time player status updates
- Game history and statistics
- Replay completed games
- Word redraw system for impossible words

### Player Experience
- Dashboard showing active games
- Target information and secret word display
- Kill confirmation system
- Game status tracking (waiting, active, completed)
- Mobile-first responsive design

### Security & Fair Play
- Secure authentication flow
- Player identity verification
- Self-reporting honor system
- Game integrity protection

## Target Audience

- Friend groups looking for long-term social games
- College students and young professionals
- Communities wanting persistent social activities
- Groups that enjoy word games and social deduction
- Players who appreciate games that integrate into daily life

## Unique Value Proposition

Unlike traditional party games that require dedicated time slots, Word Assassins runs continuously in the background of daily life. It transforms everyday conversations into strategic gameplay, creating memorable moments and inside jokes among friend groups.

## Keywords

social deduction game, word game, assassination game, multiplayer, real-life gaming, party game, strategy game, Next.js application, React, TypeScript, Supabase, social gaming, friend group games`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
