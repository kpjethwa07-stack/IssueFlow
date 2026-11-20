
import "./Brand.css";

export default function Brand({ className = "" }) {
  return (
    <a href="/" className={`brand ${className}`}>
      <svg
        className="brand-svg"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Logo background */}
        <rect
          width="48"
          height="48"
          rx="12"
          fill="#231736"
        />

        {/* Main ribbon */}
        <path
          d="M12 16.5C12 14.567 13.567 13 15.5 13H32.5C34.433 13 36 14.567 36 16.5C36 18.433 34.433 20 32.5 20H27.5V29.5C27.5 31.433 29.067 33 31 33H33.5C34.8807 33 36 34.1193 36 35.5C36 36.8807 34.8807 38 33.5 38H29.5C24.8056 38 21 34.1944 21 29.5V20H15.5C13.567 20 12 18.433 12 16.5Z"
          fill="#f45e5b"
        />

        {/* Secondary ribbon */}
        <path
          d="M14 25.5C14 23.8431 15.3431 22.5 17 22.5H18.5V34.5C18.5 36.1569 17.1569 37.5 15.5 37.5C13.8431 37.5 12.5 36.1569 12.5 34.5V27C12.5 26.1716 13.1716 25.5 14 25.5Z"
          fill="#ffb37b"
        />
      </svg>

      <span className="brand-name">
        Thread<span>Line</span>
      </span>
    </a>
  );
}
