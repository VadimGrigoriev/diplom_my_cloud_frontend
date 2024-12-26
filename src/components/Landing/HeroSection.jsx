/* eslint-disable react/prop-types */
import { CloudIcon } from "@heroicons/react/24/solid";

const HeroSection = ({ onStart }) => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Левая часть с заголовком */}
        <div className="text-center md:text-left">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Ваши файлы <span className="text-blue-600">всегда с вами</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Безопасное и удобное облачное хранилище для ваших данных.
          </p>
          <button
            onClick={onStart}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Начать сейчас
          </button>
        </div>

        {/* Правая часть с иконкой */}
        <div className="flex justify-center">
          <div className="bg-blue-50 p-12 rounded-2xl">
            <CloudIcon className="w-48 h-48 text-blue-600 animate-bounce-slow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
