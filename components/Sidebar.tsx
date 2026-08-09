"use client";

import { useTranslations } from "next-intl";
import { COMPONENT_TYPES } from "@/lib/componentTypes";
import { ComponentCategory } from "@/lib/types";
import styles from "./Sidebar.module.scss";

const CATEGORY_ORDER: ComponentCategory[] = ["client", "network", "compute", "data"];

const COMPONENT_TRANSLATION_MAP: Record<string, { labelKey: string; hintKey: string }> = {
  client: { labelKey: "sidebar.componentTypes.client", hintKey: "sidebar.componentTypes.clientHint" },
  cdn: { labelKey: "sidebar.componentTypes.cdn", hintKey: "sidebar.componentTypes.cdnHint" },
  "load-balancer": { labelKey: "sidebar.componentTypes.loadBalancer", hintKey: "sidebar.componentTypes.loadBalancerHint" },
  "api-gateway": { labelKey: "sidebar.componentTypes.apiGateway", hintKey: "sidebar.componentTypes.apiGatewayHint" },
  auth: { labelKey: "sidebar.componentTypes.auth", hintKey: "sidebar.componentTypes.authHint" },
  "web-server": { labelKey: "sidebar.componentTypes.webServer", hintKey: "sidebar.componentTypes.webServerHint" },
  "app-server": { labelKey: "sidebar.componentTypes.appServer", hintKey: "sidebar.componentTypes.appServerHint" },
  microservice: { labelKey: "sidebar.componentTypes.microservice", hintKey: "sidebar.componentTypes.microserviceHint" },
  queue: { labelKey: "sidebar.componentTypes.queue", hintKey: "sidebar.componentTypes.queueHint" },
  cache: { labelKey: "sidebar.componentTypes.cache", hintKey: "sidebar.componentTypes.cacheHint" },
  "sql-db": { labelKey: "sidebar.componentTypes.sqlDb", hintKey: "sidebar.componentTypes.sqlDbHint" },
  "nosql-db": { labelKey: "sidebar.componentTypes.nosqlDb", hintKey: "sidebar.componentTypes.nosqlDbHint" },
  storage: { labelKey: "sidebar.componentTypes.storage", hintKey: "sidebar.componentTypes.storageHint" },
};

export default function Sidebar() {
  const t = useTranslations();

  return (
    <aside className={styles.sidebar} data-tour="sidebar">
      <div className={styles.header}>
        <span className={styles.eyebrow}>{t("sidebar.pieces")}</span>
        <h2>{t("sidebar.components")}</h2>
        <p className={styles.helper}>{t("sidebar.helper")}</p>
      </div>

      <div className={styles.list} data-tour="sidebar-categories">
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className={styles.group}>
            <div className={styles.groupLabel} data-cat={cat}>
              {t(`sidebar.categories.${cat}`)}
            </div>
            <div className={styles.items} data-tour={cat === "client" ? "sidebar-drag-hint" : undefined}>
              {COMPONENT_TYPES.filter((c) => c.category === cat).map((c) => {
                const translationKeys = COMPONENT_TRANSLATION_MAP[c.id];
                const label = translationKeys ? t(translationKeys.labelKey) : c.label;
                const hint = translationKeys ? t(translationKeys.hintKey) : c.hint;

                return (
                  <div
                    key={c.id}
                    className={styles.item}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("componentTypeId", c.id);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    title={hint}
                  >
                    <span className={styles.glyph} data-cat={c.category}>
                      {c.glyph}
                    </span>
                    <div className={styles.itemText}>
                      <span className={styles.itemLabel}>{label}</span>
                      <span className={styles.itemHint}>{hint}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
