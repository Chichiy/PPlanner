import { useState, useEffect } from "react"

const LinkImg = ({ src }) => {
  const [showImg, setShowImg] = useState(false)

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      setShowImg(true)
    }
    image.src = src
  }, [])

  return showImg ? <img src={src} alt="Link" /> : "Link"
}
export default LinkImg
