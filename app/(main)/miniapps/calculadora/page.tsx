"use client";

import { useState, useMemo } from "react";
import { Home, Handshake, Users, Percent, Building2, ChevronDown, UserCheck, Award } from "lucide-react";

// Las variables de color quedan igual
const NAVY = "#0B2545";
const RED = "#C8102E";
const BLUE = "#003DA5";
const GOLD = "#B08D2B";
const SILVER = "#7C8797";
const TEAL = "#1C7293";
const PURPLE = "#6D4C9F";
const GREEN = "#2E9E6D";
const BG = "#F4F5F7";

const REMAX_PERU_PCT = 0.10;
const DIRECTOR_PCT = 0.10;
const REFERIDO_PCT = 0.05;

const LEVELS = {
  plata: { label: "Agente Plata", short: "Plata", pct: 0.5, color: SILVER },
  oro: { label: "Agente Oro", short: "Oro", pct: 0.65, color: GOLD },
  diamante: { label: "Agente Diamante", short: "Diamante", pct: 0.8, color: TEAL },
  team_member: { label: "Team Member", short: "Team Member", pct: null, color: RED },
};

const LEVEL_ORDER = ["plata", "oro", "diamante", "team_member"];

function money(n: number, currency: "USD" | "PEN") {
  if (!isFinite(n)) n = 0;
  const v = n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === "USD" ? `$ ${v}` : `S/ ${v}`;
}

type AgentLevel = keyof typeof LEVELS;

type AgentState = {
  name: string;
  level: AgentLevel;
  hasDirector: boolean;
  directorName: string;
  isReferido: boolean;
  referidoName: string;
};

function defaultAgent(level: AgentLevel): AgentState {
  return {
    name: "",
    level,
    hasDirector: false,
    directorName: "",
    isReferido: false,
    referidoName: "",
  };
}

// Base split: RE/MAX Perú -> agente/oficina (or team member 50/30/20)
function calcAgent(netAmount: number, level: AgentLevel) {
  if (level === "team_member") {
    return { agente: netAmount * 0.5, teamLeader: netAmount * 0.3, oficina: netAmount * 0.2 };
  }
  const pct = LEVELS[level].pct ?? 0;
  return { agente: netAmount * pct, teamLeader: 0, oficina: netAmount * (1 - pct) };
}

// Bonos que la oficina paga sobre lo que se lleva el agente (solo aplica a Agente Plata)
function calcExtras(agentAmount: number, agentState: AgentState) {
  const eligible = agentState.level === "plata";
  const directorBono = eligible && agentState.hasDirector ? agentAmount * DIRECTOR_PCT : 0;
  const referidoBono = eligible && agentState.isReferido ? agentAmount * REFERIDO_PCT : 0;
  return { directorBono, referidoBono };
}

function LevelPicker({ value, onChange }: { value: AgentLevel, onChange: (level: AgentLevel) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
      {LEVEL_ORDER.map((key) => {
        const lv = LEVELS[key as AgentLevel];
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key as AgentLevel)}
            className="rounded-lg px-2 py-1.5 text-[12px] font-semibold border transition-colors sm:px-2.5 sm:text-[13px]"
            style={{
              borderColor: active ? lv.color : "#E2E5EA",
              backgroundColor: active ? lv.color : "#FFFFFF",
              color: active ? "#FFFFFF" : "#4A5568",
            }}
          >
            {lv.short}
          </button>
        );
      })}
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  active,
  onToggle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onToggle: () => void;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between rounded-lg px-3 py-2 border sm:px-4 sm:py-3"
      style={{
        borderColor: active ? color : "#E2E5EA",
        backgroundColor: active ? `${color}14` : "#FFFFFF",
      }}
    >
      <span className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: active ? color : "#4A5568" }}>
        {icon}
        {label}
      </span>
      <span
        className="w-9 h-5 rounded-full relative shrink-0 transition-colors"
        style={{ backgroundColor: active ? color : "#D8DCE3" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: active ? "18px" : "2px" }}
        />
      </span>
    </button>
  );
}

