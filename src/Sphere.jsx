import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader, Euler, Matrix4 } from 'three';
import { useState, useEffect, useRef } from 'react';
import sphereTexture from './Assets/foto-rene.JPG'

function Sphere(props) {
  // Global state
  const clicked = useRef(false)

  // Load a texture
  const texture = useLoader(TextureLoader, sphereTexture);
  
  // Random rotation state
  const [angleMat, setAngleMat] = useState([
    new Euler(0, 0, 0, 'ZYX'),
    new Matrix4(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)
  ]);

  // Update rotation on mouse drag
  const handlePointerMove = (e) => {
    if (clicked.current){
      setAngleMat(prevAngleMat => {
        let deltaEuler = new Euler(e.movementY * 0.01, e.movementX * 0.01, 0, 'ZYX')
        let deltaRotMatrix = new Matrix4()
        deltaRotMatrix.makeRotationFromEuler(deltaEuler)
        deltaRotMatrix.multiplyMatrices(prevAngleMat[1], deltaRotMatrix)
        deltaEuler.setFromRotationMatrix(deltaRotMatrix)
        return [deltaEuler, deltaRotMatrix]
      })
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
      onPointerDown={handlePointerDown}
      rotation={angleMat[0]}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default Sphere