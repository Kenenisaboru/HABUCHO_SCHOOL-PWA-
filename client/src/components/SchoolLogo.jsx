const SchoolLogo = ({ className = "h-10 w-10" }) => (
  <img
    src="/school-logo.webp"
    alt=""
    aria-hidden="true"
    className={`shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-amber-400/50 ${className}`}
    decoding="async"
  />
);

export default SchoolLogo;
