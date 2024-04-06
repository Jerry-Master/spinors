import { useLoader } from '@react-three/fiber'
import { TextureLoader, Euler, Quaternion } from 'three'
import { useState, useEffect, useRef } from 'react'
import sphereTexture from './Assets/foto-rene.JPG'

function Sphere(props) {
  // Global state
  const clicked = useRef(false)
  const meshRef = useRef()

  // Load a texture
  const texture = useLoader(TextureLoader, sphereTexture)
  
  // Initial rotation state
  const [rotationQuaternion, setRotationQuaternion] = useState(new Quaternion())
  const toRadians = (angle) => angle * (Math.PI / 180);

  // Update rotation on mouse drag
  const handlePointerMove = (e) => {
    if (clicked.current){
      let deltaX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      let deltaY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      const deltaRotationQuaternion = new Quaternion()
        .setFromEuler(new Euler(toRadians(deltaY * 1.5), toRadians(deltaX * 1.5), 0, 'XYZ'));

      setRotationQuaternion((prev) => {
        let newRotation = new Quaternion().multiplyQuaternions(deltaRotationQuaternion, prev);
        meshRef.current.quaternion.multiplyQuaternions(deltaRotationQuaternion, prev);
        return newRotation;
      });
    }
  };

  const handlePointerDown = () => {
    clicked.current = true;
    // Add a global event listener for pointerup when the mouse is pressed
    window.addEventListener('pointerup', handlePointerUp)
    // Add also the pointer move listener
    window.addEventListener('pointermove', handlePointerMove)
  };

  const handlePointerUp = () => {
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

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerDown={handlePointerDown}
      quaternion={rotationQuaternion}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default Sphere