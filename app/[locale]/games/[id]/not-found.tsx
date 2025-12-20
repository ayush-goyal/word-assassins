import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function GameNotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <h1 className="text-4xl font-bold">{t("gameNotFoundTitle")}</h1>
      <p className="text-muted-foreground">{t("gameNotFoundDescription")}</p>
      <Button asChild>
        <Link href="/">{t("backToHome")}</Link>
      </Button>
    </div>
  );
}
