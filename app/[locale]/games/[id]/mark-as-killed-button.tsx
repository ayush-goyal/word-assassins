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
import { BloodSplatter } from "./blood-splatter";
import { useTranslations } from "next-intl";

export default function MarkAsKilledButton({ gameId }: { gameId: string }) {
  const utils = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showBloodSplatter, setShowBloodSplatter] = useState(false);
  const toast = useToast();
  const t = useTranslations("game");
  const tCommon = useTranslations("common");

  const { mutate: markAsKilled } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/games/${gameId}/killed`);
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setShowBloodSplatter(true);
      setTimeout(() => {
        setShowBloodSplatter(false);
      }, 5000);
    },
    onSuccess: () => {
      toast.toast({
        title: t("markAsKilledSuccess"),
        description: t("markAsKilledSuccessDescription"),
        variant: "default",
      });
      utils.invalidateQueries(["game", gameId]);
    },
    onError: (error: any) => {
      toast.toast({
        title: t("markAsKilledError"),
        description: error.response?.data?.error || t("markAsKilledError"),
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return (
    <>
      <BloodSplatter show={showBloodSplatter} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
            {isLoading ? t("markingAsKilled") : t("markYourselfAsKilled")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("markAsKilledConfirm")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => markAsKilled()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("yesMarkAsKilled")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
