export default function AskungenMark({ compact=false }: { compact?: boolean }) {
  return <span className={`askungen-mark${compact?" compact":""}`} role="img" aria-label="ASKungen, ASK:s gula anka"><i className="duck-head"><i className="duck-eye left"/><i className="duck-eye right"/><i className="duck-beak"/></i><i className="duck-body"/><i className="duck-ribbon left"/><i className="duck-ribbon right"/><i className="duck-medal">A</i></span>;
}
