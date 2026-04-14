import React, { useState, useRef } from "react";
import styles from "./CalendarPage.module.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { mainApi } from "@apis/mainApi";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function CalendarPage() {
  const [monthEvents, setMonthEvents] = useState([]);
  const calendarRef = useRef();
  const [loading, setLoading] = useState(false);

  const convertEventData = (apiData) => {
    const events = [];
    const typeColors = {
      전도: "#c2d8e8",
      파손: "#f8b8c6",
      방화: "#e8b5a2",
      흡연: "#d9c2f0",
      유기: "#c6e8d9",
      절도: "#b8d8ba",
      폭행: "#f9e4ad",
    };

    apiData.forEach(({ date, anomalyTypes }) => {
      const types = anomalyTypes || {};
      Object.entries(types).forEach(([koreanType, count]) => {
        if (count && count > 0) {
          const color = typeColors[koreanType] || "#00000000";
          events.push({
            title: `${koreanType} ${count}회`,
            start: date,
            end: date,
            backgroundColor: color,
            borderColor: color,
          });
        }
      });
    });

    return events;
  };

  const handleChangeMonth = async (arg) => {
    setLoading(true);
    // 월이 변경될때 월별 이상행동 기록 api
    const currentDate = arg.view.currentStart;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formatted = `${year}-${String(month).padStart(2, "0")}`;
    try {
      const response = await mainApi.loadCalendar(formatted);
      if (response.success) {
        setMonthEvents(convertEventData(response.data));
      } else {
        toast.error(response.error || "달력 조회 실패");
        console.error(response.error);
      }
    } catch (error) {
      console.error("CalendarPage: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  };

  const handleNextClick = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  };

  return (
    <div className={styles.calendarpage}>
      <div className={styles.calendarpage__wrapper}>
        <div className={styles.calendarpage__wrapper__calendar}>
          <FullCalendar
            ref={calendarRef}
            headerToolbar={{
              left: "customPrev",
              center: "title",
              right: "customNext",
            }}
            customButtons={{
              customPrev: {
                text: "<",
                click: handlePrevClick,
              },
              customNext: {
                text: ">",
                click: handleNextClick,
              },
            }}
            titleFormat={{ year: "numeric", month: "2-digit" }}
            dayCellContent={(arg) => String(arg.date.getDate())}
            plugins={[dayGridPlugin]}
            dayMaxEventRows={false}
            height={"auto"}
            initialView="dayGridMonth"
            locale={"ko"}
            events={monthEvents}
            datesSet={(arg) => {
              handleChangeMonth(arg);
            }}
            themeSystem="bootstrap"
          />
          {loading && (
            <div className={styles.loader}>
              <ClipLoader color="#2c3e50" loading={loading} size={50} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
