import React, { useEffect, useRef } from 'react';

export const Carousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const getListItems = () => {
    const carousel = carouselRef.current;
    return carousel?.querySelectorAll('.carousel-slide') as NodeListOf<HTMLLIElement>;
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const listItems = carousel.querySelectorAll('.carousel-slide') as NodeListOf<HTMLLIElement>;
    listItems.forEach((listItem, i) => {
      if (listItem) {
        const translation = 100 * i;
        listItem.style.transform = `translateX(${translation}%)`;
      }
    });
  }, []);

  const handleToggleLeft = () => {
    const listItems = getListItems();
    const activeListItemIdx = [...listItems].findIndex((listItem) =>
      listItem.classList.contains('active')
    );
    if (activeListItemIdx === 0) return;

    listItems[activeListItemIdx].classList.remove('active');
    listItems[activeListItemIdx - 1].classList.add('active');
    listItems.forEach((listItem, i) => {
      listItem.style.transform = `translate(${100 * (i - (activeListItemIdx - 1))}%)`;
    });
  };

  const handleToggleRight = () => {
    const listItems = getListItems();
    const activeListItemIdx = [...listItems].findIndex((listItem) =>
      listItem.classList.contains('active')
    );
    if (activeListItemIdx === listItems.length - 1) return;

    listItems[activeListItemIdx].classList.remove('active');
    listItems[activeListItemIdx + 1].classList.add('active');
    listItems.forEach((listItem, i) => {
      listItem.style.transform = `translate(${100 * (i - (activeListItemIdx + 1))}%)`;
    });
  };

  return (
    <div className="carousel-container" ref={carouselRef}>
      <ul className="carousel">
        <li className="carousel-slide active">1</li>
        <li className="carousel-slide">2</li>
        <li className="carousel-slide">3</li>
      </ul>
      <button className="carousel-toggle left" onClick={handleToggleLeft}>
        ◄
      </button>
      <button className="carousel-toggle right" onClick={handleToggleRight}>
        ►
      </button>
    </div>
  );
};
