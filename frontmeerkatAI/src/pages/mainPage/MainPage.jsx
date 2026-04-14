import React, { useEffect, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import styles from "./MainPage.module.scss";
import CommonButton from "../../components/commonButton/CommonButton";
import VideoItem from "./components/videoItem/VideoItem";
import { DayPicker } from "react-day-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ko } from "date-fns/locale";
import {
  faFilter,
  faCircleInfo,
  faCalendarDays,
  faSearch,
  faTrash,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../../components/modal/Modal";
import { mainApi } from "@apis/mainApi";
import { toast } from "react-toastify";
import NotFound from "./components/notFound/NotFound";
import { ClipLoader } from "react-spinners";
import { confirmAlert } from "react-confirm-alert";

export default function MainPage() {
  const [currentItems, setCurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(6);

  // 총 페이지 수 계산
  const pageRange = 5;
  const blockStart = Math.floor(currentPage / pageRange) * pageRange;

  // 현재 블록에서 표시할 페이지 버튼들을 생성하되, 최대 페이지 수를 초과하지 않도록 함
  const pages = Array.from(
    { length: Math.min(pageRange, pageCount - blockStart) },
    (_, i) => blockStart + i
  );

  const [dayFilterOpen, setDayFilterOpen] = useState(false);
  const dayFilterRef = useRef(null);
  const [range, setRange] = useState({ from: null, to: null });
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const [video, setVideo] = useState(null);
  const [videoPlayURL, setVideoPlayURL] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getDate = (fulldate) => {
    const year = fulldate.getFullYear();
    const month = fulldate.getMonth() + 1;
    const day = fulldate.getDate();
    const formatted = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return formatted;
  };

  const getVideoList = async (page) => {
    setLoading(true);
    let from = "";
    let to = "";
    if (range && range.to && range.from) {
      from = getDate(range.from);
      to = getDate(range.to);
    } else {
      from = "";
      to = "";
    }
    try {
      const response = await mainApi.getVideoList({
        start_date: from,
        end_date: to,
        anomaly_behavior_type: category,
        page: page + 1,
      });
      if (response.success) {
        setCurrentItems(response.data.videos);
        setTotalItems(response.data.pagination.total);
        setPageCount(response.data.pagination.pages);
        setLimit(response.data.pagination.limit);
      } else {
        toast.error(response.message || "영상 리스트 조회 실패");
        console.error(response.message);
      }
    } catch (error) {
      console.error("MainPage: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCheckedItems({});
    getVideoList(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    getVideoList(0);
  };

  // 날짜 필터 바깥쪽 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dayFilterRef.current &&
        !dayFilterRef.current.contains(event.target)
      ) {
        setDayFilterOpen(false);
      }
    };

    if (dayFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dayFilterOpen]); // dayFilterOpen 상태 변경 시마다 실행

  const getPlayURL = async (id) => {
    try {
      const response = await mainApi.viewVideo(id);
      if (response.success) {
        setVideoPlayURL(response.data.file_path);
      } else {
        toast.error(response.message || "비디오 조회 실패");
        console.error(response.message);
      }
    } catch (error) {
      console.error("MainPage: ", error);
    }
  };

  const handleVideoClicked = async (item) => {
    await getPlayURL(item.video_id);
    setVideo(item);
    setIsOpen(true);
  };

  const handleCheckChange = (index, isChecked) => {
    setCheckedItems((prev) => ({ ...prev, [index]: isChecked }));
  };

  const handleVideoDelete = async () => {
    const videos = currentItems
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => checkedItems[index])
      .map(({ item }) => item.video_id);

    if (videos.length === 0) return;

    confirmAlert({
      title: "정말 삭제하시겠습니까?",
      buttons: [
        {
          label: "삭제",
          onClick: async () => {
            setLoading(true);

            // Confirm action
            setLoading(true);
            try {
              const response = await mainApi.deleteVideo({ videoIds: videos });
              if (response.success) {
                setCheckedItems({});
                setCurrentPage(0);
                getVideoList(0);
              } else {
                toast.error(response.message || "영상 삭제 실패");
                console.error(response.message);
              }
            } catch (error) {
              console.error("MainPage: ", error);
            } finally {
              setLoading(false);
            }
          },
        },
        {
          label: "취소",
          onClick: () => {
            // Cancel action
          },
        },
      ],
    });
  };

  const handleVideoDownload = async () => {
    const videos = currentItems
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => checkedItems[index])
      .map(({ item }) => item.video_id);

    toast.info("영상 다운로드 아직 구현안됨");
    return;

    // try {
    //   const response = await mainApi.downloadVideo({ videoIds: videos });
    //   console.log(response.data);
    //   if (response.success) {
    //     toast.info("다운로드 시작됨");
    //   } else {
    //     toast.error(response.message || "영상 다운로드 실패");
    //     console.error(response.message);
    //   }
    // } catch (error) {
    //   console.error("MainPage: ", error);
    // }
  };

  const getBadgeColor = (type) => {
    const typeColors = {
      전도: "#c2d8e8",
      파손: "#f8b8c6",
      방화: "#e8b5a2",
      흡연: "#d9c2f0",
      유기: "#c6e8d9",
      절도: "#b8d8ba",
      폭행: "#f9e4ad",
    }[type];
    return typeColors ? typeColors : "#00000000";
  };

  return (
    <div className={styles.mainpage}>
      <div className={styles.mainpage__top}>
        <div className={styles.mainpage__top__filter}>
          <div className={styles.mainpage__top__filter__title}>
            <FontAwesomeIcon icon={faFilter} size="2x" />
          </div>
          <div className={styles.mainpage__top__filter__date}>
            <span>날짜 선택: </span>
            <div className={styles.dateRangeDisplay} ref={dayFilterRef}>
              {range && range.from && range.to ? (
                <span className={styles.dateRangeText}>
                  {`${range.from.toLocaleDateString()} ~ ${range.to.toLocaleDateString()}`}
                </span>
              ) : (
                <span className={styles.placeholderText}>전체 기간</span>
              )}
              <button
                onClick={() => setDayFilterOpen(!dayFilterOpen)}
                className={styles.datePickerButton}
              >
                <FontAwesomeIcon icon={faCalendarDays} size="lg" />
              </button>
              {dayFilterOpen && (
                <div className={styles.mainpage__top__filter__date__calendar}>
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    locale={ko}
                    formatters={{
                      formatCaption: (month, options) =>
                        `${month.getFullYear()}년 ${month.getMonth() + 1}월`,
                      formatWeekdayName: (day, options) =>
                        ["일", "월", "화", "수", "목", "금", "토"][
                          day.getDay()
                        ],
                      formatDay: (date, options) => date.getDate().toString(),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.mainpage__top__filter__category}>
            <span>유형 선택: </span>
            <select
              className={styles.mainpage__top__filter__category__select}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">전체</option>
              <option value="type1">전도</option>
              <option value="type2">파손</option>
              <option value="type3">방화</option>
              <option value="type4">흡연</option>
              <option value="type5">유기</option>
              <option value="type6">절도</option>
              <option value="type7">폭행</option>
            </select>
          </div>
          <div className={styles.mainpage__top__filter__search}>
            <CommonButton
              size="small"
              label={
                <FontAwesomeIcon icon={faSearch} size="lg"></FontAwesomeIcon>
              }
              color="primary"
              onClick={handleSearch}
            >
              검색
            </CommonButton>
          </div>
        </div>
        <div className={styles.mainpage__top__types}>
          <div className={styles.mainpage__top__types__title}>
            <FontAwesomeIcon icon={faCircleInfo} size="2x" />
          </div>
          <div className={styles.mainpage__top__types__content}>
            <div className={styles.first}>
              <div className={styles.falling}>전도</div>
              <div className={styles.break}>파손</div>
              <div className={styles.arson}>방화</div>
              <div className={styles.smoke}>흡연</div>
            </div>
            <div className={styles.second}>
              <div className={styles.abandon}>유기</div>
              <div className={styles.thief}>절도</div>
              <div className={styles.assault}>폭행</div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <div className={styles.loader}>
          <ClipLoader color="#2c3e50" loading={loading} size={50} />
        </div>
      ) : currentItems.length !== 0 ? (
        <div className={styles.mainpage__list}>
          {currentItems.map((item, index) => (
            <VideoItem
              key={item.video_id}
              time={item.created_at.replace("T", " ")}
              type={item.anomaly_behavior_type}
              thumbnail={item.thumbnail_path}
              onClick={() => handleVideoClicked(item)}
              isChecked={!!checkedItems[index]}
              onCheckChange={(checked) => handleCheckChange(index, checked)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.mainpage__notfound}>
          <NotFound />
        </div>
      )}

      <div className={styles.mainpage__pagination}>
        <button
          className={styles.pageItem}
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
          disabled={currentPage <= 0}
        >
          {"<"}
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`${styles.pageItem} ${
              currentPage === page ? styles.active : ""
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page + 1}
          </button>
        ))}
        <button
          className={styles.pageItem}
          onClick={() =>
            setCurrentPage(Math.min(currentPage + 1, pageCount - 1))
          }
          disabled={currentPage >= pageCount - 1}
        >
          {">"}
        </button>
      </div>
      <div className={styles.mainpage__buttons}>
        <CommonButton
          icon={<FontAwesomeIcon icon={faTrash} size="1x"></FontAwesomeIcon>}
          label="선택 항목 삭제"
          color="primary"
          size="small"
          onClick={handleVideoDelete}
        ></CommonButton>
        {/* <CommonButton
          icon={<FontAwesomeIcon icon={faDownload} size="1x"></FontAwesomeIcon>}
          label="선택 항목 다운로드"
          color="primary"
          size="small"
          onClick={handleVideoDownload}
        ></CommonButton> */}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className={styles.modalwrapper}>
          <div className={styles.modalwrapper__video}>
            {videoPlayURL ? (
              <video
                className={styles.modalwrapper__video__player}
                controls
                autoPlay
                onError={(e) => console.error("Video Error:", e)}
                onLoadStart={() =>
                  console.log("Video load started, URL:", videoPlayURL)
                }
              >
                <source src={videoPlayURL}></source>
              </video>
            ) : (
              <NotFound />
            )}
          </div>
          {video && (
            <div className={styles.modalwrapper__title}>
              <div
                className={styles.modalwrapper__title__circle}
                style={{
                  backgroundColor: getBadgeColor(video.anomaly_behavior_type),
                }}
              ></div>
              <span className={styles.modalwrapper__title__text}>
                {`${video.created_at.replace("T", " ")} ${
                  video.anomaly_behavior_type
                }`}
              </span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
