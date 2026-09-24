import chiikawa from "../assets/ChiikawaGif.gif";

import amyBanner from "../assets/Alfa-Art/Amy Putman_Tashawna_Banner.jpg";
import brianBanner from "../assets/Alfa-Art/Banner_Brian Keeler_Tashawna.jpg";
import brianKeeler from "../assets/Alfa-Art/Brian Keeler_Tashawna.jpg";
import image from "../assets/Alfa-Art/image.jpeg";
import keithVogrin from "../assets/Alfa-Art/Keith Vogrin Thumbnail_Anderson 2.jpg";
import rituBajaj from "../assets/Alfa-Art/Ritu Bajaj_Tashawna.jpg";
import ubAcmFallGbm from "../assets/ubACM/fallgbm.png";
import ubAcmResumeRoast from "../assets/ubACM/resumeroastfixed.webp";
import ubAcmEventGraphic from "../assets/ubACM/ACM_WEBSITE_VER.webp";

import {
  useEffect,
  useRef,
  useState,
} from "react";


export type ModalType =
  | "about"
  | "portfolio"
  | "contact"
  | "resume"
  | null;


type ModalProps = {
  type: ModalType;
  onClose: () => void;
};


type PortfolioProject = {
  title: string;
  category: string;
  image: string;
  wide?: boolean;
};


type PortfolioFolder = {
  id: string;
  label: string;
  projects: PortfolioProject[];
};


const modalInfo = {
  about: {
    title: "About Me",
    url: "Tashawna.com/about",
  },

  portfolio: {
    title: "Portfolio",
    url: "Tashawna.com/portfolio",
  },

  contact: {
    title: "Contact",
    url: "Tashawna.com/contact",
  },

  resume: {
    title: "Resume",
    url: "Tashawna.com/resume",
  },
};


const alfaArtGalleryProjects: PortfolioProject[] = [
  {
    title: "Pigmented Perceptions",
    category: "Banner Design",
    image: amyBanner,
  },

  {
    title: "Pigmented Perceptions",
    category: "Banner Design",
    image: brianBanner,
  },

  {
    title: "Pigmented Perceptions",
    category: "Poster Design",
    image: brianKeeler,
    wide: true,
  },

  {
    title: "Pigmented Perceptions",
    category: "Poster Design",
    image: rituBajaj,
    wide: true,
  },
  
  {
    title: "2026 NBAS Oil Exhibition",
    category: "Short Thumbnail Design",
    image: image,
    wide: true,
  },


  {
    title: "2026 NBAS Oil Exhibition",
    category: "Thumbnail Design",
    image: keithVogrin,
    wide: true,
  },

];


const ubAcmProjects: PortfolioProject[] = [
  {
    title: "UB ACM Fall GBM",
    category: "Event Poster",
    image: ubAcmFallGbm,
    wide: true,
  },
  {
    title: "UB ACM Resume Roast",
    category: "Event Poster",
    image: ubAcmResumeRoast,
    wide: true,
  },
  {
    title: "UB ACM Event Graphic",
    category: "Event Poster",
    image: ubAcmEventGraphic,
    wide: true,
  },
];


const portfolioFolders: PortfolioFolder[] = [
  {
    id: "alfa-art-gallery",
    label: "Alfa-Art-Gallery",
    projects: alfaArtGalleryProjects,
  },
  {
    id: "ub-acm",
    label: "UB ACM",
    projects: ubAcmProjects,
  },
];


/*
  =====================================================
  MODAL
  =====================================================
*/

