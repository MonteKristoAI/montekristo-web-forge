import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { useSavedField, SaveBadge } from "@/lib/mk-onboarding/useSavedField";
import { Section, FieldLabel, inputCls, textareaCls } from "../components/primitives";

type Audit = {
  id: string;
  client_id: string;
  positioning_strength: number | null;
  differentiation_notes: string | null;
  primary_channels: string[] | null;
  active_offers: string | null;
  lead_magnets: string | null;
  conversion_bottlenecks: string | null;
  mk_growth_ideas: string | null;
  last_reviewed_at: string | null;
};

export default function BusinessTab({ client }: { client: MkClient }) {
  const [audit, setAudit] = useState<Audit | null>(null);

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_marketing_audit")
      .select("*")
      .eq("client_id", client.id)
      .maybeSingle();
    if (data) setAudit(data as unknown as Audit);
    else {
      const { data: created } = await mkSupabase
        .from("mk_client_marketing_audit")
        .insert({ client_id: client.id })
        .select()
        .single();
      setAudit(created as unknown as Audit);
    }
  };

  useEffect(() => {
    load();
  }, [client.id]);

  if (!audit) return <p className="font-inter text-sm text-[#5A6577]">Ucitavam…</p>;

  const save = (fields: Partial<Audit>) => async () => {
    const { error } = await mkSupabase.from("mk_client_marketing_audit").update(fields).eq("id", audit.id);
    if (error) throw error;
  };

  return <Form audit={audit} onSave={save} />;
}

function Form({
  audit,
  onSave,
}: {
  audit: Audit;
  onSave: (fields: Partial<Audit>) => () => Promise<void>;
}) {
  const [pos, setPos, posStatus] = useSavedField(audit.positioning_strength ?? "", async (v) => {
    await onSave({ positioning_strength: v === "" ? null : Number(v) })();
  });
  const [diff, setDiff, diffStatus] = useSavedField(audit.differentiation_notes ?? "", (v) => onSave({ differentiation_notes: v || null })());
  const [channels, setChannels, chanStatus] = useSavedField(
    (audit.primary_channels ?? []).join(", "),
    async (v) => {
      const arr = v.split(",").map((s) => s.trim()).filter(Boolean);
      await onSave({ primary_channels: arr })();
    }
  );
  const [offers, setOffers, offersStatus] = useSavedField(audit.active_offers ?? "", (v) => onSave({ active_offers: v || null })());
  const [leadMags, setLeadMags, lmStatus] = useSavedField(audit.lead_magnets ?? "", (v) => onSave({ lead_magnets: v || null })());
  const [bottlenecks, setBottlenecks, bnStatus] = useSavedField(audit.conversion_bottlenecks ?? "", (v) => onSave({ conversion_bottlenecks: v || null })());
  const [ideas, setIdeas, ideasStatus] = useSavedField(audit.mk_growth_ideas ?? "", (v) => onSave({ mk_growth_ideas: v || null })());

  return (
    <div className="space-y-5">
      <Section title="Pozicioniranje" description="Kako klijent stoji u poredjenju sa konkurencijom i sta ih razdvaja.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel hint={<SaveBadge status={posStatus} />}>Jacina pozicije (1-10)</FieldLabel>
            <input type="number" min={1} max={10} value={String(pos)} onChange={(e) => setPos(e.target.value)} className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel hint={<SaveBadge status={diffStatus} />}>Differentiation notes</FieldLabel>
            <textarea value={diff} onChange={(e) => setDiff(e.target.value)} rows={2} className={textareaCls} placeholder="Sta ih zaista razdvaja od konkurencije?" />
          </div>
        </div>
      </Section>

      <Section title="Kanali i ponude">
        <div className="space-y-4">
          <div>
            <FieldLabel hint={<SaveBadge status={chanStatus} />}>Primary channels (comma-separated)</FieldLabel>
            <input value={channels} onChange={(e) => setChannels(e.target.value)} className={inputCls} placeholder="Google organic, Instagram, Meta ads, Podcast" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={offersStatus} />}>Active offers</FieldLabel>
            <textarea value={offers} onChange={(e) => setOffers(e.target.value)} rows={3} className={textareaCls} placeholder="Paketi, cene, promocije, launch offers…" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={lmStatus} />}>Lead magnets</FieldLabel>
            <textarea value={leadMags} onChange={(e) => setLeadMags(e.target.value)} rows={2} className={textareaCls} placeholder="Kvizovi, vodici, free samples, webinari…" />
          </div>
        </div>
      </Section>

      <Section title="Conversion bottlenecks" description="Gde se konverzija lomi kod ovog klijenta.">
        <div>
          <FieldLabel hint={<SaveBadge status={bnStatus} />}>Bottlenecks</FieldLabel>
          <textarea value={bottlenecks} onChange={(e) => setBottlenecks(e.target.value)} rows={4} className={textareaCls} placeholder="npr. 'landing page bez social proof', 'booking form predugacak'…" />
        </div>
      </Section>

      <Section
        title="MK growth ideas"
        description="Sta bi uradili ako bi ovo bio NAS biznis. Slobodan markdown format."
      >
        <FieldLabel hint={<SaveBadge status={ideasStatus} />}>Growth ideas</FieldLabel>
        <textarea
          value={ideas}
          onChange={(e) => setIdeas(e.target.value)}
          rows={14}
          className={textareaCls}
          placeholder="Kratko-rocne i dugo-rocne ideje za unapredjenje. Marketing, positioning, nove ponude, nove kanale, tech…"
        />
      </Section>
    </div>
  );
}
