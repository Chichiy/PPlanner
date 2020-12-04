import React, { useState, useEffect } from "react"

import styles from "./largeCard.module.scss"

const LargeCard = () => {
  return (
    <div className={styles.card_large_background}>
      <div className={styles.card_large}>
        <div className={styles.card_header}>
          <div className={styles.tag_icon}></div>
          <div className={styles.card_title}>烈日鬆餅</div>
          <div className={styles.card_close}>X</div>
        </div>

        <div className={styles.card_main}>
          {/* tag section */}

          <div className={styles.tags_section}>
            <div className={styles.title}>標籤</div>
            <div className={styles.container}>
              <div className={styles.tag}>食物</div>
              <div className={styles.new_tag}>+</div>
            </div>
          </div>

          {/* discription section */}

          <div className={styles.discription_section}>
            <div className={styles.controll_bar}>
              <div className={styles.title}>描述</div>
              <div className={styles.edit_button}>編輯</div>
            </div>
            <div className={styles.container}>
              <div className={styles.discription}>超想吃</div>
            </div>
          </div>

          {/* 
          <div className={styles.card_small_picture}>
            <img
              src="https://mk0newsmarketlxfg8j2.kinstacdn.com/shop/files/2019/01/%E7%B3%99%E7%B1%B3%E7%A9%80%E7%B2%8905.jpg"
              alt="pic"
            />
          </div> */}

          {/* comments section */}

          <div className={styles.comments_section}>
            <div className={styles.controll_bar}>
              <div className={styles.title}>留言</div>
            </div>
            <div className={styles.container}>
              {/* comment */}
              <Comment />
              <Comment />
            </div>
          </div>
        </div>
        <div className={styles.card_sideBar}>
          <div className={styles.title}>新增至卡片</div>
          <div className={styles.button}>待辦事項</div>
          <div className={styles.button}>附件</div>
        </div>
      </div>
    </div>
  )
}
export default LargeCard

const Comment = () => {
  return (
    <div className={styles.comment}>
      <div className={styles.user}>煞</div>
      <div className={styles.details}>
        <div className={styles.info}>
          <div className={styles.name}>煞氣a工程師</div>
          <div className={styles.time}>30分鐘前</div>
        </div>
        <div className={styles.message}> 超想吃</div>
        <div className={styles.tools}>
          <div className={styles.edit_button}>編輯</div>
          <div className={styles.edit_button}>刪除</div>
        </div>
      </div>
    </div>
  )
}
