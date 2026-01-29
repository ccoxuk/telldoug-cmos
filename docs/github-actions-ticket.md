# GitHub Actions Support Ticket (Template)

**Repo:** ccoxuk/telldoug-cmos  
**Visibility:** public  
**Problem:** workflow runs show `startup_failure`, no steps executed, runner_name empty.

**Evidence:**
- Run ID: <RUN_ID>
- Timestamp (UTC): <TIMESTAMP>
- Symptom: job created but steps list empty; runner never starts; logs unavailable.

**Minimal reproduction:**
- Workflow: `.github/workflows/actions-smoke.yml`
- Content: single job, single echo step
- Result: still `startup_failure`

**Request:**
Please investigate why GitHub‑hosted runners are not starting for this repository.
