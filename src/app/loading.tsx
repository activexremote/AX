import { Esqueleto } from "@/components/carga/esqueleto";

// El resto de la web (landing, blog, cursos, glosario, legal, login,
// matrícula, Lens…): algo a la vista en cuanto se hace clic. El panel y el
// campus tienen el suyo, más parecido a lo que va a llegar.
export default function Cargando() {
  return <Esqueleto variante="campus" />;
}
