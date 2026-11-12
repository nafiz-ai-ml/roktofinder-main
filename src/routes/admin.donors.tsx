import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search as SearchIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  supabaseAdminAuth,
  adminErrorBn,
  type AdminUser,
  type DirectoryDonorRow,
} from "@/lib/admin";
import {
  BLOOD_GROUPS,
  MYMENSINGH_AREA_GROUPS,
  MYMENSINGH_UPAZILAS,
  daysSince,
  toBnNum,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin/donors")({
  head: () => ({
    meta: [
      { title: "ডোনার ডিরেক্টরি — অ্যাডমিন" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AdminShell>{(admin) => <DonorDirectory admin={admin} />}</AdminShell>,
});

const ANY = "__any__";

interface FormState {
  id?: string;
  name: string;
  phone: string;
  blood_group: string;
  district: string;
  area: string;
  upazila: string;
  address: string;
  last_donation_date: string;
  is_available: boolean;
  phone_visible: boolean;
  admin_notes: string;
  source_label: string;
}

const emptyForm: FormState = {
  name: "",
  phone: "",
  blood_group: "",
  district: "ময়মনসিংহ",
  area: "",
  upazila: "",
  address: "",
  last_donation_date: "",
  is_available: true,
  phone_visible: true,
  admin_notes: "",
  source_label: "",
};

function DonorDirectory({ admin }: { admin: AdminUser }) {
  const [rows, setRows] = useState<DirectoryDonorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [bg, setBg] = useState(ANY);
  const [area, setArea] = useState(ANY);
  const [avail, setAvail] = useState(ANY);
  const [source, setSource] = useState<"admin_directory" | "self_registered" | typeof ANY>(ANY);
  const [showArchived, setShowArchived] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [dupes, setDupes] = useState<
    { id: string; name: string; phone: string; blood_group: string; area: string | null }[]
  >([]);
  const [confirmDelete, setConfirmDelete] = useState<DirectoryDonorRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabaseAdminAuth
      .from("donors")
      .select(
        "id,name,phone,blood_group,address,area,division,district,upazila,donor_source,admin_notes,source_label,last_donation_date,donation_count,is_available,phone_visible,archived_at,created_at,updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) {
      toast.error(adminErrorBn(error.message));
      return;
    }
    setRows((data ?? []) as DirectoryDonorRow[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (showArchived ? !r.archived_at : !!r.archived_at) return false;
      if (bg !== ANY && r.blood_group !== bg) return false;
      if (area !== ANY && r.area !== area) return false;
      if (source !== ANY && r.donor_source !== source) return false;
      if (avail !== ANY && String(r.is_available) !== avail) return false;
      if (needle) {
        const hay = `${r.name} ${r.phone} ${r.area ?? ""} ${r.district ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, q, bg, area, avail, source, showArchived]);

  const openAdd = () => {
    setForm(emptyForm);
    setDupes([]);
    setFormOpen(true);
  };

  const openEdit = (r: DirectoryDonorRow) => {
    setForm({
      id: r.id,
      name: r.name,
      phone: r.phone,
      blood_group: r.blood_group,
      district: r.district ?? "ময়মনসিংহ",
      area: r.area ?? "",
      upazila: r.upazila ?? "",
      address: r.address ?? "",
      last_donation_date: r.last_donation_date ?? "",
      is_available: r.is_available,
      phone_visible: r.phone_visible ?? true,
      admin_notes: r.admin_notes ?? "",
      source_label: r.source_label ?? "",
    });
    setDupes([]);
    setFormOpen(true);
  };

  const checkDupes = async () => {
    if (form.phone.replace(/\D/g, "").length < 6) return;
    const { data } = await supabaseAdminAuth.rpc("admin_check_duplicate", {
      _phone: form.phone,
      _name: form.name || null,
      _bg: form.blood_group || null,
      _area: form.area || null,
    });
    const list = ((data ?? []) as DirectoryDonorRow[]).filter((d) => d.id !== form.id);
    setDupes(list);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.blood_group || !form.area) {
      toast.error("নাম, মোবাইল, রক্তের গ্রুপ ও এলাকা দিতে হবে");
      return;
    }
    setSaving(true);
    const payload = {
      _name: form.name.trim(),
      _phone: form.phone.trim(),
      _blood_group: form.blood_group,
      _district: form.district || "ময়মনসিংহ",
      _area: form.area,
      _upazila: form.upazila || null,
      _address: form.address || null,
      _last_donation_date: form.last_donation_date || null,
      _is_available: form.is_available,
      _phone_visible: form.phone_visible,
      _admin_notes: form.admin_notes || null,
      _source_label: form.source_label || null,
    };

    const { error } = form.id
      ? await supabaseAdminAuth.rpc("admin_update_directory_donor", {
          _id: form.id,
          ...payload,
        })
      : await supabaseAdminAuth.rpc("admin_create_directory_donor", {
          ...payload,
          _division: "ময়মনসিংহ",
        });

    setSaving(false);
    if (error) {
      toast.error(adminErrorBn(error.message));
      return;
    }
    toast.success(
      form.id ? "ডোনারের তথ্য আপডেট হয়েছে" : "ডোনার RoktoFinder ডিরেক্টরিতে যোগ হয়েছে",
    );
    setFormOpen(false);
    load();
  };

  const toggleAvailability = async (r: DirectoryDonorRow) => {
    const { error } = await supabaseAdminAuth.rpc("admin_set_directory_availability", {
      _id: r.id,
      _is_available: !r.is_available,
    });
    if (error) return toast.error(adminErrorBn(error.message));
    toast.success("উপলব্ধতা আপডেট হয়েছে");
    load();
  };

  const setArchived = async (r: DirectoryDonorRow, archived: boolean) => {
    const { error } = await supabaseAdminAuth.rpc("admin_archive_directory_donor", {
      _id: r.id,
      _archived: archived,
    });
    if (error) return toast.error(adminErrorBn(error.message));
    toast.success(archived ? "আর্কাইভ করা হয়েছে" : "পুনরুদ্ধার করা হয়েছে");
    load();
  };

  const hardDelete = async () => {
    if (!confirmDelete) return;
    const { error } = await supabaseAdminAuth.rpc("admin_delete_directory_donor", {
      _id: confirmDelete.id,
    });
    setConfirmDelete(null);
    if (error) return toast.error(adminErrorBn(error.message));
    toast.success("স্থায়ীভাবে ডিলিট হয়েছে");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">ডোনার ডিরেক্টরি</h1>
          <p className="text-sm text-muted-foreground">
            মোট {toBnNum(filtered.length)} জন দেখানো হচ্ছে
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            রিফ্রেশ
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            ডোনার যোগ করুন
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-2 rounded-xl border border-border bg-card p-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="নাম / মোবাইল / এলাকা"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={bg} onValueChange={setBg}>
          <SelectTrigger>
            <SelectValue placeholder="রক্তের গ্রুপ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>সব গ্রুপ</SelectItem>
            {BLOOD_GROUPS.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger>
            <SelectValue placeholder="এলাকা" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>সব এলাকা</SelectItem>
            {MYMENSINGH_AREA_GROUPS.map((grp) => (
              <SelectGroup key={grp.label}>
                <SelectLabel>{grp.label}</SelectLabel>
                {grp.areas.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <Select value={avail} onValueChange={setAvail}>
          <SelectTrigger>
            <SelectValue placeholder="উপলব্ধতা" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>সব</SelectItem>
            <SelectItem value="true">উপলব্ধ</SelectItem>
            <SelectItem value="false">অনুপলব্ধ</SelectItem>
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={(v) => setSource(v as typeof source)}>
          <SelectTrigger>
            <SelectValue placeholder="ধরন" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY}>সব ধরন</SelectItem>
            <SelectItem value="self_registered">নিজে রেজিস্টার</SelectItem>
            <SelectItem value="admin_directory">ডিরেক্টরি</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 lg:col-span-5">
          <Switch
            id="show-archived"
            checked={showArchived}
            onCheckedChange={setShowArchived}
          />
          <Label htmlFor="show-archived" className="text-sm">
            আর্কাইভ করা ডোনার দেখান
          </Label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          কোনো ডোনার পাওয়া যায়নি।
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">নাম</th>
                  <th className="px-3 py-2">গ্রুপ</th>
                  <th className="px-3 py-2">মোবাইল</th>
                  <th className="px-3 py-2">এলাকা</th>
                  <th className="px-3 py-2">জেলা</th>
                  <th className="px-3 py-2">উপলব্ধতা</th>
                  <th className="px-3 py-2">শেষ রক্তদান</th>
                  <th className="px-3 py-2">ধরন</th>
                  <th className="px-3 py-2 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="px-3 py-2 font-medium text-foreground">{r.name}</td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary">{r.blood_group}</Badge>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{r.phone}</td>
                    <td className="px-3 py-2">{r.area ?? "—"}</td>
                    <td className="px-3 py-2">{r.district ?? "—"}</td>
                    <td className="px-3 py-2">
                      {r.is_available ? (
                        <span className="text-emerald-600 dark:text-emerald-400">উপলব্ধ</span>
                      ) : (
                        <span className="text-muted-foreground">অনুপলব্ধ</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{lastDonationBn(r.last_donation_date)}</td>
                    <td className="px-3 py-2">
                      <SourceBadge source={r.donor_source} />
                    </td>
                    <td className="px-3 py-2">
                      <RowActions
                        row={r}
                        admin={admin}
                        onEdit={() => openEdit(r)}
                        onToggle={() => toggleAvailability(r)}
                        onArchive={(v) => setArchived(r, v)}
                        onDelete={() => setConfirmDelete(r)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.area ?? "—"} · {r.district ?? "—"}
                    </div>
                  </div>
                  <Badge variant="secondary">{r.blood_group}</Badge>
                </div>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <div className="tabular-nums">{r.phone}</div>
                  <div>শেষ রক্তদান: {lastDonationBn(r.last_donation_date)}</div>
                  <div className="flex items-center gap-2">
                    <SourceBadge source={r.donor_source} />
                    {r.is_available ? (
                      <span className="text-emerald-600 dark:text-emerald-400">উপলব্ধ</span>
                    ) : (
                      <span>অনুপলব্ধ</span>
                    )}
                  </div>
                  {r.admin_notes && <div>নোট: {r.admin_notes}</div>}
                </div>
                <div className="mt-3">
                  <RowActions
                    row={r}
                    admin={admin}
                    onEdit={() => openEdit(r)}
                    onToggle={() => toggleAvailability(r)}
                    onArchive={(v) => setArchived(r, v)}
                    onDelete={() => setConfirmDelete(r)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-muted-foreground">
        যোগাযোগের আগে ডোনার যাচাই করুন। শুধুমাত্র মেডিক্যালি সক্ষম হলেই রক্ত দিন।
      </p>

      {/* Add / edit dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "ডিরেক্টরি ডোনার এডিট" : "নতুন ডিরেক্টরি ডোনার"}
            </DialogTitle>
            <DialogDescription>
              এই রেকর্ডের জন্য কোনো লগইন অ্যাকাউন্ট তৈরি হবে না।
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={save} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="d-name">পূর্ণ নাম *</Label>
              <Input
                id="d-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-phone">মোবাইল নম্বর *</Label>
              <Input
                id="d-phone"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onBlur={checkDupes}
                required
              />
            </div>

            {dupes.length > 0 && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs">
                <div className="font-semibold text-destructive">
                  এই মোবাইল নম্বর দিয়ে একজন ডোনার ইতিমধ্যে যুক্ত আছেন।
                </div>
                <ul className="mt-2 space-y-1 text-foreground">
                  {dupes.map((d) => (
                    <li key={d.id}>
                      {d.name} · {d.blood_group} · {d.area ?? "—"} · {d.phone}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>রক্তের গ্রুপ *</Label>
                <Select
                  value={form.blood_group}
                  onValueChange={(v) => setForm({ ...form, blood_group: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="বাছাই করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>এলাকা *</Label>
                <Select value={form.area} onValueChange={(v) => setForm({ ...form, area: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="বাছাই করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {MYMENSINGH_AREA_GROUPS.map((grp) => (
                      <SelectGroup key={grp.label}>
                        <SelectLabel>{grp.label}</SelectLabel>
                        {grp.areas.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-district">জেলা</Label>
                <Input
                  id="d-district"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>উপজেলা</Label>
                <Select
                  value={form.upazila || ANY}
                  onValueChange={(v) => setForm({ ...form, upazila: v === ANY ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="প্রযোজ্য নয়" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>প্রযোজ্য নয়</SelectItem>
                    {MYMENSINGH_UPAZILAS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="d-address">বিস্তারিত ঠিকানা</Label>
                <Input
                  id="d-address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-date">শেষ রক্তদানের তারিখ</Label>
                <Input
                  id="d-date"
                  type="date"
                  value={form.last_donation_date}
                  onChange={(e) => setForm({ ...form, last_donation_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-source">সোর্স (অ্যাডমিন-only)</Label>
                <Input
                  id="d-source"
                  placeholder="যেমন: ক্যাম্পেইন ২০২৬"
                  value={form.source_label}
                  onChange={(e) => setForm({ ...form, source_label: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="d-notes">অ্যাডমিন নোট (কখনো পাবলিক হবে না)</Label>
              <Textarea
                id="d-notes"
                rows={2}
                value={form.admin_notes}
                onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="d-avail"
                  checked={form.is_available}
                  onCheckedChange={(v) => setForm({ ...form, is_available: v })}
                />
                <Label htmlFor="d-avail">উপলব্ধ</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="d-phone-visible"
                  checked={form.phone_visible}
                  onCheckedChange={(v) => setForm({ ...form, phone_visible: v })}
                />
                <Label htmlFor="d-phone-visible">মোবাইল নম্বর প্রকাশ্য</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                সেভ করুন
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>স্থায়ীভাবে ডিলিট?</DialogTitle>
            <DialogDescription>
              {confirmDelete?.name} — এই রেকর্ড আর ফেরানো যাবে না। সাধারণত আর্কাইভ করাই ভালো।
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              বাতিল
            </Button>
            <Button variant="destructive" onClick={hardDelete}>
              ডিলিট করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RowActions({
  row,
  admin,
  onEdit,
  onToggle,
  onArchive,
  onDelete,
}: {
  row: DirectoryDonorRow;
  admin: AdminUser;
  onEdit: () => void;
  onToggle: () => void;
  onArchive: (archived: boolean) => void;
  onDelete: () => void;
}) {
  const isDirectory = row.donor_source === "admin_directory";
  if (!isDirectory) {
    return (
      <div className="text-right text-xs text-muted-foreground">
        নিজে রেজিস্টার — ডোনার নিজেই আপডেট করেন
      </div>
    );
  }
  return (
    <div className="flex flex-wrap justify-end gap-1.5">
      <Button size="sm" variant="outline" onClick={onEdit}>
        <Pencil className="h-3.5 w-3.5" />
        এডিট
      </Button>
      <Button size="sm" variant="outline" onClick={onToggle}>
        {row.is_available ? "অনুপলব্ধ করুন" : "উপলব্ধ করুন"}
      </Button>
      {row.archived_at ? (
        <Button size="sm" variant="outline" onClick={() => onArchive(false)}>
          <ArchiveRestore className="h-3.5 w-3.5" />
          পুনরুদ্ধার
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={() => onArchive(true)}>
          <Archive className="h-3.5 w-3.5" />
          আর্কাইভ
        </Button>
      )}
      {admin.role === "super_admin" && (
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  return source === "admin_directory" ? (
    <Badge variant="outline">RoktoFinder Directory</Badge>
  ) : (
    <Badge variant="outline">RoktoFinder Donor</Badge>
  );
}

function lastDonationBn(date: string | null) {
  if (!date) return "তথ্য নেই";
  const d = daysSince(date);
  return d === null ? "তথ্য নেই" : `${toBnNum(d)} দিন আগে`;
}
