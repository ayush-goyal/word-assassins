"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Game, PlayerInGame, PlayerStatus } from "@prisma/client";

type GameWithPlayers = Game & {
  players: PlayerInGame[];
};

export default function RedrawWordButton({
  game,
  currentPlayer,
}: {
  game: GameWithPlayers;
  currentPlayer: PlayerInGame;
}) {
  const utils = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const redraws = currentPlayer.redraws;
  const remainingRedraws = 2 - redraws;

  const anyPlayersDead = game.players.some(
    (p) => p.status === PlayerStatus.DEAD
  );
  const redrawsAllowed = game.redrawsAlwaysAllowed || !anyPlayersDead;

  const { mutate: redrawWord } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/games/${game.id}/redraw`);
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      toast.toast({
        title: "Word redrawn successfully",
        description: `Your new word is: ${data.newWord}`,
        variant: "default",
      });
      utils.invalidateQueries(["game", game.id]);
    },
    onError: (error: any) => {
      toast.toast({
        title: "Failed to redraw word",
        description: error.response?.data?.error || "Failed to redraw word",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const getButtonText = () => {
    if (isLoading) return "Redrawing...";
    if (!redrawsAllowed) return "Redraws locked";
    if (remainingRedraws <= 0) return "No redraws left";
    return (
      <>
        Redraw Word{" "}
        <Badge variant="secondary" className="ml-2">
          {remainingRedraws} left
        </Badge>
      </>
    );
  };

  const getDialogDescription = () => {
    if (remainingRedraws <= 0) {
      return `You have used all your redraws for this game.`;
    }

    if (!redrawsAllowed) {
      return `Sorry, you can't redraw your word right now.`;
    }

    if (game.redrawsAlwaysAllowed) {
      return `This will select a new random word for your target. You can only do this ${remainingRedraws} more ${remainingRedraws === 1 ? "time" : "times"}.`;
    } else {
      return `This will select a new random word for your target. You can only do this ${remainingRedraws} more ${remainingRedraws === 1 ? "time" : "times"}, and only before any kills have occurred in the game.`;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading || remainingRedraws <= 0 || !redrawsAllowed}
        >
          {getButtonText()}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {getDialogDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => redrawWord()}>
            Yes, redraw word
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
