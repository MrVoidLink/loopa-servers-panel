import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '../AppShell'
import { DashboardPage } from '../../pages/dashboard/DashboardPage'
import { ConfigsPage } from '../../pages/configs/ConfigsPage'
import { DeployPage } from '../../pages/deploy/DeployPage'
import { LoginPage } from '../../pages/auth/LoginPage'
import { SetupPage } from '../../pages/setup/SetupPage'
import { UtilitiesPage } from '../../pages/utilities/UtilitiesPage'
import { SettingsPage } from '../../pages/settings/SettingsPage'
import { RequireAuth } from '../auth/RequireAuth'
import { RequireSetup } from '../auth/RequireSetup'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireSetup />}>
        <Route path="/setup" element={<SetupPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/configs" element={<ConfigsPage />} />
            <Route path="/deploy" element={<DeployPage />} />
            <Route path="/utilities" element={<UtilitiesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
