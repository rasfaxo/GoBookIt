const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-blue-100 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex flex-col items-center gap-2 px-4 py-8 text-center text-[12px] font-medium text-blue-600 sm:px-6 lg:px-8">
        <p className="tracking-tight">
          <span className="font-semibold text-blue-700">GoBookIt</span> &middot; Seamless meeting room booking platform
        </p>
        <p className="text-blue-500">&copy; {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
