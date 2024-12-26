import { ShieldCheckIcon, ClockIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";
import FeatureCard from "./FeatureCard";

const featuresData = [
  {
    Icon: ShieldCheckIcon,
    title: "Безопасность",
    description: "Передовые технологии защиты ваших персональных данных",
  },
  {
    Icon: ClockIcon,
    title: "Быстрота",
    description: "Моментальный доступ к файлам из любой точки мира",
  },
  {
    Icon: DevicePhoneMobileIcon,
    title: "Универсальность",
    description: "Работайте с файлами на любых устройствах",
  },
];

const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            Icon={feature.Icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
