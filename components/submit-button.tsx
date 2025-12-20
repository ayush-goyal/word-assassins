"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  const t = useTranslations("common");
  const defaultPendingText = pendingText || t("submitting");

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? defaultPendingText : children}
    </Button>
  );
}
