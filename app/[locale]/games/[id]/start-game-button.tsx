"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "react-query";
import axios from "axios";
import { useTranslations } from "next-intl";

export default function StartGameButton({ gameId }: { gameId: string }) {
  const { toast } = useToast();
  const t = useTranslations("game");
  const tCommon = useTranslations("common");

  const { mutate: startGame, isLoading } = useMutation({
    mutationFn: () => {
      return axios.post(`/api/games/${gameId}/start`);
    },
    onSuccess: () => {
      toast({
        title: t("startGameSuccess"),
        description: t("startGameSuccessDescription"),
      });
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: tCommon("error"),
        description: error.response?.data?.error || t("startGameError"),
        variant: "destructive",
      });
    },
  });

  return (
    <Button onClick={() => startGame()} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t("starting")}
        </>
      ) : (
        t("startGame")
      )}
    </Button>
  );
}
