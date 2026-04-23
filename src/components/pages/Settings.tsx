import { useState } from "react";
import { User, Shield, Bell, LogOut } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={16} className="text-primary" />
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
    />
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-200 ${enabled ? "bg-primary" : "bg-muted border border-border"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}

const PRIORITY_OPTIONS = [
  { value: "ALL_ALERTS", label: "All Alerts", desc: "Receive every notification." },
  { value: "CRITICAL_ONLY", label: "Critical Only", desc: "Only deepfake detections." },
] as const;

export function Settings() {
  const store = useSettingsStore();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    store.save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto md:max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">System Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your security parameters and notification preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <SectionHeader icon={User} title="Account Settings" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Operator Name">
            <Input value={store.operatorName} onChange={(v) => store.setField("operatorName", v)} />
          </Field>
          <Field label="Secure Email">
            <Input value={store.email} onChange={(v) => store.setField("email", v)} type="email" />
          </Field>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <SectionHeader icon={Shield} title="Security" />
        <div className="flex items-center justify-between gap-4 py-1">
          <div>
            <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground mt-0.5">Secure your account with biometric or mobile verification.</p>
          </div>
          <Toggle enabled={store.twoFactor} onToggle={() => store.setField("twoFactor", !store.twoFactor)} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <SectionHeader icon={Bell} title="Notifications" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRIORITY_OPTIONS.map((p) => {
            const active = store.notificationPriority === p.value;
            return (
              <button
                key={p.value}
                onClick={() => store.setField("notificationPriority", p.value)}
                className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                  active
                    ? "bg-primary/10 border-primary/40 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                }`}
              >
                <p className={`text-sm font-semibold ${active ? "text-primary" : ""}`}>{p.label}</p>
                <p className="text-xs mt-0.5 text-muted-foreground">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <button className="w-full md:w-auto px-6 py-3 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors uppercase tracking-wider">
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/75 transition-colors uppercase tracking-wider"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="bg-card border border-red-500/20 rounded-lg p-4 md:p-6 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-foreground">Sign Out</p>
        <button className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/10 transition-colors shrink-0">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}
