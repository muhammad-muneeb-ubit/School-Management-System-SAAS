import { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/SuperAdminLayout';
import api from '../../services/api';
import { showSuccess, showError } from '../../utils/sweetAlert';

export default function Branding() {
  const [theme, setTheme] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setTheme(res.data.theme || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings/theme', theme);

      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        const cssVariable = key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        root.style.setProperty(`--${cssVariable}`, value);
      });

      showSuccess('Branding updated successfully!');
    } catch (err) {
      console.error(err);
      showError('Failed to update theme');
    } finally {
      setSaving(false);
    }
  };

  const colorGroups = [
    {
      title: 'Primary Colors',
      colors: [
        { key: 'primary', label: 'Primary' },
        { key: 'primaryHover', label: 'Primary Hover' },
        { key: 'primaryLight', label: 'Primary Light' },
        { key: 'primaryDark', label: 'Primary Dark' },
      ],
    },
    {
      title: 'Accent Colors',
      colors: [
        { key: 'secondary', label: 'Secondary' },
        { key: 'secondaryHover', label: 'Secondary Hover' },
        { key: 'secondaryLight', label: 'Secondary Light' },
      ],
    },
    {
      title: 'Sidebar Colors',
      colors: [
        { key: 'sidebarBg', label: 'Sidebar Background' },
        { key: 'sidebarHover', label: 'Sidebar Hover' },
        { key: 'sidebarActive', label: 'Sidebar Active' },
      ],
    },
  ];

  const totalColors = colorGroups.reduce((sum, group) => sum + group.colors.length, 0);

  const bannerStyle = {
    background: `linear-gradient(135deg, ${theme.primary || '#2563eb'}, ${theme.sidebarBg || '#1f2937'})`,
  };

  const previewStyle = {
    background: theme.sidebarBg || '#1f2937',
    primary: theme.primary || '#2563eb',
    primaryLight: theme.primaryLight || '#dbeafe',
    secondary: theme.secondary || '#10b981',
    secondaryLight: theme.secondaryLight || '#d1fae5',
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-4">
        <div className="text-white rounded-2xl p-4 shadow-sm" style={bannerStyle}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[15px] uppercase tracking-[0.2em] text-white/80 mb-1">Branding Center</p>
              <h1 className="text-xl md:text-2xl font-bold">School Branding & Theming</h1>
            </div>
            <span className="inline-flex items-center rounded-full bg-white/10 border border-white/15 px-2.5 py-1 text-[15px] font-medium text-white/90">
              Live theme editor
            </span>
          </div>
          <p className="mt-2 text-md text-white/85 max-w-2xl">
            Customize the application colors to match your school’s brand while keeping the same core theme keys used throughout the app.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Core Brand Colors</h2>
              <p className="text-lg text-slate-500">Update the theme values used across the platform.</p>
            </div>
            <div className="h-8 w-8 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 font-semibold text-md">
              {totalColors}
            </div>
          </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {colorGroups.map((group) => (
                  <div key={group.title} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <h3 className="text-md font-semibold text-slate-700 mb-2">{group.title}</h3>
                    <div className="space-y-2">
                      {group.colors.map((c) => (
                        <div
                          key={c.key}
                          className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2"
                        >
                          <label className="text-[14px] font-medium text-slate-700 w-36 truncate">{c.label}</label>

                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={theme[c.key] || '#2563eb'}
                              onChange={(e) => setTheme({ ...theme, [c.key]: e.target.value })}
                              className="h-8 w-10 rounded-md border border-slate-200 bg-white p-0.5 cursor-pointer"
                            />

                            <input
                              type="text"
                              value={theme[c.key] || ''}
                              onChange={(e) => setTheme({ ...theme, [c.key]: e.target.value })}
                              className="w-20 border border-slate-200 bg-white p-1.5 rounded-md text-[14px] font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                              placeholder="#2563eb"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium transition text-md"
                style={{ backgroundColor: theme.primary || '#2563eb' }}
              >
                {saving ? 'Saving...' : 'Save Branding Settings'}
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Live Preview</h3>

              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                <div className="flex h-52">
                  <aside
                    className="w-32 p-3 text-white"
                    style={{ backgroundColor: previewStyle.background }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold tracking-wide">SMS</span>
                    </div>
                    <div className="space-y-2 mt-5">
                      {[1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="h-2 rounded-full opacity-80"
                          style={{
                            backgroundColor: item === 1 ? previewStyle.primaryLight : 'rgba(255,255,255,0.22)',
                          }}
                        />
                      ))}
                    </div>
                  </aside>

                  <div className="flex-1 bg-slate-50 p-3">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-3 w-20 rounded-full bg-slate-200" />
                      <button
                        className="px-2 py-1 text-[10px] rounded-full text-white font-medium"
                        style={{ backgroundColor: previewStyle.primary }}
                      >
                        Action
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="h-20 w-24 rounded-xl" style={{ backgroundColor: previewStyle.primaryLight }} />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/5 rounded-full bg-slate-200" />
                          <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                          <div className="h-3 w-2/5 rounded-full bg-slate-200" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl p-3" style={{ backgroundColor: previewStyle.secondaryLight }}>
                          <div className="h-2 w-10 rounded-full mb-2" style={{ backgroundColor: previewStyle.secondary }} />
                          <div className="h-2 w-16 rounded-full bg-white/80" />
                        </div>
                        <div className="rounded-xl p-3 bg-white border border-slate-200">
                          <div className="h-2 w-10 rounded-full mb-2 bg-slate-300" />
                          <div className="h-2 w-16 rounded-full bg-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </SuperAdminLayout>
  );
}