export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-3">Istwa Nou</h1>
        <p className="text-gray-600">
          Tipa Store te kòmanse ak yon objektif senp: fè teknoloji ak pwodwi kalite disponib fasil pou tout
          Ayisyen, kèlkeswa kote yo ye nan peyi a. Depi lansman nou, nou kontinye grandi ak yon katalòg ki
          elaji ak yon rezo livrezon ki kouvri tout depatman yo.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-3">Misyon Nou</h2>
        <p className="text-gray-600">
          Ofri yon eksperyans acha anliy senp, rapid e san danje, ak pri ki abòdab ak sèvis kliyan ki toujou
          disponib.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-3">Vizyon Nou</h2>
        <p className="text-gray-600">
          Vin platfòm e-commerce referans an Ayiti, ki fè konfyans kliyan grasa transparans, kalite, ak
          inovasyon kontinyèl.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-3">Valè Nou</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {['Konfyans & Transparans', 'Kalite Pwodwi', 'Sèvis Kliyan Premye', 'Inovasyon Kontinyèl'].map((v) => (
            <div key={v} className="card p-4 font-medium">{v}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
