import { useTranslations } from "next-intl";

export default function LandingHowItWorks() {
  const t = useTranslations("landing.how");

  return (
    <section className="bg-white py-20 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">{t("title")}</h2>
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {["step1", "step2", "step3"].map((step, index) => (
            <div key={step} className="text-center">
              <div className="mb-6">
                <span className="text-xl font-medium uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  {t("step")} {index + 1}
                </span>
                <div className="mx-auto mt-2 h-0.5 w-12 bg-indigo-200 dark:bg-indigo-800" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-text-primary">{t(`${step}.title`)}</h3>
              <p className="text-text-secondary">{t(`${step}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
