import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import type { ReactNode } from 'react';

import { ThemeProvider } from './contexts/ThemeContext';
import { LocaleProvider } from './contexts/LocaleContext';
import {
  AuthProvider,
  useAuth,
} from './contexts/AuthContext';

import { ToastProvider } from './components/ui/overlays';
import { AppShell } from './layouts/AppShell';

// Authentication
import { Splash } from './screens/auth/Splash';
import { SignIn } from './screens/auth/SignIn';
import { Activate } from './screens/auth/Activate';
import { Forgot } from './screens/auth/Forgot';

// Member
import { Home } from './screens/member/Home';
import { Members } from './screens/member/Members';
import { MemberProfile } from './screens/member/MemberProfile';

// Province
import {
  Institutions,
  InstitutionProfile,
} from './screens/province/Institutions';

import {
  Events,
  EventDetail,
} from './screens/province/Events';

import {
  News,
  NewsArticle,
} from './screens/province/News';

import {
  ProvinceHome,
  About,
  Administration,
} from './screens/province/ProvincePages';

import {
  Gallery,
  Vocation,
  Chavarul,
  Contact,
} from './screens/province/MediaPages';

// More
import { More } from './screens/more/More';
import {
  MoreCategory,
  MoreCategoryItem,
} from './screens/more/MoreCategories';

import { Account } from './screens/more/Account';
import { Settings } from './screens/more/Settings';

// Admin
import { AdminRoutes } from './screens/admin/AdminRoutes';

/**
 * Authentication guard.
 *
 * IMPORTANT:
 * During the first application render after a browser refresh,
 * Supabase may still be restoring the existing session.
 *
 * We therefore wait while isLoading === true instead of
 * immediately redirecting to /signin.
 */
function RequireAuth({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    isLoading,
  } = useAuth();

  const loc = useLocation();

  // Wait for Supabase session restoration.
  if (isLoading) {
    return null;
  }

  // Only redirect after the authentication check has completed.
  if (!user) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: loc.pathname,
        }}
      />
    );
  }

  return <>{children}</>;
}

/**
 * Super Administrator guard.
 *
 * Authentication must finish before we decide whether
 * the user should be redirected.
 */
function RequireAdmin({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    isLoading,
  } = useAuth();

  // Wait for Supabase session restoration.
  if (isLoading) {
    return null;
  }

  // Not authenticated.
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Authenticated but not a Super Administrator.
  if (user.role !== 'superadmin') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <ToastProvider>
            <HashRouter>
              <Routes>
                {/* Authentication routes */}
                <Route
                  path="/"
                  element={<Splash />}
                />

                <Route
                  path="/signin"
                  element={<SignIn />}
                />

                <Route
                  path="/activate"
                  element={<Activate />}
                />

                <Route
                  path="/forgot"
                  element={<Forgot />}
                />

                {/* Authenticated Member Application */}
                <Route
                  element={
                    <RequireAuth>
                      <AppShell />
                    </RequireAuth>
                  }
                >
                  <Route
                    path="/home"
                    element={<Home />}
                  />

                  <Route
                    path="/members"
                    element={<Members />}
                  />

                  <Route
                    path="/members/:id"
                    element={<MemberProfile />}
                  />

                  <Route
                    path="/institutions"
                    element={<Institutions />}
                  />

                  <Route
                    path="/institutions/:id"
                    element={<InstitutionProfile />}
                  />

                  <Route
                    path="/events"
                    element={<Events />}
                  />

                  <Route
                    path="/events/:id"
                    element={<EventDetail />}
                  />

                  <Route
                    path="/news"
                    element={<News />}
                  />

                  <Route
                    path="/news/:id"
                    element={<NewsArticle />}
                  />

                  <Route
                    path="/province"
                    element={<ProvinceHome />}
                  />

                  <Route
                    path="/about"
                    element={<About />}
                  />

                  <Route
                    path="/administration"
                    element={<Administration />}
                  />

                  <Route
                    path="/administration/:id"
                    element={<Administration />}
                  />

                  <Route
                    path="/gallery"
                    element={<Gallery />}
                  />

                  <Route
                    path="/vocation"
                    element={<Vocation />}
                  />

                  <Route
                    path="/chavarul"
                    element={<Chavarul />}
                  />

                  <Route
                    path="/chavarul/:id"
                    element={<Chavarul />}
                  />

                  <Route
                    path="/contact"
                    element={<Contact />}
                  />

                  <Route
                    path="/more"
                    element={<More />}
                  />

                  <Route
                    path="/more/:section"
                    element={<MoreCategory />}
                  />

                  <Route
                    path="/more/:section/:item"
                    element={<MoreCategoryItem />}
                  />

                  <Route
                    path="/account"
                    element={<Account />}
                  />

                  <Route
                    path="/settings"
                    element={<Settings />}
                  />
                </Route>

                {/* Super Administrator */}
                <Route
                  path="/admin/*"
                  element={
                    <RequireAdmin>
                      <AdminRoutes />
                    </RequireAdmin>
                  }
                />

                {/* Unknown route */}
                <Route
                  path="*"
                  element={
                    <Navigate
                      to="/"
                      replace
                    />
                  }
                />
              </Routes>
            </HashRouter>
          </ToastProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}