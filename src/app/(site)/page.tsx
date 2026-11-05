import { getHome } from "@/lib/content";

export default function HomePage() {
  const { placeholder } = getHome();
  return (
    <main id="main" className="grid min-h-dvh place-items-center p-8">
      <h1 className="text-4xl">{placeholder}</h1>
    </main>
  );
}
