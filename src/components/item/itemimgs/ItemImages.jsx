import { useRef, useState, useCallback, lazy, Suspense } from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import getData from '../../../constans/getData';

const PhotoSlider = lazy(() =>
  import('react-photo-view').then((mod) => ({ default: mod.PhotoSlider }))
);

const ItemImages = ({ imgs }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const { main_color } = getData;

  const scrollToImage = useCallback((idx) => {
    if (!ref.current) return;
    const containerWidth = ref.current.offsetWidth;
    ref.current.scrollTo({
      left: -containerWidth * idx,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className="w-full md:w-6/12 flex flex-col gap-4 p-4 md:p-6 font-[Cairo]">
      {/* Main Image Carousel */}
      <div
        ref={ref}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar rounded-2xl border border-base-300"
      >
        {imgs.map((src, i) => (
          <div
            key={i}
            className="min-w-full snap-center flex justify-center items-center p-2"
          >
            <img
              src={src}
              alt={`item-${i}`}
              loading="lazy"
              onClick={() => {
                setVisible(true);
                setIndex(i);
              }}
              className="rounded-xl max-h-[350px] object-contain transition-transform duration-300 hover:scale-105 cursor-zoom-in shadow-md"
            />
          </div>
        ))}
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto gap-3 px-1 py-2 no-scrollbar">
        {imgs.map((src, i) => (
          <div
            key={i}
            onClick={() => {
              scrollToImage(i);
              setIndex(i);
            }}
            className={`min-w-[70px] max-w-[80px] rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105 border-2 ${i === index ? 'ring-2 ring-offset-1' : 'border-transparent'
              }`}
            style={{
              borderColor: i === index ? main_color : 'transparent',
            }}
          >
            <img
              src={src}
              alt={`thumb-${i}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Fullscreen Image Viewer */}
      <Suspense fallback={null}>
        {visible && (
          <PhotoSlider
            images={imgs.map((src) => ({ src, key: src }))}
            visible={visible}
            onClose={() => setVisible(false)}
            index={index}
            onIndexChange={setIndex}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ItemImages;