// Collapsible "Bonos de oficina" section: Director Comercial + Referido
function BonosAccordion({
  state,
  setState,
  agentAmount,
  currency,
}: {
  state: AgentState;
  setState: (st: AgentState) => void;
  agentAmount: number;
  currency: "USD" | "PEN";
}) {
  const [open, setOpen] = useState(false);

  if (state.level !== "plata") {
    const msg =
      state.level === "team_member"
        ? "Un Team Member solo tiene Team Leader (ya calculado arriba). No aplica Director Comercial ni Referido."
        : "Director Comercial y Referido solo aplican a Agente Plata.";
    return (
      <div className="rounded-lg bg-[#F4F5F7] px-3 py-2.5 text-[11.5px] text-[#5C6572] sm:text-[12.5px]">
        {msg}
      </div>
    );
  }

  const { directorBono, referidoBono } = calcExtras(agentAmount, state);
  const hasAny = state.hasDirector || state.isReferido;

  return (
    <div className="rounded-xl border border-[#E4E7EC] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-[#FAFBFC] sm:px-4"
      >
        <span className="text-[11.5px] font-bold text-[#1A1A2E] uppercase tracking-wide sm:text-[12.5px]">
          Director Comercial / Referido {hasAny ? "· activo" : ""}
        </span>
        <ChevronDown
          size={16}
          color="#5C6572"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .15s" }}
        />
      </button>

      {open && (
        <div className="p-3 space-y-3 border-t border-[#EEF0F3] sm:p-4">
          <ToggleRow
            icon={<Award size={14} />}
            label="¿Tiene Director Comercial?"
            active={state.hasDirector}
            onToggle={() => setState({ ...state, hasDirector: !state.hasDirector })}
            color={PURPLE}
          />
          {state.hasDirector && (
            <div>
              <input
                type="text"
                value={state.directorName}
                onChange={(e) => setState({ ...state, directorName: e.target.value })}
                placeholder="Nombre del Director Comercial"
                className="w-full text-[13px] rounded-lg border border-[#E2E5EA] px-3 py-2 sm:text-[14px] sm:px-4 sm:py-2.5"
              />
              <div className="flex items-center justify-between mt-1.5 px-0.5">
                <span className="text-[11px] text-[#5C6572] sm:text-[12px]">10% de lo que gana el agente</span>
                <span className="text-[12.5px] font-bold sm:text-[13px]" style={{ color: PURPLE }}>
                  {money(directorBono, currency)}
                </span>
              </div>
            </div>
          )}

          <ToggleRow
            icon={<UserCheck size={14} />}
            label="¿Es agente referido?"
            active={state.isReferido}
            onToggle={() => setState({ ...state, isReferido: !state.isReferido })}
            color={GREEN}
          />
          {state.isReferido && (
            <div>
              <input
                type="text"
                value={state.referidoName}
                onChange={(e) => setState({ ...state, referidoName: e.target.value })}
                placeholder="Nombre de quien lo refirió"
                className="w-full text-[13px] rounded-lg border border-[#E2E5EA] px-3 py-2 sm:text-[14px] sm:px-4 sm:py-2.5"
              />
              <div className="flex items-center justify-between mt-1.5 px-0.5">
                <span className="text-[11px] text-[#5C6572] sm:text-[12px]">5% de lo que gana el agente</span>
                <span className="text-[12.5px] font-bold sm:text-[13px]" style={{ color: GREEN }}>
                  {money(referidoBono, currency)}
                </span>
              </div>
            </div>
          )}

          {state.hasDirector && state.isReferido && state.directorName && state.directorName === state.referidoName && (
            <div className="text-[11px] rounded-lg px-3 py-2" style={{ backgroundColor: "#FFF4E5", color: "#8A5A00" }}>
              {state.directorName} es Director Comercial y también quien refirió al agente: gana ambos bonos (10% + 5% = 15%).
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Full card: this side belongs to our office, one agent, full breakdown
function OwnSideCard({
  title,
  icon,
  accent,
  sideTotal,
  currency,
  state,
  setState,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  sideTotal: number;
  currency: "USD" | "PEN";
  state: AgentState;
  setState: (x: AgentState) => void;
}) {
  const remaxPeru = sideTotal * REMAX_PERU_PCT;
  const net = sideTotal - remaxPeru;
  const result = calcAgent(net, state.level);
  const lv = LEVELS[state.level];
  const { directorBono, referidoBono } = calcExtras(result.agente, state);
  const oficinaNeta = result.oficina - directorBono - referidoBono;

  return (
    <div className="rounded-2xl bg-white border border-[#E4E7EC] shadow-sm overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2.5 sm:py-4 sm:px-6" style={{ backgroundColor: accent }}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 sm:w-10 sm:h-10">{icon}</div>
        <div>
          <div className="text-white font-bold text-sm leading-tight sm:text-base">{title}</div>
          <div className="text-white/80 text-[11px] leading-tight sm:text-[12px]">{money(sideTotal, currency)} de la comisión</div>
        </div>
      </div>

      <div className="p-4 space-y-4 sm:p-6 sm:space-y-5">
        <div className="flex items-center justify-between text-[12.5px] rounded-lg bg-[#F4F5F7] px-3 py-2 sm:text-[14px] sm:px-4 sm:py-2.5">
          <span className="text-[#5C6572]">RE/MAX Perú (10%)</span>
          <span className="font-semibold text-[#1A1A2E]">{money(remaxPeru, currency)}</span>
        </div>
        <div className="flex items-center justify-between text-[12.5px] px-3 -mt-2.5 sm:text-[14px] sm:px-4 sm:mt-0">
          <span className="text-[#5C6572]">Queda para repartir</span>
          <span className="font-semibold text-[#1A1A2E]">{money(net, currency)}</span>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide sm:text-[12px]">
            Nombre del agente (opcional)
          </label>
          <input
            type="text"
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            placeholder="Ej. Mauricio"
            className="w-full mt-1 text-[13px] rounded-lg border border-[#E2E5EA] px-3 py-2 sm:text-[14px] sm:px-4 sm:py-2.5"
          />
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide mb-1.5 sm:text-[12px]">Nivel del agente</div>
          <LevelPicker
            value={state.level}
            onChange={(level) => setState({ ...state, level, hasDirector: false, isReferido: false })}
          />
        </div>

        <BonosAccordion state={state} setState={setState} agentAmount={result.agente} currency={currency} />

        {/* Results */}
        <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: `${lv.color}14` }}>
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-bold sm:text-[14px]" style={{ color: lv.color === GOLD ? "#8A6D1E" : lv.color }}>
              {state.name ? `${state.name} · ${lv.short}` : lv.short}
            </span>
            <span className="text-[15px] font-extrabold text-[#1A1A2E] sm:text-[18px]">{money(result.agente, currency)}</span>
          </div>
          {state.level === "team_member" && (
            <div className="text-[11px] text-[#5C6572] mt-0.5 sm:text-[12px]">Team Leader: {money(result.teamLeader, currency)}</div>
          )}
        </div>

        {(state.hasDirector || state.isReferido) && (
          <div className="space-y-1.5">
            {state.hasDirector && (
              <div className="flex items-center justify-between text-[12px] px-3 py-2 rounded-lg sm:text-[13px] sm:px-4 sm:py-2.5" style={{ backgroundColor: `${PURPLE}14` }}>
                <span className="font-semibold" style={{ color: PURPLE }}>
                  {state.directorName || "Director Comercial"}
                </span>
                <span className="font-bold" style={{ color: PURPLE }}>{money(directorBono, currency)}</span>
              </div>
            )}
            {state.isReferido && (
              <div className="flex items-center justify-between text-[12px] px-3 py-2 rounded-lg sm:text-[13px] sm:px-4 sm:py-2.5" style={{ backgroundColor: `${GREEN}14` }}>
                <span className="font-semibold" style={{ color: GREEN }}>
                  {state.referidoName || "Referido"}
                </span>
                <span className="font-bold" style={{ color: GREEN }}>{money(referidoBono, currency)}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[12px] px-3 pt-1 border-t border-[#EEF0F3] sm:text-[13px] sm:px-4 sm:pt-2">
          <span className="text-[#5C6572]">Oficina (neta)</span>
          <span className="font-bold text-[#1A1A2E]">{money(oficinaNeta, currency)}</span>
        </div>
      </div>
    </div>
  );
}

// Simplified card: this side belongs to the OTHER office - just informational
function OtherOfficeSideCard({
  title,
  icon,
  sideTotal,
  currency,
  officeName,
}: {
  title: string;
  icon: React.ReactNode;
  sideTotal: number;
  currency: "USD" | "PEN";
  officeName: string;
}) {
  const remaxPeru = sideTotal * REMAX_PERU_PCT;
  const net = sideTotal - remaxPeru;
  return (
    <div className="rounded-2xl bg-white border border-[#E4E7EC] shadow-sm overflow-hidden opacity-90">
      <div className="px-4 py-3 flex items-center gap-2.5 sm:px-6 sm:py-4" style={{ backgroundColor: "#9AA5B1" }}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 sm:w-10 sm:h-10">{icon}</div>
        <div>
          <div className="text-white font-bold text-sm leading-tight sm:text-base">{title}</div>
          <div className="text-white/80 text-[11px] leading-tight sm:text-[12px]">{money(sideTotal, currency)} de la comisión</div>
        </div>
      </div>
      <div className="p-4 space-y-2 sm:p-6 sm:space-y-3">
        <div className="flex items-center justify-between text-[12.5px] rounded-lg bg-[#F4F5F7] px-3 py-2 sm:text-[14px] sm:px-4 sm:py-2.5">
          <span className="text-[#5C6572]">RE/MAX Perú (10%)</span>
          <span className="font-semibold text-[#1A1A2E]">{money(remaxPeru, currency)}</span>
        </div>
        <div className="rounded-lg px-3 py-2.5 border border-dashed border-[#D8DCE3] sm:px-4 sm:py-3">
          <div className="text-[12.5px] text-[#5C6572] sm:text-[13px]">
            El resto (<span className="font-semibold text-[#1A1A2E]">{money(net, currency)}</span>) se reparte del lado de{" "}
            <span className="font-semibold text-[#1A1A2E]">{officeName || "la otra oficina"}</span> — no se calcula aquí.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComisionesCalculator() {
  const [total, setTotal] = useState<number | "">(
    10000
  );
  const [currency, setCurrency] = useState<"USD" | "PEN">("USD");
  const splitOwner = 50; // fijo 50/50 entre puntas

  const [ourOfficeName, setOurOfficeName] = useState("RE/MAX Adelante");
  const [structure, setStructure] = useState<"same" | "shared">("same");
  const [ourSide, setOurSide] = useState<"ambas" | "propietario" | "comprador">("ambas"); // cuando compartida
  const [otherOfficeName, setOtherOfficeName] = useState("RE/MAX Select");

  const [ownerAgent, setOwnerAgent] = useState<AgentState>(defaultAgent("plata"));
  const [buyerAgent, setBuyerAgent] = useState<AgentState>(defaultAgent("diamante"));

  const parsedTotal = typeof total === "number" ? total : 0;
  const ownerTotal = parsedTotal * (splitOwner / 100);
  const buyerTotal = parsedTotal - ownerTotal;

  const ownerIsOurs = structure === "same" || ourSide === "propietario";
  const buyerIsOurs = structure === "same" || ourSide === "comprador";

  const grand = useMemo(() => {
    function sideCalc(
      sideTotal: number,
      agentState: AgentState,
      isOurs: boolean,
      sideLabel: string
    ) {
      if (!isOurs) return { remaxPeru: 0, oficina: 0, teamLeader: 0, agentes: 0, director: 0, referido: 0, breakdown: [] as any[] };
      const remaxPeru = sideTotal * REMAX_PERU_PCT;
      const net = sideTotal - remaxPeru;
      const r = calcAgent(net, agentState.level);
      const { directorBono, referidoBono } = calcExtras(r.agente, agentState);
      const lv = LEVELS[agentState.level];
      const who = agentState.name ? `${agentState.name} · ${lv.short}` : `${sideLabel} · ${lv.short}`;

      const breakdown = [{ label: who, amount: r.agente, color: lv.color }];
      if (agentState.level === "team_member" && r.teamLeader > 0) {
        breakdown.push({ label: `${sideLabel} · Team Leader`, amount: r.teamLeader, color: NAVY });
      }
      if (directorBono > 0) {
        breakdown.push({ label: `${agentState.directorName || "Director Comercial"} · Director`, amount: directorBono, color: PURPLE });
      }
      if (referidoBono > 0) {
        breakdown.push({ label: `${agentState.referidoName || "Referido"} · Referido`, amount: referidoBono, color: GREEN });
      }

      const oficinaNeta = r.oficina - directorBono - referidoBono;
      return {
        remaxPeru,
        oficina: oficinaNeta,
        teamLeader: r.teamLeader,
        agentes: r.agente,
        director: directorBono,
        referido: referidoBono,
        breakdown,
      };
    }
    const o = sideCalc(ownerTotal, ownerAgent, ownerIsOurs, "Propietario");
    const b = sideCalc(buyerTotal, buyerAgent, buyerIsOurs, "Comprador");
    return {
      remaxPeru: o.remaxPeru + b.remaxPeru,
      oficina: o.oficina + b.oficina,
      teamLeader: o.teamLeader + b.teamLeader,
      agentes: o.agentes + b.agentes,
      director: o.director + b.director,
      referido: o.referido + b.referido,
      breakdown: [...o.breakdown, ...b.breakdown],
    };
  }, [ownerTotal, buyerTotal, ownerAgent, buyerAgent, ownerIsOurs, buyerIsOurs]);

  const curr = currency === "USD" ? "USD" : "PEN";

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-8xl mx-auto px-2 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-10">
        {/* Header */}
        <div className="mb-5">
          <input
            type="text"
            value={ourOfficeName}
            onChange={(e) => setOurOfficeName(e.target.value)}
            placeholder="Nombre de tu oficina RE/MAX"
            className="text-[11px] font-bold tracking-widest uppercase bg-transparent border-b border-dashed border-[#E2A5AE] focus:outline-none focus:border-[#C8102E] px-0 py-0.5 w-full sm:text-[12px]"
            style={{ color: RED }}
          />
          <h1 className="text-[22px] font-extrabold leading-tight mt-1 sm:text-[26px]" style={{ color: NAVY, fontFamily: "Georgia, serif" }}>
            Calculadora de Comisiones
          </h1>
          <p className="text-[12.5px] text-[#5C6572] mt-0.5 sm:text-[13.5px]">
            Ingresa el monto total y calcula cuánto recibe cada participante.
          </p>
        </div>
        {/* Nueva disposición en columnas */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Columna izquierda: inputs principales */}
          <div className="flex-1 flex flex-col gap-4 lg:max-w-md">
            {/* Total input */}
            <div className="rounded-2xl bg-white border border-[#E4E7EC] shadow-sm p-4 sm:p-6">
              <label className="text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide sm:text-[12px]">
                Monto total de la comisión
              </label>
              <div className="flex flex-col gap-2 mt-1.5 sm:flex-row sm:items-center">
                <div className="flex rounded-lg overflow-hidden border border-[#E2E5EA] shrink-0">
                  {["USD", "PEN"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c as "USD" | "PEN")}
                      className="px-2.5 py-2 text-[12px] font-bold sm:text-[13px]"
                      style={{ backgroundColor: currency === c ? NAVY : "#FFFFFF", color: currency === c ? "#FFFFFF" : "#4A5568" }}
                      type="button"
                    >
                      {c === "USD" ? "$" : "S/"}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={total}
                  onChange={(e) =>
                    setTotal(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="flex-1 text-[20px] font-extrabold rounded-lg border border-[#E2E5EA] px-3 py-2 sm:text-[24px] sm:px-3 sm:py-2.5"
                  style={{ color: NAVY, minWidth: 0 }}
                  placeholder="0.00"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide flex items-center gap-1 sm:text-[12px]">
                    <Percent size={12} /> División entre puntas
                  </span>
                  <span className="text-[11px] font-semibold text-[#1A1A2E] sm:text-[12px]">50% / 50%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2E5EA] overflow-hidden flex">
                  <div className="h-full" style={{ width: "50%", backgroundColor: BLUE }} />
                  <div className="h-full" style={{ width: "50%", backgroundColor: RED }} />
                </div>
                <div className="flex justify-between text-[10.5px] text-[#8A93A3] mt-0.5 sm:text-[11.5px]">
                  <span>Propietario</span>
                  <span>Comprador</span>
                </div>
              </div>
            </div>

            {/* Structure of the sale */}
            <div className="rounded-2xl bg-white border border-[#E4E7EC] shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide sm:text-[12px]">
                <Users size={13} /> ¿De quién son las 2 operaciones?
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => setStructure("same")}
                  className="rounded-lg px-3 py-2 text-[12.5px] font-semibold border text-left sm:text-[13.5px] sm:px-4 sm:py-2.5"
                  style={{
                    borderColor: structure === "same" ? NAVY : "#E2E5EA",
                    backgroundColor: structure === "same" ? NAVY : "#FFFFFF",
                    color: structure === "same" ? "#FFFFFF" : "#4A5568",
                  }}
                >
                  Ambas puntas son de {ourOfficeName || "tu oficina"}
                  <div className="text-[11px] font-normal opacity-80 mt-0.5 sm:text-[12px]">
                    Un agente de la oficina lleva al propietario y otro (u el mismo) lleva al comprador.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setStructure("shared")}
                  className="rounded-lg px-3 py-2 text-[12.5px] font-semibold border text-left sm:text-[13.5px] sm:px-4 sm:py-2.5"
                  style={{
                    borderColor: structure === "shared" ? RED : "#E2E5EA",
                    backgroundColor: structure === "shared" ? RED : "#FFFFFF",
                    color: structure === "shared" ? "#FFFFFF" : "#4A5568",
                  }}
                >
                  Compartida con otra oficina RE/MAX
                  <div className="text-[11px] font-normal opacity-80 mt-0.5 sm:text-[12px]">
                    Una punta es de tu oficina y la otra es de otra oficina RE/MAX.
                  </div>
                </button>
              </div>

              {structure === "shared" && (
                <div className="mt-3 space-y-2.5 pt-3 border-t border-[#EEF0F3] sm:space-y-3 sm:pt-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide sm:text-[12px]">Nombre de la otra oficina</label>
                    <input
                      type="text"
                      value={otherOfficeName}
                      onChange={(e) => setOtherOfficeName(e.target.value)}
                      className="w-full mt-1 text-[13px] rounded-lg border border-[#E2E5EA] px-3 py-2 sm:text-[14px] sm:px-4 sm:py-2.5"
                      placeholder="Ej. RE/MAX Select"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide mb-1.5 sm:text-[12px]">
                      ¿Qué punta es de {ourOfficeName || "tu oficina"}?
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOurSide("propietario")}
                        className="rounded-lg px-2 py-1.5 text-[12px] font-semibold border sm:text-[13px] sm:px-3 sm:py-2"
                        style={{
                          borderColor: ourSide === "propietario" ? BLUE : "#E2E5EA",
                          backgroundColor: ourSide === "propietario" ? BLUE : "#FFFFFF",
                          color: ourSide === "propietario" ? "#FFFFFF" : "#4A5568",
                        }}
                      >
                        Propietario
                      </button>
                      <button
                        type="button"
                        onClick={() => setOurSide("comprador")}
                        className="rounded-lg px-2 py-1.5 text-[12px] font-semibold border sm:text-[13px] sm:px-3 sm:py-2"
                        style={{
                          borderColor: ourSide === "comprador" ? RED : "#E2E5EA",
                          backgroundColor: ourSide === "comprador" ? RED : "#FFFFFF",
                          color: ourSide === "comprador" ? "#FFFFFF" : "#4A5568",
                        }}
                      >
                        Comprador
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[10.5px] text-[#8A93A3] text-center mt-3 leading-relaxed sm:text-[11.5px] sm:mt-2">
              Cada punta paga 10% a RE/MAX Perú antes de repartir. Plata 50/50 · Oro 65/35 · Diamante 80/20 · Team Member 50 / 30 (leader) / 20. Director Comercial (10%) y Referido (5%) solo aplican a Agente Plata, sobre lo que gana el agente.
            </p>
          </div>
          {/* Columna derecha: tarjetas de puntas y resumen */}
          <div className="flex-[2] flex flex-col gap-6">
            {/* Sides */}
            <div className="flex flex-col lg:flex-row lg:gap-6 gap-4">
              <div className="flex-1 min-w-0">
                {ownerIsOurs ? (
                  <OwnSideCard
                    title="Punta Propietario"
                    icon={<Home size={16} color="#fff" />}
                    accent={BLUE}
                    sideTotal={ownerTotal}
                    currency={curr}
                    state={ownerAgent}
                    setState={setOwnerAgent}
                  />
                ) : (
                  <OtherOfficeSideCard
                    title="Punta Propietario"
                    icon={<Home size={16} color="#fff" />}
                    sideTotal={ownerTotal}
                    currency={curr}
                    officeName={otherOfficeName}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {buyerIsOurs ? (
                  <OwnSideCard
                    title="Punta Comprador"
                    icon={<Handshake size={16} color="#fff" />}
                    accent={RED}
                    sideTotal={buyerTotal}
                    currency={curr}
                    state={buyerAgent}
                    setState={setBuyerAgent}
                  />
                ) : (
                  <OtherOfficeSideCard
                    title="Punta Comprador"
                    icon={<Handshake size={16} color="#fff" />}
                    sideTotal={buyerTotal}
                    currency={curr}
                    officeName={otherOfficeName}
                  />
                )}
              </div>
            </div>
            {/* Grand summary */}
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 flex items-center gap-2 sm:px-6 sm:py-4" style={{ backgroundColor: NAVY }}>
                <Building2 size={16} color="#CADCFC" />
                <span className="text-white font-bold text-sm sm:text-base">Resumen para {ourOfficeName || "tu oficina"}</span>
              </div>
              <div className="bg-white divide-y divide-[#EEF0F3]">
                <Row label="RE/MAX Perú (de nuestras puntas)" value={money(grand.remaxPeru, curr)} />
                <Row label={`Oficina ${ourOfficeName || "tu oficina"} (neta)`} value={money(grand.oficina, curr)} />
                {grand.teamLeader > 0 && <Row label="Team Leader(s)" value={money(grand.teamLeader, curr)} />}
                {grand.director > 0 && <Row label="Director(es) Comercial(es)" value={money(grand.director, curr)} />}
                {grand.referido > 0 && <Row label="Referido(s)" value={money(grand.referido, curr)} />}

                <div className="px-4 py-2.5 sm:px-6 sm:py-3">
                  <div className="text-[11px] font-semibold text-[#5C6572] uppercase tracking-wide mb-1.5 sm:text-[12px]">
                    Desglose por participante
                  </div>
                  <div className="space-y-1.5">
                    {grand.breakdown.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 text-[12.5px] text-[#4A5568] sm:text-[14px]">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          {item.label}
                        </span>
                        <span className="text-[13px] font-bold shrink-0 sm:text-[14.5px]" style={{ color: NAVY }}>
                          {money(item.amount, curr)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Row label="Agente(s) — total" value={money(grand.agentes, curr)} bold />
                <Row
                  label="Total de nuestras puntas"
                  value={money(grand.remaxPeru + grand.oficina + grand.teamLeader + grand.director + grand.referido + grand.agentes, curr)}
                  faint
                />
              </div>
            </div>
            {structure === "shared" && (
              <p className="text-[10.5px] text-[#8A93A3] text-center mt-3 leading-relaxed sm:text-[11.5px] sm:mt-3">
                El resumen solo incluye la(s) punta(s) de {ourOfficeName || "tu oficina"}. La punta de {otherOfficeName || "la otra oficina"} se reparte por su cuenta.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  faint,
}: {
  label: string;
  value: string;
  bold?: boolean;
  faint?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 gap-3 sm:px-6 sm:py-3">
      <span className={`text-[12.5px] ${faint ? "text-[#8A93A3]" : "text-[#4A5568]"} sm:text-[14px]`}>{label}</span>
      <span className={`text-[13.5px] shrink-0 ${bold ? "font-extrabold" : "font-semibold"} sm:text-[15px]`} style={{ color: bold ? NAVY : "#1A1A2E" }}>
        {value}
      </span>
    </div>
  );
}