import ActualFlagPole from './ActualFlagPole.jsx'
import { Canvas } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'

function FlagPole({ poleQuaternion, setPoleQuaternion, setTrigger, setAlpha, setBeta }) {
  const containerRef = useRef();
  const [radius, setRadius] = useState();

  useEffect(() => {
    const updateRadius = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight
        const containerDims = Math.min(containerHeight, containerWidth)
        setRadius(containerDims / 350);
      }
    };

    updateRadius(); // Initial update
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  return <div ref={containerRef} className='flagpole'>
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <ActualFlagPole 
      position={[0, 0, 0]} 
      radius={radius} 
      poleQuaternion={poleQuaternion} 
      setPoleQuaternion={setPoleQuaternion} 
      setTrigger={setTrigger}
      setAlpha={setAlpha}
      setBeta={setBeta} />
    </Canvas>
  </div>
}

export default FlagPole