export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center items-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} OkayNotice.
        </p>
      </div>
    </footer>
  );
}