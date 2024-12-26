/* eslint-disable react/prop-types */
const FeatureCard = ({ Icon, title, description }) => {
  return (
    <div className="bg-white border border-blue-100 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <Icon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
      <h3 className="text-2xl font-semibold text-blue-600 mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
