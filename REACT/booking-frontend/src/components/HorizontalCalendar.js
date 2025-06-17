import React, { useRef, useState, useEffect, useCallback } from 'react';
import './HorizontalCalendar.css';

const HorizontalCalendar = ({
  startDate = new Date(),
  totalDays = 30,
  initialSelectedDate = new Date(),
  onDateSelect = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const scrollRef = useRef(null);
  const dateRefs = useRef({});

  const generateDates = useCallback((start, count) => {
    const dates = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  const dates = generateDates(startDate, totalDays);

  const handleWheel = useCallback((e) => {
    if (!scrollRef.current) return;
    
    if (scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
      e.preventDefault();
      scrollRef.current.scrollBy({
        left: e.deltaY * 2,
        behavior: 'auto'
      });
    }
  }, []);

  useEffect(() => {
    const calendar = scrollRef.current;
    if (!calendar) return;

    const options = { passive: false };
    calendar.addEventListener('wheel', handleWheel, options);

    return () => {
      calendar.removeEventListener('wheel', handleWheel, options);
    };
  }, [handleWheel]);

  useEffect(() => {
    const key = selectedDate.toDateString();
    const el = dateRefs.current[key];
    if (el && scrollRef.current) {
      const container = scrollRef.current;
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = el.offsetLeft - container.offsetLeft - (containerRect.width - elRect.width) / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
    onDateSelect(selectedDate);
  }, [selectedDate, onDateSelect]);

  // const scroll = useCallback((direction) => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollBy({
  //       left: direction === 'left' ? -200 : 200,
  //       behavior: 'smooth'
  //     });
  //   }
  // }, []);

  const isToday = useCallback((date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  const formatDay = useCallback((date) => 
    date.toLocaleDateString('en-US', { weekday: 'short' }), []);

  return (
    <div className="calendar-wrapper">
      <div 
        className="calendar-container" 
        ref={scrollRef}
      >
        {dates.map((date) => {
          const dateKey = date.toDateString();
          const isSelected = dateKey === selectedDate.toDateString();
          const dayLabel = isToday(date) ? 'Today' : formatDay(date);

          return (
            <div
              key={dateKey}
              ref={(el) => (dateRefs.current[dateKey] = el)}
              className={`calendar-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="day">{dayLabel}</div>
              <div className="date">{date.getDate()}</div>
            </div>
          );
        })}
      </div>

      {/* <div className="arrow-container">
        <button className="arrow left" onClick={() => scroll('left')}>
          ‹
        </button>
        <button className="arrow right" onClick={() => scroll('right')}>
          ›
        </button>
      </div> */}
    </div>
  );
};

export default HorizontalCalendar;