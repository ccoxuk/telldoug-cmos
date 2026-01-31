import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { useTimelineData } from "../helpers/useTimelineApi";
import { TimelineItem as TimelineItemType } from "../endpoints/timeline/data_GET.schema";
import { TimelineItem } from "../components/TimelineItem";
import { TimelineDetailModal } from "../components/TimelineDetailModal";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import styles from "./timeline.module.css";

export default function TimelinePage() {
  const { data, isLoading } = useTimelineData();
  const [hoveredPersonId, setHoveredPersonId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"professional" | "academic" | "all">("professional");

  const handleItemClick = (item: TimelineItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const filteredYears = useMemo(() => {
    if (!data?.years) return [];
    if (filter === "all") return data.years;

    const isProfessional = (type: TimelineItemType["type"]) =>
      ["job", "project", "compensation", "achievement", "feedback", "goal", "content", "event"].includes(type);

    const isAcademic = (type: TimelineItemType["type"]) =>
      ["institution", "learning"].includes(type);

    return data.years
      .map((yearGroup) => ({
        ...yearGroup,
        items: yearGroup.items.filter((item) =>
          filter === "professional" ? isProfessional(item.type) : isAcademic(item.type)
        ),
      }))
      .filter((yearGroup) => yearGroup.items.length > 0);
  }, [data?.years, filter]);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Career Timeline | TellDoug</title>
      </Helmet>

      <header className={styles.header}>
        <h1 className={styles.title}>Career Timeline</h1>
        <p className={styles.subtitle}>
          Visualize your professional journey through jobs, projects, events, and education.
        </p>
        <div className={styles.filters}>
          <Button
            variant={filter === "professional" ? "default" : "outline"}
            onClick={() => setFilter("professional")}
          >
            Professional
          </Button>
          <Button
            variant={filter === "academic" ? "default" : "outline"}
            onClick={() => setFilter("academic")}
          >
            Academic
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
        </div>
      </header>

      <div className={styles.timelineContainer}>
        {isLoading ? (
          // Loading State
          <div className={styles.loadingWrapper}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.yearSection}>
                <div className={styles.yearLabel}>
                  <Skeleton style={{ width: "60px", height: "2rem" }} />
                </div>
                <div className={styles.itemsList}>
                  <Skeleton style={{ width: "100%", height: "120px" }} />
                  <Skeleton style={{ width: "100%", height: "120px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : !data?.years || filteredYears.length === 0 ? (
          // Empty State
          <div className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <h3>Your timeline is empty for this view</h3>
              <p>
                Add jobs, projects, education, or events to populate your timeline.
              </p>
              <div className={styles.emptyActions}>
                <Button asChild variant="outline">
                  <Link to="/jobs?new=1">Add Job</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/projects?new=1">Add Project</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/institutions?new=1">Add Institution</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Timeline Content
          <div className={styles.timeline}>
            {filteredYears.map((yearGroup) => (
              <div key={yearGroup.year} className={styles.yearSection}>
                <div className={styles.yearColumn}>
                  <span className={styles.yearLabel}>{yearGroup.year}</span>
                </div>
                <div className={styles.itemsColumn}>
                  {yearGroup.items.map((item) => (
                    <TimelineItem
                      key={item.id}
                      item={item}
                      hoveredPersonId={hoveredPersonId}
                      onPersonHover={setHoveredPersonId}
                      onClick={handleItemClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TimelineDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
      />
    </div>
  );
}
