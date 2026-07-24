import type { ReactNode } from "react";
import { Check, MapPin, Phone, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DadosContatoInfo } from "@/lib/mock-data/unidades";

export interface EntityHeroHeaderProps {
  /** Background image URL (e.g. city photo). */
  backgroundImage: string;
  /** Avatar image URL. Falls back to initials if not provided. */
  avatarUrl?: string;
  /** Content rendered inside the avatar when no image is available (initials text or an icon). */
  avatarFallback?: ReactNode;
  /** Whether to show a verified badge on the avatar. */
  verified?: boolean;
  /** Tag label displayed above the name (e.g. "Unidade Master"). */
  tag: string;
  /** Location text shown next to the tag. */
  location: string;
  /** Primary heading — entity name. */
  name: string;
  /** Subtitle line below the name (e.g. "Gestor Responsável: Fulano"). */
  subtitle?: string;
  /** Extra element rendered after subtitle (e.g. sócios button). */
  subtitleExtra?: React.ReactNode;
  /** Contact info displayed below the subtitle. */
  dadosContato?: DadosContatoInfo;
  /** Slot for a right-side indicator (e.g. RatingDonut). */
  indicator?: ReactNode;
  className?: string;
}

/**
 * Hero-style header for entity detail pages, matching the V1 exported design:
 * rounded card with background image, dark gradient overlay, large circular
 * avatar with optional verification badge, tag pill, name in white, and an
 * optional indicator (donut) on the right side.
 */
export function EntityHeroHeader({
  backgroundImage,
  avatarUrl,
  avatarFallback,
  verified = true,
  tag,
  location,
  name,
  subtitle,
  subtitleExtra,
  dadosContato,
  indicator,
  className,
}: EntityHeroHeaderProps) {
  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      {/* Background image + gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: avatar + info */}
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl md:h-24 md:w-24">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/60 text-2xl font-bold text-white">
                    {avatarFallback}
                  </div>
                )}
              </div>
              {verified && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-secondary">
                  <Check className="h-3 w-3 text-white" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Text info */}
            <div>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  {tag}
                </span>
                <span className="text-[13px] font-medium text-white/60">
                  {"\u2022"} {location}
                </span>
              </div>
              <h1 className="mb-1.5 text-xl font-bold leading-tight text-white md:text-2xl">
                {name}
              </h1>
              {subtitle && (
                <p className="text-[13px] text-white/60">
                  {subtitle}
                  {subtitleExtra && <span className="ml-3">{subtitleExtra}</span>}
                </p>
              )}
              {dadosContato && (
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5 text-[12px] text-white/50">
                    <MapPin className="h-3 w-3" />
                    {dadosContato.endereco}, {dadosContato.bairro}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-white/50">
                    <Phone className="h-3 w-3" />
                    {dadosContato.telefone}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-white/50">
                    <Mail className="h-3 w-3" />
                    {dadosContato.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: indicator (e.g. RatingDonut) */}
          {indicator && <div className="shrink-0">{indicator}</div>}
        </div>
      </div>
    </div>
  );
}
