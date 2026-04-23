import { useState } from "react";
import { Eye, EyeOff, User, Shield, SlidersHorizontal } from "lucide-react";
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

export function Settings() {
  const store = useSettingsStore();
  const [showKey, setShowKey] = useState(false);
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
        <p className="text-sm text-muted-foreground mt-1">Manage your security parameters, credentials, and interface preferences.</p>
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

      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <SectionHeader icon={Shield} title="Security" />

        <Field label="API Access Key">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={store.apiKey}
              onChange={(e) => store.setField("apiKey", e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 pr-11 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Use this key for programmatic access to the detection engine.</p>
        </Field>

        <div className="bg-muted/40 border border-border rounded-lg px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Secure your terminal with biometric or mobile verification.</p>
          </div>
          <button
            onClick={() => store.setField("twoFactor", !store.twoFactor)}
            className={`w-11 h-6 rounded-full relative transition-colors ${store.twoFactor ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${store.twoFactor ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <SectionHeader icon={SlidersHorizontal} title="Preferences" />

        <Field label="System Language">
          <select
            value={store.language}
            onChange={(e) => store.setField("language", e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {["English (US)", "English (UK)", "French", "German", "Spanish"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </Field>

        <Field label="Notification Priority">
          <div className="flex gap-2">
            {(["ALL_ALERTS", "CRITICAL_ONLY"] as const).map((p) => (
              <button
                key={p}
                onClick={() => store.setField("notificationPriority", p)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  store.notificationPriority === p
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.replace("_", " ")}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="flex gap-3 justify-end">
        <button className="px-6 py-3 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors uppercase tracking-wider">
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/75 transition-colors uppercase tracking-wider"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
