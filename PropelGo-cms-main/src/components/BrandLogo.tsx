import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  width?: number;
  className?: string;
};

export default function BrandLogo({
  href = "/admin/dashboard",
  width = 190,
  className = "",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      aria-label="PropelGo dashboard"
      className={`inline-flex w-fit shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4 ${className}`}
    >
      <Image
  src="/propelgo-logo.png"
  alt="PropelGo"
  width={width}
  height={52}
  priority
  sizes={`${width}px`}
  className="block max-h-[48px] max-w-full object-contain"
  style={{
    width: `${width}px`,
    height: "auto",
    maxWidth: "100%",
  }}
/>
    </Link>
  );
}