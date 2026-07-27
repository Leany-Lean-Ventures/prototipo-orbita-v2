import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { BRAZIL_PATHS, BRAZIL_VIEWBOX } from "@/lib/geo/brazil-map-paths";
import {
  ESTADOS, UFS, REGIOES, UFS_POR_REGIAO, ehUF,
  type UF, type Regiao,
} from "@/lib/geo/estados";
import { posicaoBolha, raioBolha, centroideRegiao } from "@/lib/geo/bubble-layout";
import {
  SELECAO_GLOBAL,
  type MapSelection,
} from "@/lib/geo/selection";
import { REDE_POR_UF } from "@/lib/mock-data/rede-por-uf";
import { prefersReducedMotion } from "@/lib/motion";
import { MapTooltip, type TooltipData } from "./MapTooltip";

// ─── Constantes de cor (via CSS vars — respeitam dark mode) ─────────────────

function fillDaUF(
  uf: UF,
  nivel: MapSelection["nivel"],
): string {
  const temCobertura = REDE_POR_UF[uf].lojas > 0;

  if (!temCobertura) return "hsl(var(--map-empty))";

  if (nivel === "global") return "hsl(var(--map-fill))";

  if (nivel === "regioes") {
    const regiao = ESTADOS[uf].regiao;
    const varName = `--map-regiao-${regiao.toLowerCase().replace("-", "-").replace(" ", "-")}` as string;
    // Mapear regiões para suas variáveis CSS
    const regiaoVars: Record<Regiao, string> = {
      "Norte": "hsl(var(--map-regiao-norte))",
      "Nordeste": "hsl(var(--map-regiao-nordeste))",
      "Centro-Oeste": "hsl(var(--map-regiao-centro-oeste))",
      "Sudeste": "hsl(var(--map-regiao-sudeste))",
      "Sul": "hsl(var(--map-regiao-sul))",
    };
    void varName;
    return regiaoVars[regiao];
  }

  // nivel === "estados"
  return "hsl(var(--map-fill))";
}

function isSelected(uf: UF, sel: MapSelection): boolean {
  if (sel.nivel === "estados") return sel.uf === uf;
  if (sel.nivel === "regioes") return sel.regiao === ESTADOS[uf].regiao;
  return false;
}

