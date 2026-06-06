"use client";

import { useEffect } from "react";

// This page loads the legacy multipurpose Bootstrap admin template
// as the new dashboard for STI-Expert internal tools.
// Assets are served from /admin-theme/assets/

export default function LegacyAdminDashboard() {
  useEffect(() => {
    // Dynamically load the template's main CSS and JS
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadCSS = (href: string) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    };

    // Load core styles from the template
    loadCSS("/admin-theme/assets/css/bootstrap.min.css");
    loadCSS("/admin-theme/assets/css/style.css");
    loadCSS("/admin-theme/assets/css/responsive.css");

    // Load main JS (the template uses many plugins, load key ones)
    loadScript("/admin-theme/assets/js/jquery.min.js")
      .then(() => loadScript("/admin-theme/assets/js/bootstrap.min.js"))
      .then(() => loadScript("/admin-theme/assets/js/custom.js"))
      .catch((e) => console.warn("Template JS partial load:", e));

    // Optional: you can add more plugin scripts here as needed
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* We embed the template's dashboard structure */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">STI-Expert Admin</h1>
            <p className="text-sm text-gray-500">Legacy Multipurpose Bootstrap Dashboard</p>
          </div>
          <div className="text-xs text-gray-400">
            205 legacy experts imported • Using PVR admin template
          </div>
        </div>

        {/* Main dashboard content from template style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Stat cards - styled after the template */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Experts</p>
                <p className="text-3xl font-semibold mt-1">205</p>
              </div>
              <div className="text-4xl opacity-70">👨‍🔬</div>
            </div>
            <div className="mt-2 text-xs text-emerald-600">+12 from GlobalVySa</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Verified Profiles</p>
                <p className="text-3xl font-semibold mt-1">87</p>
              </div>
              <div className="text-4xl opacity-70">✅</div>
            </div>
            <div className="mt-2 text-xs text-blue-600">42% completion rate</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Pending VCs</p>
                <p className="text-3xl font-semibold mt-1">31</p>
              </div>
              <div className="text-4xl opacity-70">📜</div>
            </div>
            <div className="mt-2 text-xs text-amber-600">Waiting issuance</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Active Matches</p>
                <p className="text-3xl font-semibold mt-1">156</p>
              </div>
              <div className="text-4xl opacity-70">🔗</div>
            </div>
            <div className="mt-2 text-xs text-purple-600">This month</div>
          </div>
        </div>

        {/* Quick links to template demo pages (you can expand these) */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
          <h3 className="font-semibold mb-3">Legacy Admin Sections (from PVR template)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <a href="/admin-theme/pvr_dashboard_v2.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">Dashboard v2</a>
            <a href="/admin-theme/pvr_dashboard_v3.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">Dashboard v3</a>
            <a href="/admin-theme/pvr_app_ecommerce.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">E-commerce</a>
            <a href="/admin-theme/pvr_chart_chartjs.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">Charts</a>
            <a href="/admin-theme/pvr_app_contact_v1.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">Contacts</a>
            <a href="/admin-theme/pvr_form_file_upload.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">File Upload</a>
            <a href="/admin-theme/pvr_app_calendar.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">Calendar</a>
            <a href="/admin-theme/pvr_ess_profile.html" target="_blank" className="block p-3 border rounded hover:bg-gray-50">Profile</a>
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            These are the original static HTML demos from the template. We will progressively convert the useful ones into real React pages connected to our Django API.
          </p>
        </div>

        {/* Real data section - Legacy Experts */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
            <div className="font-semibold">Legacy Experts (205 imported)</div>
            <a href="/dashboard/search" className="text-sm text-blue-600 hover:underline">Go to Search →</a>
          </div>
          <div className="p-4 text-sm text-gray-600">
            The 205 experts from the old production (GlobalVySa dump) are now in the database with full schema (education, certificates, awards, papers, patents, projects, etc.).
            <br />
            Avatars were attempted from the original image URLs. Some succeeded.
          </div>
          <div className="px-5 pb-4">
            <a 
              href="/dashboard/search" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Open Expert Search
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
