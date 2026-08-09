"use client";

import { useTranslations } from "next-intl";
import { CHALLENGES } from "@/lib/challenges";
import { NodeData } from "@/lib/types";
import styles from "./ChallengePanel.module.scss";

interface ChallengePanelProps {
  challengeId: string;
  onSelectChallenge: (id: string) => void;
  nodes: NodeData[];
}

const CHALLENGE_TRANSLATION_MAP: Record<string, { titleKey: string; briefKey: string; prefix: string }> = {
  "url-shortener": { titleKey: "challenges.urlShortener.title", briefKey: "challenges.urlShortener.brief", prefix: "challenges.urlShortener" },
  "social-feed": { titleKey: "challenges.socialFeed.title", briefKey: "challenges.socialFeed.brief", prefix: "challenges.socialFeed" },
  "chat-app": { titleKey: "challenges.chatApp.title", briefKey: "challenges.chatApp.brief", prefix: "challenges.chatApp" },
  "ecommerce-cart": { titleKey: "challenges.ecommerce.title", briefKey: "challenges.ecommerce.brief", prefix: "challenges.ecommerce" },
  "free-form": { titleKey: "challenges.freeForm.title", briefKey: "challenges.freeForm.brief", prefix: "challenges.freeForm" },
};

export default function ChallengePanel({ challengeId, onSelectChallenge, nodes }: ChallengePanelProps) {
  const t = useTranslations();
  const challenge = CHALLENGES.find((c) => c.id === challengeId) ?? CHALLENGES[0];
  const presentTypes = new Set(nodes.map((n) => n.typeId));
  const doneCount = challenge.checklist.filter((item) =>
    item.match.some((t) => presentTypes.has(t))
  ).length;
  const total = challenge.checklist.length;

  const translationKeys = CHALLENGE_TRANSLATION_MAP[challenge.id];
  const challengeTitle = translationKeys ? t(translationKeys.titleKey) : challenge.title;
  const challengeBrief = translationKeys ? t(translationKeys.briefKey) : challenge.brief;

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>{t("challenges.mode")}</span>
        <h2>{t("challenges.scenario")}</h2>
      </div>

      <select
        className={styles.select}
        value={challengeId}
        onChange={(e) => onSelectChallenge(e.target.value)}
      >
        {CHALLENGES.map((c) => {
          const keys = CHALLENGE_TRANSLATION_MAP[c.id];
          const title = keys ? t(keys.titleKey) : c.title;
          return (
            <option key={c.id} value={c.id}>
              {title}
            </option>
          );
        })}
      </select>

      <p className={styles.brief}>{challengeBrief}</p>

      {challenge.constraints.length > 0 && (
        <div className={styles.block}>
          <span className={styles.blockLabel}>{t("challenges.constraints")}</span>
          <ul className={styles.constraints}>
            {challenge.constraints.map((c, i) => {
              const constraintKey = translationKeys ? `${translationKeys.prefix}.constraint${i + 1}` : null;
              const text = constraintKey ? t(constraintKey as any) : c;
              return <li key={i}>{text}</li>;
            })}
          </ul>
        </div>
      )}

      {challenge.checklist.length > 0 && (
        <div className={styles.block}>
          <div className={styles.checklistHeader}>
            <span className={styles.blockLabel}>Checklist</span>
            <span className={styles.progress}>
              {doneCount}/{total}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: total ? `${(doneCount / total) * 100}%` : "0%" }}
            />
          </div>
          <ul className={styles.checklist}>
            {challenge.checklist.map((item, idx) => {
              const done = item.match.some((t) => presentTypes.has(t));
              const checkKey = translationKeys ? `${translationKeys.prefix}.check${idx + 1}` : null;
              const label = checkKey ? t(checkKey as any) : item.label;
              return (
                <li key={item.id} className={done ? styles.checked : ""}>
                  <span className={styles.checkbox}>{done ? "✓" : ""}</span>
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p className={styles.footNote}>
        {t("challenges.footNote")}
      </p>
    </aside>
  );
}
