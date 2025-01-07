import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import './FullscreenCarousel.scss';
import { downloadFiles, isMobile } from '../../utils/globalUtilities';

interface FullscreenCarouselProps {
  images: any[];
  showCarousel: boolean;
  setShowCarousel: (show: boolean) => void;
  projectData: {
    projectName: string;
    towerCode: string;
    floorNumber: string;
    unitNumber: string;
  };
}

const FullscreenCarousel: React.FC<FullscreenCarouselProps> = ({
  images,
  showCarousel,
  setShowCarousel,
  projectData
}) => {
  const [isItMobile] = useState(isMobile());

  const getProjectTitle = `My Properties / ${projectData.projectName}, Tower ${Number(projectData.towerCode)}, ${Number(projectData.floorNumber)}${projectData.unitNumber}`;

  const slides = images
    .filter((image: any) => image?.type !== "site image")
    .map((image, index) => ({
      src: image.url,
      alt: image.description || `Image ${index + 1}`,
      title: isItMobile ? undefined : getProjectTitle
    }));

  const handleDownload = ({ slide }: { slide: { src: string } }) => {
    const fileName = slide.src.split('/').pop() || 'image';
    const fileExtension = fileName.split('.').pop() || 'png';
    downloadFiles(slide.src, `${fileName.split('.')[0]}.${fileExtension}`);
  };

  return (
    <Lightbox
      open={showCarousel}
      close={() => setShowCarousel(false)}
      slides={slides}
      plugins={[Captions, Zoom, Thumbnails, Download]}
      captions={{ descriptionTextAlign: "center" }}
      zoom={{
        scrollToZoom: true,
        maxZoomPixelRatio: 5,
      }}
      thumbnails={{
        width: 120,
        height: 80,
        padding: 2,
      }}
      carousel={{
        spacing: 0,
        padding: isItMobile ? "16px" : "60px",
      }}
      toolbar={{
        buttons: ['zoom', 'download', 'close'],
      }}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, .9)' },
        captionsTitle: isItMobile
          ? { display: 'none' }
          : { fontSize: '18px', color: '#fff', position: 'absolute', top: '20px', left: '20px' },
      }}
      controller={{ closeOnBackdropClick: true }}
      download={{ download: handleDownload }}
    />
  );
};

export default FullscreenCarousel;
