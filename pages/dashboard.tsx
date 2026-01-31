import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { PenLine, Plus } from "lucide-react";
import { useDashboardStats } from "../helpers/useDashboardApi";
import { DashboardReconnectWidget } from "../components/DashboardReconnectWidget";
import { DashboardProductiveInteractionsWidget } from "../components/DashboardProductiveInteractionsWidget";
import { DashboardTopConnectorsWidget } from "../components/DashboardTopConnectorsWidget";
import { DashboardRecentActivityWidget } from "../components/DashboardRecentActivityWidget";
import { DashboardGoalsWidget } from "../components/DashboardGoalsWidget";
import { DashboardSkillsGrowthWidget } from "../components/DashboardSkillsGrowthWidget";
import { DashboardFeedbackWidget } from "../components/DashboardFeedbackWidget";
import { DashboardContentWidget } from "../components/DashboardContentWidget";
import { DashboardWhatsNewWidget } from "../components/DashboardWhatsNewWidget";
import { ContentDraftDialog } from "../components/ContentDraftDialog";
import { CareerNarrativeDialog } from "../components/CareerNarrativeDialog";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";
import styles from "./dashboard.module.css";

const AI_FEATURES_ENABLED = false;

export default function DashboardPage() {
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [narrativeDialogOpen, setNarrativeDialogOpen] = useState(false);
  const { data, isFetching } = useDashboardStats();

  const staleContacts = data?.staleContacts || [];
  const productiveInteractionTypes = data?.productiveInteractionTypes || [];
  const topConnectors = data?.topConnectors || [];
  const recentInteractions = data?.recentActivity.recentInteractions || [];
  const upcomingEvents = data?.recentActivity.upcomingEvents || [];
  const whatsNew = data?.whatsNew || [];

  // New data extractions
  const goalsProgress = data?.goalsProgress || [];
  const skillsGrowth = data?.skillsGrowth || {
    totalSkills: 0,
    skillsAddedLast12Months: 0,
    byProficiency: [],
    recentSkills: [],
  };
  const feedbackThemes = data?.feedbackThemes || {
    totalFeedbackLast90Days: 0,
    byType: [],
    recentFeedback: [],
  };
  const contentActivity = data?.contentActivity || {
    totalContent: 0,
    byType: [],
    recentContent: [],
    thisYearCount: 0,
  };

  const counts = data?.counts ?? null;
  const showOnboarding = counts ? counts.jobs === 0 : false;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Dashboard | TellDoug</title>
      </Helmet>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome to TellDoug</h1>
          <p className={styles.subtitle}>
            Here's what's happening in your career OS.
          </p>
        </div>
        <div className={styles.actions}>
          {!showOnboarding ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus size={16} /> Add new
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/jobs?new=1">Job</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects?new=1">Project</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/skills?new=1">Skill</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/people?new=1">Person</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/institutions?new=1">Institution</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/events?new=1">Event</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/relationships?new=1">Relationship</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/goals?new=1">Goal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/achievements?new=1">Achievement</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/learning?new=1">Learning</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/interactions?new=1">Interaction</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/feedback?new=1">Feedback</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/content?new=1">Content</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/compensation?new=1">Compensation</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {AI_FEATURES_ENABLED ? (
            <Button
              variant="outline"
              onClick={() => setNarrativeDialogOpen(true)}
            >
              <PenLine size={16} />
              Career Narrative
            </Button>
          ) : null}
          {AI_FEATURES_ENABLED ? (
            <Button onClick={() => setDraftDialogOpen(true)}>
              <PenLine size={16} />
              Draft Content
            </Button>
          ) : null}
        </div>
      </header>

      {showOnboarding ? (
        <section className={styles.onboarding}>
          <div className={styles.onboardingHeader}>
            <div>
              <h2 className={styles.onboardingTitle}>Start your career timeline</h2>
              <p className={styles.onboardingSubtitle}>
                Add a few core items to unlock a complete, searchable career OS.
              </p>
            </div>
            <Button asChild>
              <Link to="/jobs?new=1">Add your first job</Link>
            </Button>
          </div>

          <ul className={styles.onboardingList}>
            <li>Add your first job</li>
            <li>Attach 1 project to that job</li>
            <li>Add 3–5 skills as evidence</li>
          </ul>

          <div className={styles.onboardingActions}>
            <Button variant="outline" asChild>
              <Link to="/projects?new=1">Add project</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/people?new=1">Add person</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/institutions?new=1">Add institution</Link>
            </Button>
          </div>
          <div className={styles.onboardingNote}>Takes ~2 minutes to get started.</div>
        </section>
      ) : null}

      <div className={styles.sectionHeading}>
        <h2>Insights</h2>
        <p>Recent signals and priorities from your career OS.</p>
      </div>

      <div className={styles.widgetsGrid}>
        <DashboardWhatsNewWidget items={whatsNew} isLoading={isFetching} />
        <DashboardSkillsGrowthWidget
          skillsGrowth={skillsGrowth}
          isLoading={isFetching}
        />
        <DashboardRecentActivityWidget
          recentInteractions={recentInteractions}
          upcomingEvents={upcomingEvents}
          isLoading={isFetching}
        />
        <DashboardGoalsWidget
          goalsProgress={goalsProgress}
          isLoading={isFetching}
        />
      </div>

      <details className={styles.moreInsights}>
        <summary className={styles.moreInsightsSummary}>More insights</summary>
        <div className={styles.widgetsGrid}>
          <DashboardTopConnectorsWidget
            topConnectors={topConnectors}
            isLoading={isFetching}
          />
          <DashboardReconnectWidget
            staleContacts={staleContacts}
            isLoading={isFetching}
          />
          <DashboardProductiveInteractionsWidget
            productiveInteractionTypes={productiveInteractionTypes}
            isLoading={isFetching}
          />
          <DashboardFeedbackWidget
            feedbackThemes={feedbackThemes}
            isLoading={isFetching}
          />
          <DashboardContentWidget
            contentActivity={contentActivity}
            isLoading={isFetching}
          />
        </div>
      </details>

      {AI_FEATURES_ENABLED ? (
        <>
          <ContentDraftDialog
            open={draftDialogOpen}
            onOpenChange={setDraftDialogOpen}
          />
          <CareerNarrativeDialog
            open={narrativeDialogOpen}
            onOpenChange={setNarrativeDialogOpen}
          />
        </>
      ) : null}
    </div>
  );
}
