import { useState, useEffect } from "react"

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    //initial window size
    handleResize()

    //detach listener
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

    //detach listener
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return keyDown
}
