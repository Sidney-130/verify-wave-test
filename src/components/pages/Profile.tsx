import { useState } from "react";
import { User, Mail, Shield } from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { useScanStore } from "../../store/scanStore";

export function Profile() {
  const store = useUserStore();
  const scans = useScanStore((s) => s.scans);
  const [saved, setSaved] = useState(false);

  const totalScans = scans.length;
  const fakeDetected = scans.filter((s) => s.status === "FAKE").length;
  const authentic = scans.filter((s) => s.status === "AUTHENTIC").length;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your operator identity and account details.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <User size={36} className="text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{store.name}</p>
          <p className="text-sm text-muted-foreground">{store.email}</p>
          <span className="inline-block mt-2 px-3 py-0.5 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-wider rounded-full">
            {store.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Scans", value: totalScans },
          { label: "Fake Detected", value: fakeDetected },
          { label: "Authentic", value: authentic },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h2 className="text-base font-bold text-foreground">Edit Profile</h2>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={store.name}
              onChange={(e) => store.setField("name", e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={store.email}
              onChange={(e) => store.setField("email", e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Role</label>
          <div className="relative">
            <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={store.role}
              onChange={(e) => store.setField("role", e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/75 transition-colors uppercase tracking-wider text-sm"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
