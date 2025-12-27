type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
  iconBg,
  iconColor,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 flex gap-4">
      {/* Icon */}
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full shrink-0"
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
