import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">Bienvenido a GrowthTrack</h1>
        <p className="text-neutral-500 mt-2">Visita la ruta <b>/mi-proyecto</b> para ver el dashboard.</p>
        <Button>Inicia sesión con Google</Button>
      </div>
    </main>
  );
}
