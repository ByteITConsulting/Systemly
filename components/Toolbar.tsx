"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTutorial } from "./TutorialProvider";
import styles from "./Toolbar.module.scss";

interface ToolbarProps {
  onExport: () => void;
  onClear: () => void;
  exporting: boolean;
  nodeCount: number;
  edgeCount: number;
}

export default function Toolbar({
  onExport,
  onClear,
  exporting,
  nodeCount,
  edgeCount,
}: ToolbarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { isActive, startTutorial } = useTutorial();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.push(`/${newLocale}`);
  };

  return (
    <header className={styles.toolbar} data-tour="toolbar">
      <div className={styles.brand}>
        <span className={styles.mark}>⌗</span>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>Systemly</span>
          <span className={styles.brandSub}>{t("toolbar.tagline")}</span>
        </div>
      </div>

      <div className={styles.stats}>
        <span>
          <strong>{nodeCount}</strong> {t("toolbar.components")}
        </span>
        <span className={styles.dot}>·</span>
        <span>
          <strong>{edgeCount}</strong> {t("toolbar.connections")}
        </span>
        <span className={styles.dot}>·</span>
        <span className={styles.hint}>
          {t("toolbar.hint")}
        </span>
      </div>

      <div className={styles.actions}>
        <button className={styles.btn} onClick={onClear} title={t("toolbar.clearTitle")}>
          <span className={styles.btnIcon}>⟲</span>
          {t("toolbar.clear")}
        </button>
        {!isActive && (
          <button
            className={styles.btn}
            onClick={startTutorial}
            title={t("toolbar.tutorialTitle") || "Start tutorial"}
          >
            <span className={styles.btnIcon}>?</span>
            {t("toolbar.tutorial") || "Tutorial"}
          </button>
        )}
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onExport}
          disabled={exporting}
          title={t("toolbar.exportTitle")}
          data-tour="toolbar-export"
        >
          <span className={styles.btnIcon}>⬇</span>
          {exporting ? t("toolbar.exporting") : t("toolbar.export")}
        </button>
        <select
          className={styles.languageSelect}
          value={locale}
          onChange={handleLanguageChange}
          title={t("common.language")}
        >
          <option value="en">{t("common.english")}</option>
          <option value="pt">{t("common.portuguese")}</option>
        </select>
      </div>
    </header>
  );
}
