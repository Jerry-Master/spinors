import React, { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'

// Component to represent a point
function Point({ position, color }) {
  return (
    <mesh position={position} >
      <sphereGeometry args={[10, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Component to represent axis
function Axis({ radius }) {
  return (
    <mesh>
      <circleGeometry args={[radius, 64]}/>
      <mesh>
        <cylinderGeometry args={[1, 1, radius * 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh rotation={[0, 0, 3.14 / 2]}>
        <cylinderGeometry args={[1, 1, radius * 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </mesh>
  )
}

function Spinor({ poleQuaternion, trigger, alpha, beta }) {
  const containerRef = useRef();
  const [radius, setRadius] = useState();

  useEffect(() => {
    const updateRadius = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight
        const containerDims = Math.min(containerHeight, containerWidth)
        setRadius(containerDims / 2.5);
      }
    };

    updateRadius(); // Initial update
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return <div ref={containerRef} className='spinor'>
    <Canvas orthographic camera={{zoom: 1, position: [0, 0, 1000]}}>
      <ambientLight />
      <pointLight position={[0, 0, 1000]} />
      <Axis radius={radius}/>
      <Point position={[alpha.x * radius, alpha.y * radius, 0]} color={'blue'} />
      <Point position={[beta.x * radius, beta.y * radius, 0]} color={'red'} />
    </Canvas>
  </div>
}

export default Spinor