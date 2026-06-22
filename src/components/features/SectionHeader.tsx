export default function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between border-b-2 border-gold pb-1.5 mb-4">
      <h2 className="text-base font-black text-navy leading-none">{title}</h2>
      {href && (
        <a href={href} className="text-[11px] text-gold hover:text-navy font-semibold transition-colors leading-none">
          المزيد ←
        </a>
      )}
    </div>
  );
}
