export default function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-text-secondary">
          © {new Date().getFullYear()} MindJournal. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
