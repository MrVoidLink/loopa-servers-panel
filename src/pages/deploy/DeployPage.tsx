import '../../App.css'
import { DeployActions } from './components/DeployActions'
import { DeployStatus } from './components/DeployStatus'
import { DeployLogs } from './components/DeployLogs'
import { DeployHistory } from './components/DeployHistory'
import type { HistoryItem } from './components/DeployHistory'

const recentHistory: HistoryItem[] = [
  { id: 'deploy-2481', action: 'Deploy', env: 'prod', status: 'success', time: '5m ago', by: 'ops@loopa' },
  { id: 'deploy-2479', action: 'Build', env: 'staging', status: 'failed', time: '1h ago', by: 'ops@loopa' },
  { id: 'deploy-2478', action: 'Pull', env: 'prod', status: 'success', time: '2h ago', by: 'ops@loopa' },
]

const logLines = [
  '[12:02:01] git fetch origin main',
  '[12:02:02] git pull --ff-only',
  '[12:02:15] npm install',
  '[12:02:35] npm run build',
  '[12:03:10] restart service loopa-servers-panel',
  '[12:03:12] status: healthy',
]

const branches = ['Main', 'Release', 'Hotfix']

export function DeployPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Deploy</p>
        <h1 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">Pipeline controls</h1>
        <p className="text-sm text-[var(--text-subtle)]">
          Pull latest from git, install packages, rebuild, and redeploy. Wire actions to your API when ready.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <DeployActions branches={branches} />
        <DeployStatus apiStatus="success" commit="a1c93bf" lastDeploy="5 minutes ago" />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <DeployLogs lines={logLines} />
        <DeployHistory items={recentHistory} />
      </div>
    </div>
  )
}
