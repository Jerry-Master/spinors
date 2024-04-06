import { React, useRef, useEffect } from 'react'
import { TextureLoader, Quaternion, Euler, DoubleSide, SphereGeometry } from 'three'
import { useLoader } from '@react-three/fiber'
import flagTexture from './Assets/jumbotron.jpg'

function getUMatrix(q) {
  const alpha = {x: q.w, y: q.z}
  const beta = {x: -q.y, y: q.x}
  return [alpha, beta]
}

function ActualFlagPole({ position, radius, poleQuaternion, setPoleQuaternion, setTrigger, setAlpha, setBeta }) {
  // Global state
  const clicked = useRef(false)
  const poleRef = useRef()

  // Load a texture
  const texture = useLoader(TextureLoader, flagTexture)
  
  const toRadians = (angle) => angle * (Math.PI / 180)

  // Update Pole rotation on mouse drag
  const handlePointerMove = (e) => {

    if (clicked.current){
      let deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0
      let deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0

      const deltaPoleQuaternion = new Quaternion()
        .setFromEuler(new Euler(toRadians(deltaY * 0.5), toRadians(deltaX * 0.5), 0, 'XYZ'))

      setPoleQuaternion((prev) => {
        poleRef.current.quaternion.multiplyQuaternions(deltaPoleQuaternion, prev)
        const [_alpha, _beta] = getUMatrix(poleRef.current.quaternion)
        setAlpha(_alpha)
        setBeta(_beta)
        return poleRef.current.quaternion
      })

      setTrigger(x => !x)
    }
  }
  const previousTouch = useRef()
  const handleTouchMove = (e) => {
    const touch = e.touches[0]

    if (previousTouch.current) {
        // be aware that these only store the movement of the first touch in the touches array
        e.movementX = touch.pageX - previousTouch.current.pageX
        e.movementY = touch.pageY - previousTouch.current.pageY
    };
    previousTouch.current = touch
    if (clicked.current){
      let deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0
      let deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0

      const deltaPoleQuaternion = new Quaternion()
        .setFromEuler(new Euler(toRadians(deltaY * 0.5), toRadians(deltaX * 0.5), 0, 'XYZ'))

      setPoleQuaternion((prev) => {
        poleRef.current.quaternion.multiplyQuaternions(deltaPoleQuaternion, prev)
        const [_alpha, _beta] = getUMatrix(poleRef.current.quaternion)
        setAlpha(_alpha)
        setBeta(_beta)
        return poleRef.current.quaternion
      })

      setTrigger(x => !x)
    }
  }

  const handlePointerDown = () => {
    clicked.current = true
    // Add a global event listener for pointerup when the mouse is pressed
    window.addEventListener('pointerup', handlePointerUp)
    // Add also the pointer move listener
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('touchmove', handleTouchMove)
  }

  const handlePointerUp = () => {
    clicked.current = false
    // Remove the global event listener for pointerup when the mouse is released
    window.removeEventListener('pointerup', handlePointerUp)
    // Remove also the point move listener
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('touchmove', handleTouchMove)
  }

  // Clean up the global event listeners when the component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const poleHeight = radius
  const poleRadius = radius / 50
  const flagHeight = poleHeight / 6
  const flagWidth = 2 * flagHeight

  // Update Flag rotation on mouse wheel
  const handleWheel = (e) => {    
    const deltaFlagQuaternion = new Quaternion()
        .setFromEuler(new Euler(0, toRadians(e.deltaY * 0.00005), 0, 'XYZ'))

    setPoleQuaternion((prev) => {
      poleRef.current.quaternion.multiplyQuaternions(prev, deltaFlagQuaternion)
      return poleRef.current.quaternion
    })
    const [_alpha, _beta] = getUMatrix(poleQuaternion)
    setAlpha(_alpha)
    setBeta(_beta)
    
    setTrigger(x => !x)
  }

  useEffect(() => {
    window.addEventListener('touchstart', handlePointerDown)
    window.addEventListener("touchend", (e) => {
      previousTouch.current = null;
  });
  }, [])

  return (
    <mesh 
      position={position} 
      onPointerDown={handlePointerDown}
      onWheel={handleWheel}
    >
      {/* Container Sphere */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new SphereGeometry(poleHeight, 32, 32)]} />
        <lineBasicMaterial attach="material" color={0x555555} />
      </lineSegments>
      {/* Group for moving center of rotation */}
      <group ref={poleRef} quaternion={poleQuaternion}>
        <mesh position={[0, poleHeight / 2, 0]}>
          {/* Pole */}
          <cylinderGeometry attach="geometry" args={[poleRadius, poleRadius, poleHeight, 32]} />
          <meshStandardMaterial attach="material" color="#008000" />
          {/* Flag */}
          <mesh position={[flagWidth / 2, poleHeight / 2 - flagHeight / 2, 0]}>
            <planeGeometry attach="geometry" args={[flagWidth, flagHeight]} />
            <meshStandardMaterial map={texture} side={DoubleSide} />
          </mesh>
        </mesh>
      </group>
    </mesh>
  )
}

export default ActualFlagPole