import { useState, useEffect } from "react"

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    let timer

    const handleResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }, 500)
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

export const useKeyDown = (callback) => {
  const [keyDown, setKeyDown] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      callback(e.keyCode)
      setKeyDown(e.keyCode)
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return keyDown
}
