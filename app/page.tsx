"use client";

import { useState } from "react";
import { Briefing, ContentLabResult } from "@/types/contentLab";

const initialBriefing: Briefing = {
  nicho: "",
  publicoAlvo: "",
  plataforma: "",
  objetivo: "",
  tomDeVoz: "",
  produtoServico: "",
  temaPrincipal: "",
  frequencia: "",
};

export default function Home() {
  const [briefing, setBriefing] = useState<Briefing>(initialBriefing);
  const [result, setResult] = useState<ContentLabResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function updateField(field: keyof Briefing, value: string) {
    setBriefing((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleGenerate() {
    setLoading(true);
    setErro("");
    setResult(null);

    try {
      const response = await fetch("/api/content-lab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(briefing),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.error || "Erro ao gerar conteúdo.");
        return;
      }

      setResult(data.result);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function preencherExemplo() {
    setBriefing({
      nicho: "Estudos com IA",
      publicoAlvo: "Estudantes universitários",
      plataforma: "TikTok",
      objetivo: "Vender um mini e-book",
      tomDeVoz: "Simples, educativo e direto",
      produtoServico: "Mini e-book sobre como estudar melhor com IA",
      temaPrincipal: "Como usar IA sem virar dependente",
      frequencia: "5 posts por semana",
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
            Agente IA Básico
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Content Lab IA
          </h1>

          <p className="max-w-3xl text-lg text-zinc-300">
            Transforme um briefing simples em ideias de conteúdo, ganchos,
            roteiros, legendas, CTAs e checklist de revisão.
          </p>
        </header>

        <section className="grid gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl md:grid-cols-2">
          <InputField
            label="Nicho"
            placeholder="Ex: estudos com IA"
            value={briefing.nicho}
            onChange={(value) => updateField("nicho", value)}
          />

          <InputField
            label="Público-alvo"
            placeholder="Ex: estudantes universitários"
            value={briefing.publicoAlvo}
            onChange={(value) => updateField("publicoAlvo", value)}
          />

          <InputField
            label="Plataforma"
            placeholder="Ex: TikTok, Instagram, LinkedIn"
            value={briefing.plataforma}
            onChange={(value) => updateField("plataforma", value)}
          />

          <InputField
            label="Objetivo do conteúdo"
            placeholder="Ex: vender mini e-book"
            value={briefing.objetivo}
            onChange={(value) => updateField("objetivo", value)}
          />

          <InputField
            label="Tom de voz"
            placeholder="Ex: simples, educativo e direto"
            value={briefing.tomDeVoz}
            onChange={(value) => updateField("tomDeVoz", value)}
          />

          <InputField
            label="Produto ou serviço divulgado"
            placeholder="Ex: pack de prompts"
            value={briefing.produtoServico}
            onChange={(value) => updateField("produtoServico", value)}
          />

          <div className="md:col-span-2">
            <InputField
              label="Tema principal"
              placeholder="Ex: como usar IA sem virar dependente"
              value={briefing.temaPrincipal}
              onChange={(value) => updateField("temaPrincipal", value)}
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              label="Frequência desejada"
              placeholder="Ex: 5 posts por semana"
              value={briefing.frequencia}
              onChange={(value) => updateField("frequencia", value)}
            />
          </div>

          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-2xl bg-cyan-400 px-6 py-3 font-bold text-zinc-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Gerando conteúdo..." : "Gerar conteúdo"}
            </button>

            <button
              onClick={preencherExemplo}
              className="rounded-2xl border border-zinc-700 px-6 py-3 font-bold text-zinc-100 transition hover:bg-zinc-800"
            >
              Preencher exemplo
            </button>
          </div>

          {erro && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200 md:col-span-2">
              {erro}
            </div>
          )}
        </section>

        {result && <ResultView result={result} />}
      </section>
    </main>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: Readonly<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-zinc-200">{label}</span>
      <input
        className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ResultView({ result }: Readonly<{ result: ContentLabResult }>) {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6">
        <h2 className="text-2xl font-bold text-cyan-200">Resumo do briefing</h2>
        <p className="mt-2 text-zinc-200">{result.resumoBriefing}</p>
      </div>

      <TableCard title="Ideias de conteúdo">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-300">
              <th className="p-3">#</th>
              <th className="p-3">Ideia</th>
              <th className="p-3">Formato</th>
              <th className="p-3">Objetivo</th>
              <th className="p-3">Observação</th>
            </tr>
          </thead>
          <tbody>
            {result.ideias.map((item) => (
              <tr key={item.numero} className="border-b border-zinc-800">
                <td className="p-3">{item.numero}</td>
                <td className="p-3">{item.ideia}</td>
                <td className="p-3">{item.formato}</td>
                <td className="p-3">{item.objetivo}</td>
                <td className="p-3">{item.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <TableCard title="Ganchos">
        <ul className="space-y-3">
          {result.ganchos.map((gancho) => (
            <li key={gancho} className="rounded-2xl bg-zinc-950 p-4">
              {gancho}
            </li>
          ))}
        </ul>
      </TableCard>

      <TableCard title="Roteiros curtos">
        <div className="space-y-4">
          {result.roteiros.map((roteiro) => (
            <article key={roteiro.titulo} className="rounded-2xl bg-zinc-950 p-5">
              <h3 className="text-xl font-bold text-cyan-300">
                {roteiro.titulo}
              </h3>
              <p className="mt-3">
                <strong>Gancho:</strong> {roteiro.gancho}
              </p>
              <p className="mt-3 whitespace-pre-line">
                <strong>Roteiro:</strong> {roteiro.roteiro}
              </p>
              <p className="mt-3">
                <strong>CTA:</strong> {roteiro.ctaSugerido}
              </p>
            </article>
          ))}
        </div>
      </TableCard>

      <TableCard title="Legendas">
        <div className="space-y-4">
          {result.legendas.map((legenda) => (
            <article key={legenda.titulo} className="rounded-2xl bg-zinc-950 p-5">
              <h3 className="text-xl font-bold text-cyan-300">
                {legenda.titulo}
              </h3>
              <p className="mt-3 whitespace-pre-line">{legenda.legenda}</p>
              <p className="mt-3 text-sm text-zinc-400">
                Tom: {legenda.tom}
              </p>
            </article>
          ))}
        </div>
      </TableCard>

      <TableCard title="CTAs">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-300">
              <th className="p-3">Tipo</th>
              <th className="p-3">Texto</th>
              <th className="p-3">Quando usar</th>
            </tr>
          </thead>
          <tbody>
            {result.ctas.map((cta) => (
              <tr key={cta.tipo || cta.texto} className="border-b border-zinc-800">
                <td className="p-3">{cta.tipo}</td>
                <td className="p-3">{cta.texto}</td>
                <td className="p-3">{cta.quandoUsar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      <TableCard title="Checklist final">
        <ul className="space-y-3">
          {result.checklist.map((item) => (
            <li key={item} className="rounded-2xl bg-zinc-950 p-4">
              ✅ {item}
            </li>
          ))}
        </ul>
      </TableCard>
    </section>
  );
}

function TableCard({
  title,
  children,
}: {
  readonly title: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}