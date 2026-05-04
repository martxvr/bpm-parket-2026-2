import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm text-black/50">404</p>
      <h1 className="heading-display text-3xl md:text-4xl mt-2">
        Pagina niet gevonden
      </h1>
      <p className="mt-3 text-black/70">
        We konden deze pagina niet vinden. Misschien werkt deze nog wel:
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/">Naar home</Button>
        <Button href="/contact" variant="outline">Contact opnemen</Button>
      </div>
    </Container>
  );
}
