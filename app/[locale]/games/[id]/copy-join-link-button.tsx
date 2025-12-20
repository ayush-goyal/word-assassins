"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CopyJoinLinkButton({ joinCode }: { joinCode: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const t = useTranslations("game");

  const copyToClipboard = async () => {
    const joinUrl = `${window.location.origin}/games/join?code=${joinCode}`;

    try {
      await navigator.clipboard.writeText(joinUrl);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      // pass
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copyToClipboard}
      className="h-7 px-2 transition-all"
    >
      {isCopied ? (
        <>
          <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
          {t("copyJoinLinkCopied")}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 mr-1" />
          {t("copyJoinLinkText")}
        </>
      )}
    </Button>
  );
}
