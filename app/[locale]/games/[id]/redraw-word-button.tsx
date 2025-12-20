"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("game");
  const tCommon = useTranslations("common");

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
        title: t("wordRedrawnSuccess"),
        description: t("wordRedrawnSuccessDescription", { newWord: data.newWord }),
        variant: "default",
      });
      utils.invalidateQueries(["game", game.id]);
    },
    onError: (error: any) => {
      toast.toast({
        title: t("wordRedrawError"),
        description: error.response?.data?.error || t("wordRedrawError"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const getButtonText = () => {
    if (isLoading) return t("redrawing");
    if (!redrawsAllowed) return t("redrawsLocked");
    if (remainingRedraws <= 0) return t("noRedrawsLeft");
    return (
      <>
        {t("redrawWord")}{" "}
        <Badge variant="secondary" className="ml-2">
          {remainingRedraws} {t("redrawLeft")}
        </Badge>
      </>
    );
  };

  const getDialogDescription = () => {
    if (remainingRedraws <= 0) {
      return t("redrawDescriptionNoRedraws");
    }

    if (!redrawsAllowed) {
      return t("redrawDescriptionLocked");
    }

    const timeText = remainingRedraws === 1 ? t("time") : t("times");
    if (game.redrawsAlwaysAllowed) {
      return t("redrawDescriptionAlwaysAllowed", { remainingRedraws, time: timeText });
    } else {
      return t("redrawDescriptionBeforeKills", { remainingRedraws, time: timeText });
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
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {getDialogDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={() => redrawWord()}>
            {t("yesRedrawWord")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
