import type { ReactNode } from "react";
import type { ModalType } from "./Modal";

type HomeProps = {
  onOpen: (type: ModalType) => void;
};

type DesktopIconProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function DesktopIcon({
  label,
  onClick,
  children,
}: DesktopIconProps) {
  return(
    <button
      className="desktop-icon"
      onClick={onClick}
    >
      <div className="icon">
        {children}
      </div>

      <span>{label}</span>
    </button>
  );
}

export default function Home({ onOpen }: HomeProps) {
  return (
    <div className="home">

      {/* Small decorative star */}
      <div className="star">
        ✦
      </div>

      {/* Main introduction */}
      <section className="intro">

        <h1>
          hi! <span>Tashawna</span>
        </h1>

        <p>
          graphic designer, student
        </p>

      </section>


      {/* Navigation */}
      <nav className="navigation">

        <DesktopIcon
          label="about"
          onClick={() => onOpen("about")}
        >
          <span className="person-icon">
            ♡
          </span>
        </DesktopIcon>


        <DesktopIcon
          label="portfolio"
          onClick={() => onOpen("portfolio")}
        >
          <span className="folder-icon">
            ▱
          </span>
        </DesktopIcon>


        <DesktopIcon
          label="contact"
          onClick={() => onOpen("contact")}
        >
          <span className="mail-icon">
            @
          </span>
        </DesktopIcon>


        <DesktopIcon
          label="resume"
          onClick={() => onOpen("resume")}
        >
          <span className="document-icon">
            ?
          </span>
        </DesktopIcon>

      </nav>


      {/* Tiny decorative character/image area */}
      <div className="decorative-character">
        ✿
      </div>

    </div>
  );
}