export default function Modal({
  type,
  onClose,
}: ModalProps) {

  /*
    Position of the modal.

    null = centered.
  */

  const [position, setPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);


  /*
    Currently selected portfolio project.
  */

  const [
    selectedProject,
    setSelectedProject,
  ] = useState<PortfolioProject | null>(null);


  /*
    Selected folder for the portfolio content.
  */

  const [selectedPortfolioFolderId, setSelectedPortfolioFolderId] = useState<string | null>(null);

  const selectedPortfolioFolder =
    portfolioFolders.find(
      (folder) => folder.id === selectedPortfolioFolderId
    ) ?? null;


  /*
    Dragging state.
  */

  const dragging = useRef(false);


  /*
    Drag starting information.
  */

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    windowX: 0,
    windowY: 0,
  });


  /*
    When a new modal opens,
    put it back in the center.

    Also close any selected portfolio project.
  */

  useEffect(() => {
    setPosition(null);
    setSelectedProject(null);
    setSelectedPortfolioFolderId(null);
  }, [type]);


  /*
    ===================================================
    ESCAPE KEY
    ===================================================
  */

  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      if (event.key === "Escape") {

        /*
          If a portfolio image is open,
          close that first.
        */

        if (selectedProject) {
          setSelectedProject(null);
          return;
        }

        onClose();
      }

    };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [onClose, selectedProject]);


  /*
    No modal selected.
  */

  if (!type) {
    return null;
  }


  const info = modalInfo[type];


  /*
    ===================================================
    START DRAGGING MODAL
    ===================================================
  */

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {

    const modal =
      event.currentTarget.parentElement;

    if (!modal) return;


    const rect =
      modal.getBoundingClientRect();


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
    MOVE MODAL
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
      Keep part of the modal visible.
    */

    const modalWidth = 470;

    const visible = 70;


    newX = Math.max(
      -modalWidth + visible,
      Math.min(
        window.innerWidth - visible,
        newX
      )
    );


    newY = Math.max(
      0,
      Math.min(
        window.innerHeight - visible,
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
    MODAL POSITION
    ===================================================
  */

  const modalStyle =
    position === null
      ? undefined
      : {
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "none",
        };


  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="browser-window"
        style={modalStyle}

        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ========================================
            BROWSER HEADER
        ======================================== */}

        <div
          className="browser-top"

          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >

          <div className="browser-dots">
            <span />
            <span />
            <span />
          </div>


          <div className="browser-window-title">
            {info.title}
          </div>


          <button
            type="button"
            className="browser-close"

            onPointerDown={(event) => {
              event.stopPropagation();
            }}

            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>

        </div>


        {/* ========================================
            URL BAR
        ======================================== */}

        <div className="address-bar">

          <span className="address-lock">
            ●
          </span>

          <span>
            {info.url}
          </span>

        </div>


        {/* ========================================
            CONTENT
        ======================================== */}

        <div className="modal-content">

          <h2>
            {info.title}
          </h2>


          {/* ABOUT */}

          {type === "about" && (
            <div className="about-content">

              <div className="about-copy">

                <p>
                  Hi, I’m Tashawna! I’m a Graphic Design
                  major at the University at Buffalo.
                  When I’m not designing, I’m probably
                  playing video games or watching anime.
                </p>

                <p>
                  Fun fact: My top 3 animes are Chiikawa,
                  Jojo Bizzare Adventure, and Dragon Ball Z.
                </p>

              </div>

              <div className="about-image-wrap">

                <img
                  src={chiikawa}
                  alt="Chiikawa animation"
                  className="chiikawa-gif"
                />

              </div>

            </div>
          )}


          {/* PORTFOLIO */}

          {type === "portfolio" && (
            <>

              {/* FOLDER SELECTOR */}

              {!selectedPortfolioFolder && (
                <div className="portfolio-folder-chooser">

                  {portfolioFolders.map((folder) => (
                    <button
                      key={folder.id}
                      type="button"
                      className="portfolio-entry-button"
                      onClick={() => setSelectedPortfolioFolderId(folder.id)}
                    >
                      <div className="portfolio-entry-folder" aria-hidden="true">
                        <div className="folder-tab" />
                      </div>

                      <span className="portfolio-entry-label">
                        {folder.label}
                      </span>
                    </button>
                  ))}

                </div>
              )}

              {selectedPortfolioFolder && selectedPortfolioFolder.projects.length > 0 && (
                <div className="portfolio-gallery">

                  {selectedPortfolioFolder.projects.map((project) => (
                    <button
                      key={`${selectedPortfolioFolder.id}-${project.title}-${project.category}`}
                      className="portfolio-card"
                      type="button"
                      onClick={() => setSelectedProject(project)}
                    >

                      <div className={
                        project.wide
                          ? "portfolio-image-wrapper portfolio-image-wrapper-wide"
                          : "portfolio-image-wrapper"
                      }>

                        <img
                          src={project.image}
                          alt={project.title}
                          className={
                            project.wide
                              ? "portfolio-image portfolio-image-wide"
                              : "portfolio-image"
                          }
                        />

                        <div className="portfolio-hover">
                          <span>
                            view project
                          </span>
                        </div>

                      </div>

                      <div className="portfolio-card-info">
                        <strong>
                          {project.title}
                        </strong>

                        <span>
                          {project.category}
                        </span>
                      </div>

                    </button>
                  ))}

                </div>
              )}

            </>
          )}


          {/* CONTACT */}

          {type === "contact" && (
            <>

              <p>
                Want to get into contact?
                Email me here! :)
              </p>

              <a href="mailto:tashawnaa230@gmail.com">
                tashawnaa230@gmail.com
              </a>

            </>
          )}


          {/* RESUME */}

          {type === "resume" && (
            <>

              <p>
                Education, experience, skills,
                and selected design work.
              </p>

              <button
                className="resume-button"
                type="button"
                onClick={() => window.open('/resume.pdf', '_blank', 'noopener,noreferrer')}
              >
                View Resume
              </button>

            </>
          )}

        </div>

      </div>


      {/* ========================================
          PORTFOLIO PROJECT SHOWCASE
      ======================================== */}

      {selectedProject && (

        <div
          className="project-showcase-overlay"

          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement | null;

            // Close unless the click was directly on the image element.
            if (!target || !target.closest('.project-showcase-photo')) {
              setSelectedProject(null);
            }
          }}
        >

          <div
            className={
              selectedProject.wide
                ? "project-showcase project-showcase-wide"
                : "project-showcase"
            }
          >
            {/* Large image */}

            <div className={
              selectedProject.wide
                ? "project-showcase-image project-showcase-image-wide"
                : "project-showcase-image"
            }>

              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className={
                  selectedProject.wide
                    ? "project-showcase-photo project-showcase-photo-wide"
                    : "project-showcase-photo"
                }
              />

            </div>


            {/* Project information */}

          </div>

        </div>

      )}

    </div>
  );
}