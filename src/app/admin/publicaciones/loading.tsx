import { Esqueleto } from "@/components/carga/esqueleto";

// Las pestañas de publicaciones se quedan; cambia sólo lo de dentro.
export default function Cargando() {
  return <Esqueleto variante="lista" />;
}
