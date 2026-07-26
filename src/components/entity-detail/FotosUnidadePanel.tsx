import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Images, Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface FotosUnidadePanelProps {
  /** Fotos iniciais da unidade (paths em public/ ou URLs). */
  fotos: string[];
}

/**
 * Galeria de fotos da unidade — thumbnails em grid, clique abre um overlay
 * em carrossel (Dialog fullscreen). Adicionar/remover é só de sessão (não
 * persiste após recarregar), mesma convenção de mock do resto do projeto.
 */
export function FotosUnidadePanel({ fotos: fotosIniciais }: FotosUnidadePanelProps) {
  const [fotos, setFotos] = useState<string[]>(fotosIniciais);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const abrirLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const removerFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const adicionarFotos = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const novas = Array.from(files).map((file) => URL.createObjectURL(file));
    setFotos((prev) => [...prev, ...novas]);
  };

  return (
    <Card className="p-6">
      <SectionHeader
        icon={Images}
        title="Fotos da Unidade"
        subtitle="Fachada e ambientes internos — clique numa foto para ampliar"
      />

      {fotos.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-sm font-medium text-foreground">Nenhuma foto cadastrada</p>
          <p className="text-xs text-muted-foreground">Adicione fotos da fachada e dos ambientes da unidade.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {fotos.map((foto, index) => (
            <div key={foto + index} className="group relative aspect-square overflow-hidden rounded-xl">
              <button
                type="button"
                className="absolute inset-0 h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => abrirLightbox(index)}
                aria-label={`Ampliar foto ${index + 1} da unidade`}
              >
                <img
                  src={foto}
                  alt={`Foto ${index + 1} da unidade`}
                  className="h-full w-full object-cover transition-transform duration-base ease-micro group-hover:scale-105"
                  loading="lazy"
                />
              </button>
              <button
                type="button"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity duration-micro ease-micro hover:bg-black/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                onClick={() => removerFoto(index)}
                aria-label={`Remover foto ${index + 1} da unidade`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground transition-colors duration-micro ease-micro hover:bg-muted/50">
            <Plus className="h-5 w-5" />
            <span className="text-[11px] font-medium">Adicionar foto</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => { adicionarFotos(e.target.files); e.target.value = ""; }}
            />
          </label>
        </div>
      )}

      {/* Overlay em carrossel */}
      <DialogPrimitive.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-modal bg-black/95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-modal flex flex-col items-center justify-center gap-4 p-4 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogPrimitive.Title className="sr-only">Fotos da unidade</DialogPrimitive.Title>
            <DialogPrimitive.Close
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>

            {fotos.length > 0 && (
              <>
                <Carousel opts={{ startIndex: activeIndex, loop: true }} className="w-full max-w-4xl">
                  <CarouselContent>
                    {fotos.map((foto, index) => (
                      <CarouselItem key={foto + index} className="flex items-center justify-center">
                        <img
                          src={foto}
                          alt={`Foto ${index + 1} da unidade`}
                          className="max-h-[75vh] w-auto rounded-lg object-contain"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className={cn("border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white")} />
                  <CarouselNext className={cn("border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white")} />
                </Carousel>
                <p className="text-sm text-white/70">{fotos.length} foto{fotos.length !== 1 ? "s" : ""}</p>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </Card>
  );
}
