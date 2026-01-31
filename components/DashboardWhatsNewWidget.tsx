import React from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { WhatsNewItem } from "../endpoints/dashboard/stats_GET.schema";
import { Skeleton } from "./Skeleton";
import styles from "./DashboardWhatsNewWidget.module.css";

interface DashboardWhatsNewWidgetProps {
  items: WhatsNewItem[];
  isLoading: boolean;
}

export function DashboardWhatsNewWidget({ items, isLoading }: DashboardWhatsNewWidgetProps) {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <Sparkles className={styles.icon} />
        <h2 className={styles.title}>What’s New</h2>
      </div>
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.list}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.item}>
                <Skeleton style={{ width: "100%", height: "48px" }} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No recent updates yet.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {items.map((item) => (
              <Link key={item.id} to={item.url} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemDate}>
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemType}>{item.entityType}</span>
                  {item.subtitle ? <span className={styles.itemSubtitle}>{item.subtitle}</span> : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
