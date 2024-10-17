import { useState, useRef, useEffect } from "react";

// Define types for the list menu items
type MenuItem = {
  page: string;
  path: string;
};

const listmenu: MenuItem[] = [
  {
    page: "Home",
    path: "/",
  },
  {
    page: "Paket",
    path: "/paket",
  },
  {
    page: "About",
    path: "/about",
  },
  {
    page: "FAQ",
    path: "/faq",
  },
];

const Navbar = ({
  needBg,
  paddingTop,
}: {
  needBg: string;
  paddingTop: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const offcanvasRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen); // Toggle menu open/close
  };

  // change navbar color when scrolling
  const [scrollPosition, setScrollPosition] = useState(false);
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position > 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClickItem = (itemPath: string) => {
    window.location.href = itemPath;
  };

  const padTop = scrollPosition ? "" : paddingTop;
  const bgScroll = scrollPosition ? "bg-teal-900" : "";

  return (
    <>
      <nav
        className={`fixed top-0 z-[1030] w-full ${bgScroll} ${padTop} ${needBg} transition-all duration-300`}
      >
        <div className="container md:px-16">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <a
                href="/"
                className="flex items-center text-white font-bold text-xl"
              >
                <img
                  src="/logo.png"
                  alt="logo"
                  className="h-10 w-10 inline-block mx-2 p-[2px] rounded-full bg-white"
                />
                Badak Gunung
              </a>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-x-8">
                {listmenu.map((item, index) => (
                  <a
                    href={item.path}
                    className="uppercase font-medium text-white hover:text-gray-300 after:content-[''] after:block after:border-b-2 after:transition-all after:duration-300 after:scale-x-0 after:origin-center hover:after:scale-x-100"
                    key={index}
                  >
                    {item.page}
                  </a>
                ))}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={handleClick}
                id="toggleButton"
                className="block lg:hidden text-white focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div
        id="offcanvas"
        className={`transition-transform duration-300 ease-linear bg-gray-900 text-white fixed top-0 left-0 w-10/12 flex flex-col p-6 sm:hidden gap-y-6 rounded z-[1035] ${
          isMenuOpen
            ? "visible translate-x-0 h-screen"
            : "-translate-x-[100%] invisible"
        }`}
        ref={offcanvasRef}
      >
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="flex items-center align-middle text-white font-bold text-xl"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="h-10 w-10 inline-block mx-2 p-[2px] rounded-full bg-white"
            />
            Badak Gunung
          </a>
        </div>
        {listmenu.map((item, index) => (
          <button
            key={index}
            className="uppercase font-medium text-white bg-gradient-to-r from-teal-500 to-teal-900 px-2 py-2 rounded shadow-lg text-left"
            onClick={() => handleClickItem(item.path)}
          >
            {item.page}
          </button>
        ))}
      </div>
    </>
  );
};

export default Navbar;