function isClickable(uf: UF, nivel: MapSelection["nivel"]): boolean {
  if (nivel === "global") return false;
  return REDE_POR_UF[uf].lojas > 0;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface BrazilMapSvgProps {
  sel: MapSelection;
  nivel: MapSelection["nivel"];
  onSelect: (sel: MapSelection) => void;
  className?: string;
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function BrazilMapSvg({ sel, nivel, onSelect, className }: BrazilMapSvgProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const bubblesGroupRef = useRef<SVGGElement>(null);

  /** UF ou Região com foco atual — para roving tabindex. */
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  /** Tooltip */
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Ordem de navegação por teclado: UFs em leitura geográfica N→S, O→L
  const tabOrder = nivel === "regioes" ? (REGIOES as readonly string[]) : (UFS as readonly string[]);

  // ─── Seleção ────────────────────────────────────────────────────────────────

  const handleUFClick = useCallback(
    (uf: UF) => {
      if (!isClickable(uf, nivel)) return;
      if (nivel === "estados") {
        const novaUF = sel.nivel === "estados" && sel.uf === uf ? null : uf;
        onSelect({ nivel: "estados", uf: novaUF });
      } else if (nivel === "regioes") {
        const regiao = ESTADOS[uf].regiao;
        const novaRegiao = sel.nivel === "regioes" && sel.regiao === regiao ? null : regiao;
        onSelect({ nivel: "regioes", regiao: novaRegiao });
      }
    },
    [sel, nivel, onSelect],
  );

  const handleRegiaoClick = useCallback(
    (regiao: Regiao) => {
      const novaRegiao = sel.nivel === "regioes" && sel.regiao === regiao ? null : regiao;
      onSelect({ nivel: "regioes", regiao: novaRegiao });
    },
    [sel, onSelect],
  );

  // ─── Teclado (roving tabindex) ───────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGElement>, key: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (nivel === "estados") handleUFClick(key as UF);
        else if (nivel === "regioes") handleRegiaoClick(key as Regiao);
      }
      if (e.key === "Escape") {
        onSelect(SELECAO_GLOBAL);
      }
      const idx = tabOrder.indexOf(key);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = tabOrder[Math.min(idx + 1, tabOrder.length - 1)];
        setFocusedKey(next);
        svgRef.current?.querySelector<SVGElement>(`[data-key="${next}"]`)?.focus();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = tabOrder[Math.max(idx - 1, 0)];
        setFocusedKey(prev);
        svgRef.current?.querySelector<SVGElement>(`[data-key="${prev}"]`)?.focus();
      }
    },
    [nivel, tabOrder, handleUFClick, handleRegiaoClick, onSelect],
  );

  // ─── Tooltip ────────────────────────────────────────────────────────────────

  function buildTooltipUF(uf: UF, svgEl: SVGSVGElement, e: React.MouseEvent): TooltipData {
    const rect = svgEl.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const d = REDE_POR_UF[uf];
    const temCobertura = d.lojas > 0;
    return {
      titulo: ESTADOS[uf].nome,
      subtitulo: `${ESTADOS[uf].regiao}`,
      linhas: temCobertura
        ? [
            { label: "Lojas", valor: String(d.lojas) },
            { label: "PVs", valor: String(d.pvs) },
            { label: "Consultores", valor: String(d.consultores) },
          ]
        : [],
      semCobertura: !temCobertura,
    };
  }

  function buildTooltipRegiao(regiao: Regiao, svgEl: SVGSVGElement, e: React.MouseEvent): TooltipData {
    const rect = svgEl.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const ufsRegiao = UFS_POR_REGIAO[regiao];
    const lojas = ufsRegiao.reduce((s, uf) => s + REDE_POR_UF[uf].lojas, 0);
    const pvs = ufsRegiao.reduce((s, uf) => s + REDE_POR_UF[uf].pvs, 0);
    return {
      titulo: regiao,
      subtitulo: `${ufsRegiao.length} estados`,
      linhas: [
        { label: "Lojas", valor: String(lojas) },
        { label: "PVs", valor: String(pvs) },
      ],
      semCobertura: lojas === 0,
    };
  }

  // ─── Animação de entrada das bolhas (GSAP, não entra na timeline do Dashboard) ──

  useGSAP(
    () => {
      if (!bubblesGroupRef.current) return;
      const circles = bubblesGroupRef.current.querySelectorAll<SVGGElement>(".map-bubble-group");
      if (prefersReducedMotion() || circles.length === 0) return;

      gsap.fromTo(
        circles,
        { scale: 0, transformOrigin: "center center" },
        {
          scale: 1,
          duration: 0.45,
          ease: "back.out(1.4)",
          stagger: { each: 0.03, from: "center" },
          delay: 0.2,
        },
      );
    },
    { dependencies: [nivel], scope: bubblesGroupRef },
  );

  // ─── Dados de bolhas ─────────────────────────────────────────────────────────

  const maxLojas = Math.max(...UFS.map((uf) => REDE_POR_UF[uf].lojas));
  const pesos = Object.fromEntries(UFS.map((uf) => [uf, REDE_POR_UF[uf].lojas])) as Record<UF, number>;

  const bolhasUF = UFS.filter((uf) => REDE_POR_UF[uf].lojas > 0).map((uf) => ({
    uf,
    pos: posicaoBolha(uf),
    raio: raioBolha(REDE_POR_UF[uf].lojas, maxLojas),
    lojas: REDE_POR_UF[uf].lojas,
  }));

  const maxLojasRegiao = Math.max(...REGIOES.map((r) => UFS_POR_REGIAO[r].reduce((s, uf) => s + REDE_POR_UF[uf].lojas, 0)));
  const bolhasRegiao = REGIOES.map((regiao) => {
    const lojas = UFS_POR_REGIAO[regiao].reduce((s, uf) => s + REDE_POR_UF[uf].lojas, 0);
    return {
      regiao,
      pos: centroideRegiao(regiao, pesos),
      raio: raioBolha(lojas, maxLojasRegiao),
      lojas,
    };
  }).filter((b) => b.lojas > 0);

  // ─── Render ──────────────────────────────────────────────────────────────────

  // UF inicial de foco quando muda o nível (para roving tabindex)
  useEffect(() => {
    setFocusedKey(nivel === "regioes" ? "Sudeste" : "SP");
  }, [nivel]);

  return (

    <div className={`relative select-none ${className ?? ""}`}>
      {tooltip && (
        <MapTooltip data={tooltip} x={tooltipPos.x} y={tooltipPos.y} />
      )}

      {/* Descrição sr-only para acessibilidade */}
      <p className="sr-only">
        Mapa do Brasil. Cobertura ativa em{" "}
        {bolhasUF.map((b) => `${ESTADOS[b.uf].nome} (${b.lojas} lojas)`).join(", ")}.
        Use as setas do teclado para navegar entre estados. Enter para selecionar.
      </p>

      <svg
        ref={svgRef}
        viewBox={BRAZIL_VIEWBOX}
        preserveAspectRatio="xMidYMin meet"
        className="h-full w-full"
        aria-label="Mapa de cobertura da rede Ademicon por estado"
        role="img"
      >
        {/* ── Paths dos estados ──────────────────────────────────────────── */}
        <g>
          {UFS.map((uf) => {
            const temCobertura = REDE_POR_UF[uf].lojas > 0;
            const clickable = isClickable(uf, nivel);
            const selected = isSelected(uf, sel);
            const key = nivel === "regioes" ? ESTADOS[uf].regiao : uf;
            const isFocused = focusedKey === key;
            const fill = selected
              ? "hsl(var(--map-fill-selected))"
              : fillDaUF(uf, nivel);

            return (
              <path
                key={uf}
                data-key={key}
                d={BRAZIL_PATHS[uf]}
                style={{ fill, stroke: "hsl(var(--map-stroke))", strokeWidth: 1, outline: "none" }}
                className={[
                  "transition-[fill,opacity] duration-200 focus:outline-none outline-none",
                  clickable ? "cursor-pointer map-path-clickable" : "cursor-default",
                  selected ? "map-path-selected" : "",
                  !temCobertura ? "opacity-60" : "",
                ].join(" ")}
                aria-label={`${ESTADOS[uf].nome}${!temCobertura ? " — sem cobertura" : ""}`}
                aria-pressed={selected ? "true" : undefined}
                aria-disabled={!temCobertura ? "true" : undefined}
                tabIndex={isFocused ? 0 : -1}
                onFocus={() => setFocusedKey(key)}
                onClick={() => handleUFClick(uf)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                onMouseMove={(e) => {
                  if (!svgRef.current) return;
                  const tip = nivel === "regioes"
                    ? buildTooltipRegiao(ESTADOS[uf].regiao, svgRef.current, e)
                    : buildTooltipUF(uf, svgRef.current, e);
                  setTooltip(tip);
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </g>

        {/* ── Linha-guia do DF (bolha deslocada do centroide real) ───────── */}
        {nivel !== "global" && REDE_POR_UF["DF"].lojas > 0 && (() => {
          const centroid = ESTADOS["DF"].centroide;
          const bubble = posicaoBolha("DF");
          return (
            <line
              x1={centroid.x} y1={centroid.y}
              x2={bubble.x} y2={bubble.y}
              stroke="hsl(var(--map-fill-selected))"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.6"
              pointerEvents="none"
            />
          );
        })()}

        {/* ── Bolhas ────────────────────────────────────────────────────── */}
        <g ref={bubblesGroupRef}>
          {nivel === "estados" && bolhasUF.map(({ uf, pos, raio, lojas }) => {
            const selected = sel.nivel === "estados" && sel.uf === uf;
            return (
              <g
                key={uf}
                className="map-bubble-group"
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={raio}
                  fill="hsl(var(--map-bubble-fill))"
                  fillOpacity={selected ? 0.95 : 0.75}
                  stroke="hsl(var(--map-bubble-stroke))"
                  strokeWidth={selected ? 2 : 1}
                  className="pointer-events-none transition-[fill-opacity,stroke-width] duration-200"
                />
                {raio >= 14 && (
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.max(7, Math.min(11, raio * 0.38))}
                    fill="white"
                    fontWeight="700"
                    className="pointer-events-none"
                    aria-hidden="true"
                  >
                    {lojas}
                  </text>
                )}
              </g>
            );
          })}

          {nivel === "regioes" && bolhasRegiao.map(({ regiao, pos, raio, lojas }) => {
            const selected = sel.nivel === "regioes" && sel.regiao === regiao;
            return (
              <g
                key={regiao}
                className="map-bubble-group"
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={raio}
                  fill="hsl(var(--map-bubble-fill))"
                  fillOpacity={selected ? 0.95 : 0.75}
                  stroke="hsl(var(--map-bubble-stroke))"
                  strokeWidth={selected ? 2 : 1}
                  className="pointer-events-none transition-[fill-opacity,stroke-width] duration-200"
                />
                {raio >= 16 && (
                  <text
                    x={pos.x}
                    y={pos.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.max(8, Math.min(13, raio * 0.36))}
                    fill="white"
                    fontWeight="700"
                    className="pointer-events-none"
                    aria-hidden="true"
                  >
                    {lojas}
                  </text>
                )}
              </g>
            );
          })}

          {nivel === "global" && bolhasUF.map(({ uf, pos, raio }) => (
            <g
              key={uf}
              className="map-bubble-group"
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={raio * 0.7}
                fill="hsl(var(--map-bubble-fill))"
                fillOpacity={0.4}
                stroke="hsl(var(--map-bubble-stroke))"
                strokeWidth={0.8}
                className="pointer-events-none"
              />
            </g>
          ))}
        </g>

        {/* ── Anel de foco SVG (substitui o outline CSS que é inconsistente em SVG) */}
        {focusedKey && (() => {
          if (nivel === "estados" && ehUF(focusedKey)) {
            const uf = focusedKey as UF;
            const pos = posicaoBolha(uf);
            const raio = raioBolha(REDE_POR_UF[uf].lojas, maxLojas);
            if (!REDE_POR_UF[uf].lojas) return null;
            return (
              <circle
                cx={pos.x} cy={pos.y}
                r={raio + 4}
                fill="none"
                stroke="hsl(var(--map-focus-ring))"
                strokeWidth="2"
                strokeDasharray="4 2"
                pointerEvents="none"
                className="animate-pulse"
              />
            );
          }
          return null;
        })()}
      </svg>

      {/* Legenda sr-only para estados sem cobertura */}
      <p className="sr-only">
        Estados sem cobertura (não clicáveis):{" "}
        {UFS.filter((uf) => REDE_POR_UF[uf].lojas === 0)
          .map((uf) => ESTADOS[uf].nome)
          .join(", ")}
        .
      </p>
    </div>
  );
}
