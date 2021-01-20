import styles from "./ItineraryBoard.module.scss"
import { getFormatTime } from "../../utils/itineraryBoardLib"

const AppointmentTime = ({ card, startTime, endTime }) => {
  return (
    <div className={styles.appointment_time} data-cardid={card.id}>
      {startTime && !isNaN(startTime.getTime()) ? (
        <div data-cardid={card.id}>
          <time data-cardid={card.id}>{getFormatTime(startTime)}</time>
          <span data-cardid={card.id}>-</span>
          <time data-cardid={card.id} aria-label="expandEndTime">
            {getFormatTime(endTime)}
          </time>
        </div>
      ) : null}
    </div>
  )
}

export default AppointmentTime
