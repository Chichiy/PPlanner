import React from "react"
import styles from "./ItineraryBoard.module.scss"

const PendingCardsFilter = ({ filter, setFilter, isShowing }) => {
  const handleChangeFilter = (e) => {
    if (e.target.checked) {
      //add option in filiter
      setFilter((prev) => [...prev, e.target.name])
    } else {
      //remove option from filiter
      const newFiliter = filter.filter((option) => option !== e.target.name)
      setFilter(newFiliter)
    }
  }

  return (
    <div
      className={styles.sidebar_filter}
      style={
        isShowing
          ? null
          : {
              margin: "0px",
              height: "0px",
              visibility: "hidden",
              transition:
                "visibility 0s 1s,  height 1s ease-in-out, margin 0.7s 0.3s ease-in",
            }
      }
    >
      <div className={styles.sidebar_filter_caption}>篩選器</div>
      <div className={styles.label_container}>
        <label className={styles.label__hotel}>
          <input
            type="checkbox"
            name="hotel"
            id="hotel"
            defaultChecked
            onChange={handleChangeFilter}
          />
          <div className={styles.checkmark}> </div>
          <span>住宿</span>
        </label>
        <label className={styles.label__activity}>
          <input
            type="checkbox"
            name="activity"
            id="activity"
            defaultChecked
            onChange={handleChangeFilter}
          />
          <div className={styles.checkmark}></div> <span>活動</span>
        </label>
        <label className={styles.label__site}>
          <input
            type="checkbox"
            name="site"
            id="site"
            defaultChecked
            onChange={handleChangeFilter}
          />
          <div className={styles.checkmark}> </div>
          <span>景點</span>
        </label>

        <label className={styles.label__food}>
          <input
            type="checkbox"
            name="food"
            id="food"
            defaultChecked
            onChange={handleChangeFilter}
          />
          <div className={styles.checkmark}> </div>
          <span>食物</span>
        </label>
        <label className={styles.label__commute}>
          <input
            type="checkbox"
            name="commute"
            id="commute"
            defaultChecked
            onChange={handleChangeFilter}
          />
          <div className={styles.checkmark}></div> <span>交通</span>
        </label>

        <label className={styles.label__default}>
          <input
            type="checkbox"
            name="default"
            id="default"
            defaultChecked
            onChange={handleChangeFilter}
          />
          <div className={styles.checkmark}></div>
          <span>預設</span>
        </label>
      </div>
    </div>
  )
}

export default PendingCardsFilter
