import {
  useRef,
  useState,
  type ReactNode,
} from "react";


import type { ModalType } from "./Modal";


type DesktopProps = {
  onOpen: (type: ModalType) => void;

  darkMode: boolean;

  onToggleTheme: () => void;
};


type DesktopIconProps = {
  label: string;

  type: ModalType;

  onOpen: (type: ModalType) => void;

  children: ReactNode;
};


/*
  =====================================================
  DESKTOP ICON
  =====================================================
*/

function DesktopIcon({
  label,
  type,
  onOpen,
  children,
}: DesktopIconProps) {
  return (
    <button
      className="desktop-icon"
      type="button"
      onClick={() => onOpen(type)}
    >
      <div className="desktop-icon-art">
        {children}
      </div>

      <span className="desktop-icon-label">
        {label}
      </span>
    </button>
  );
}


/*
  =====================================================
  DESKTOP
  =====================================================
*/

export default function Desktop({
  onOpen,
  darkMode,
  onToggleTheme,
}: DesktopProps) {

  /*
    Position of the desktop window.

    null = use CSS to center it initially.
    Once the user drags it, we store
    its exact position.
  */

  const [position, setPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);


  /*
    Keeps track of whether we're currently dragging.
  */

  const dragging = useRef(false);


  /*
    Where the mouse was when dragging began.
  */

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    windowX: 0,
    windowY: 0,
  });


  /*
    ===================================================
    START DRAGGING
    ===================================================
  */

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {

    /*
      Don't start dragging if the user
      clicked one of the window buttons.
    */

    const target = event.target as HTMLElement;

    if (
      target.closest(".window-buttons") ||
      target.closest("button")
    ) {
      return;
    }


    const desktop =
      event.currentTarget.parentElement;

    if (!desktop) return;


    const rect =
      desktop.getBoundingClientRect();


    /*
      If this is the first drag, convert
      the CSS-centered position into
      an actual x/y position.
    */

    if (position === null) {
      setPosition({
        x: rect.left,
        y: rect.top,
      });

      dragStart.current = {
        mouseX: event.clientX,
        mouseY: event.clientY,
        windowX: rect.left,
        windowY: rect.top,
      };
    } else {
      dragStart.current = {
        mouseX: event.clientX,
        mouseY: event.clientY,
        windowX: position.x,
        windowY: position.y,
      };
    }


    dragging.current = true;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );
  };


  /*
    ===================================================
    DRAGGING
    ===================================================
  */

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {

    if (!dragging.current) {
      return;
    }


    const deltaX =
      event.clientX -
      dragStart.current.mouseX;

    const deltaY =
      event.clientY -
      dragStart.current.mouseY;


    let newX =
      dragStart.current.windowX +
      deltaX;

    let newY =
      dragStart.current.windowY +
      deltaY;


    /*
      Keep the window from completely
      disappearing off screen.
    */

    const windowWidth = 650;
    const minVisible = 80;


    newX = Math.max(
      -windowWidth + minVisible,
      Math.min(
        window.innerWidth - minVisible,
        newX
      )
    );


    newY = Math.max(
      0,
      Math.min(
        window.innerHeight - minVisible,
        newY
      )
    );


    setPosition({
      x: newX,
      y: newY,
    });
  };


  /*
    ===================================================
    STOP DRAGGING
    ===================================================
  */

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {

    dragging.current = false;

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {
      // Nothing to do.
    }
  };


  /*
    ===================================================
    DESKTOP WINDOW STYLE
    ===================================================
  */

  const desktopStyle =
    position === null
      ? undefined
      : {
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "none",
        };


  return (
    <div
      className={`desktop-window ${
        darkMode ? "desktop-dark" : ""
      }`}

      style={desktopStyle}
    >

      {/* ============================================
          WINDOW TITLE BAR
      ============================================ */}

      <div
        className="window-titlebar"

        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >

        <div className="window-title">
        Tashawna
        </div>


        <div className="window-buttons">

          <span>−</span>

          <span>□</span>

          <span>×</span>

        </div>

      </div>


      {/* ============================================
          DESKTOP
      ============================================ */}

      <div className="desktop">

        {/* ==========================================
            DESKTOP ICONS
        ========================================== */}

        <div className="desktop-icon-column">

          {/* ABOUT ME */}

          <DesktopIcon
            label="about me"
            type="about"
            onOpen={onOpen}
          >

            <div className="icon-monitor">

              <div className="monitor-screen" />

              <div className="monitor-neck" />

              <div className="monitor-base" />

            </div>

          </DesktopIcon>


          {/* PORTFOLIO */}

          <DesktopIcon
            label="portfolio"
            type="portfolio"
            onOpen={onOpen}
          >

            <div className="icon-folder">

              <div className="folder-tab" />

            </div>

          </DesktopIcon>


          {/* CONTACT */}

          <DesktopIcon
            label="contact"
            type="contact"
            onOpen={onOpen}
          >

            <div className="icon-mail">

              <div className="mail-left" />

              <div className="mail-right" />

            </div>

          </DesktopIcon>


          {/* RESUME */}

          <DesktopIcon
            label="resume"
            type="resume"
            onOpen={onOpen}
          >

            <div className="icon-document">

              <div className="document-fold" />

              <div className="document-lines">

                <span />
                <span />
                <span />

              </div>

            </div>

          </DesktopIcon>

        </div>


        {/* ==========================================
            TASKBAR
        ========================================== */}

        <div className="taskbar">

          {/* ========================================
              LIGHT / DARK MODE
          ======================================== */}

          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle light and dark mode"
          >

            {darkMode ? "☀" : "☾"}

          </button>


          {/* ========================================
              RIGHT SIDE
          ======================================== */}

          <div className="taskbar-right">

            {/* WIFI */}

            <div className="wifi">

              <span className="wifi-outer" />

              <span className="wifi-middle" />

              <span className="wifi-inner" />

              <span className="wifi-dot" />

            </div>


            <div className="volume">
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Speaker */}
    <path
      d="M4 9V15H8L13 19V5L8 9H4Z"
      fill="currentColor"
    />

    {/* Small sound wave */}
    <path
      d="M16 9C17.5 10.5 17.5 13.5 16 15"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />

    {/* Large sound wave */}
    <path
      d="M19 6.5C22.5 10 22.5 14 19 17.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
</div>


            {/* DIVIDER */}

            <div className="taskbar-divider" />


            {/* CLOCK */}

            <div className="clock">

              <span className="clock-time">
                11:11 AM
              </span>

              <span className="clock-date">
                05/20/2024
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}