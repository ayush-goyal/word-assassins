"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "react-query";
import { useTranslations } from "next-intl";

interface ReplayGameDialogProps {
  gameId: string;
  gameName: string;
}

export default function ReplayGameDialog({
  gameId,
}: ReplayGameDialogProps) {
  const [open, setOpen] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("game");

  const { mutate: replayGame, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/games/${gameId}/replay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGameName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t("replayGameError"));
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t("replayGameSuccess"),
        description: t("replayGameSuccessDescription"),
      });
      setOpen(false);
      router.push(`/games/${data.id}`);
      router.refresh();
    },
    onError: (error: Error) => {
      toast({
        title: t("replayGameError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("replayGame")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("replayGame")}</DialogTitle>
          <DialogDescription>
            {t("replayGameDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 my-2">
          <Label htmlFor="name">{t("newGameName")}</Label>
          <Input
            id="name"
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
            className="col-span-3"
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => replayGame()}
            disabled={isLoading || !newGameName.trim()}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("replayGame")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
