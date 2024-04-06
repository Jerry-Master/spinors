import { React, useState, useRef, useEffect } from 'react'
import { TextureLoader, Quaternion, Euler, DoubleSide, Vector3 } from 'three'
import { useLoader } from '@react-three/fiber'
import flagTexture from './Assets/jumbotron.jpg'

function ActualFlagPole(props) {
  // Global state
  const clicked = useRef(false)
  const poleRef = useRef()

  // Load a texture
  const texture = useLoader(TextureLoader, flagTexture)
  
  // Initial rotation state
  const [poleQuaternion, setPoleQuaternion] = useState(new Quaternion())
  const toRadians = (angle) => angle * (Math.PI / 180)

  // Update Pole rotation on mouse drag
  const handlePointerMove = (e) => {
    e.preventDefault()

    if (clicked.current){
      let deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0
      let deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0

      const deltaPoleQuaternion = new Quaternion()
        .setFromEuler(new Euler(toRadians(deltaY * 0.5), toRadians(deltaX * 0.5), 0, 'XYZ'))

      setPoleQuaternion((prev) => {
        poleRef.current.quaternion.multiplyQuaternions(deltaPoleQuaternion, prev)
        return poleRef.current.quaternion
      })
    }
  }

  const handlePointerDown = () => {
    clicked.current = true
    // Add a global event listener for pointerup when the mouse is pressed
    window.addEventListener('pointerup', handlePointerUp)
    // Add also the pointer move listener
    window.addEventListener('pointermove', handlePointerMove)
  }

  const handlePointerUp = () => {
    console.log(poleQuaternion)
    console.log('direction:', new Vector3(0, 1, 0).applyQuaternion(poleQuaternion))
    clicked.current = false
    // Remove the global event listener for pointerup when the mouse is released
    window.removeEventListener('pointerup', handlePointerUp)
    // Remove also the point move listener
    window.removeEventListener('pointermove', handlePointerMove)
  }

  // Clean up the global event listeners when the component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  const poleHeight = 2
  const flagHeight = 0.6

  // Update Flag rotation on mouse wheel
  const handleWheel = (e) => {
    e.nativeEvent.preventDefault()
    
    const deltaFlagQuaternion = new Quaternion()
        .setFromEuler(new Euler(0, toRadians(e.deltaY * 0.3), 0, 'XYZ'))

    setPoleQuaternion((prev) => {
      poleRef.current.quaternion.multiplyQuaternions(prev, deltaFlagQuaternion)
      return poleRef.current.quaternion
    })
  }

  return (
    <mesh 
      {...props} 
      onPointerDown={handlePointerDown}
      onWheel={handleWheel}
    >
      {/* Container Sphere */}
      <sphereGeometry attach="geometry" args={[poleHeight, 32, 32]} />
      <meshBasicMaterial attach="material" color="blue" wireframe />
      {/* Group for moving center of rotation */}
      <group ref={poleRef} quaternion={poleQuaternion}>
        <mesh position={[0, poleHeight / 2, 0]}>
          {/* Pole */}
          <cylinderGeometry attach="geometry" args={[0.1, 0.1, poleHeight, 32]} />
          <meshStandardMaterial attach="material" color="#008000" />
          {/* Flag */}
          <mesh position={[0.5, poleHeight / 2 - flagHeight / 2, 0]}>
            <planeGeometry attach="geometry" args={[1, flagHeight]} />
            <meshStandardMaterial map={texture} side={DoubleSide} />
          </mesh>
        </mesh>
      </group>
    </mesh>
  )
}

export default ActualFlagPole