import { useState } from "react";
import { User, UserCog } from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { useScanStore } from "../../store/scanStore";

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
    <div className="max-w-2xl mx-auto md:max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your operator identity and account details.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 md:p-6 flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
          <User size={36} className="text-primary-foreground" />
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

      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <SectionHeader icon={UserCog} title="Edit Profile" />
        <div className="space-y-4">
          <Field label="Full Name">
            <Input value={store.name} onChange={(v) => store.setField("name", v)} />
          </Field>
          <Field label="Email Address">
            <Input value={store.email} onChange={(v) => store.setField("email", v)} type="email" />
          </Field>
          <Field label="Role">
            <Input value={store.role} onChange={(v) => store.setField("role", v)} />
          </Field>
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
    </div>
  );
}
