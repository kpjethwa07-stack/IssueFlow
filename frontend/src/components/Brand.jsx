
import { Link } from "react-router-dom";
import { Layers3 } from "lucide-react";

export default function Brand({ to = "/", light = false }) {
  return (
    <Link
      to={to}
      className={`brand ${light ? "brand-light" : ""}`}
    >
      <span className="brand-mark">
        <Layers3 size={23} strokeWidth={2.4} />
      </span>

      <span className="brand-name">
        Issue<span>Flow</span>
      </span>
    </Link>
  );
}
