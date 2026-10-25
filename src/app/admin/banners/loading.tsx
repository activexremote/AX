import { Esqueleto } from "@/components/carga/esqueleto";

// Las pestañas de banners se quedan; cambia sólo lo de dentro.
export default function Cargando() {
  return <Esqueleto variante="lista" />;
}
