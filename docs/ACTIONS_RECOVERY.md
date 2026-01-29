# Actions Recovery (Self‑Hosted Runner Fallback)

Use this if GitHub‑hosted runners are unstable (startup_failure / zero‑step runs).

## 1) Provision a runner host
- Linux VPS recommended (Ubuntu 22.04 LTS)
- 2 vCPU / 2–4 GB RAM is enough for CI

## 2) Create a self‑hosted runner in GitHub
Repo → Settings → Actions → Runners → New self‑hosted runner

Follow the printed commands on the host. Example:

```
# on the runner host
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o actions-runner.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64-2.319.1.tar.gz
./config.sh --url https://github.com/ccoxuk/telldoug-cmos --token <TOKEN>
./run.sh
```

For a service install (recommended):
```
./svc.sh install
./svc.sh start
```

## 3) Update CI to target self‑hosted (temporary)
In `.github/workflows/cmos-ci.yml`:
```
runs-on: self-hosted
```

Revert to `ubuntu-latest` once GitHub‑hosted runners are stable again.

## 4) Secrets
Do not store secrets on the runner host.
Use GitHub repo secrets and CI env variables.

## 5) Verification
Run a workflow and confirm:
- job starts
- steps execute
- logs are visible
