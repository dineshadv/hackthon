/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Canvas, useThree,useFrame} from "@react-three/fiber";
import React, { Suspense } from "react";
import { OrbitControls, useGLTF,Clouds,Sky as SkyImpl, Cloud,} from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from 'three';
import { useRef } from "react";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} />;
}

// eslint-disable-next-line no-unused-vars
function Surface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, -1, 0]} receiveShadow>
      <planeGeometry args={[100, 80]} />
      <meshStandardMaterial color={"#979e96"} />
    </mesh>
  );
}

function WeatherFor3DAnimation({ weather }) {
  const { scene } = useThree();

  useEffect(() => {
    let color;
    switch (weather) {
      case "sunny":
        color = 0x87ceeb;
        break;
      case 'cloudy':
        color = 0xb1c6ca;
        break;
      case 'rainy':
        color = 0x505759;
        break;
      default:
        color = "0x87ceeb";
    }
    scene.background = new THREE.Color(color);
  }, [weather, scene]);

  return null;
}

function LimitCameraView() {
  const { camera } = useThree();

  useEffect(() => {
    camera.rotation.x = 0;
    camera.rotation.z = 0;
  }, [camera]);

  return null;
}

function Sun() {
  const { camera, scene } = useThree();
  const sunRef = useRef();
  
  useEffect(() => {
    const sunGeo = new THREE.SphereGeometry(5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00, emissive: 0xFFFF00 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    const light = new THREE.PointLight(0xFFFFFF, 1.5, 1000);

    sunRef.current = sunMesh;
    scene.add(sunMesh);
    scene.add(light);

    return () => {
      scene.remove(sunMesh);
      scene.remove(light);
    };
  }, [scene]);

  useFrame(() => {
    if (sunRef.current) {
      const distance = 50; // Distance from the camera
      const aspectRatio = window.innerWidth / window.innerHeight;
      sunRef.current.position.set(
        camera.position.x + distance / aspectRatio * 0.75,
        camera.position.y + distance * 0.5, // Position a bit up
        camera.position.z - distance * 0.25 // Position slightly behind the camera
      );
    }
  });

  return null;
}


export default function ModelViewer() {
  const modelUrl = "https://models.readyplayer.me/662426cdbbbaba42f997ec4b.glb";
  
  return (
    <div
      style={{
        width: "100%",
        height: "160vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Sun/>

          <Sky colorcode={"#cad7ed"}/>
          <WeatherFor3DAnimation weather={"cloudy"} />
          <LimitCameraView />
          <Model url={modelUrl} />
          {/* <Surface/> */}
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

// function SelectOpeartions(){
//   return(
//     <div>
//       <button className="btn btn-primary">Open Modal</button>
      
//     </div>
//   )
// }

// eslint-disable-next-line no-unused-vars
function Sky({ colorcode }) {
  const ref = useRef();
  const cloud0 = useRef();

  let x = { value: 6, min: 0, max: 100, step: 1 };
  let y = { value: 3, min: 0, max: 100, step: 1 }; // Adjusted y-coordinate
  let z = { value: 1, min: 0, max: 100, step: 1 };
  let color = "0x87ceeb";

  useFrame((state, delta) => {
    ref.current.rotation.y = -Math.cos(state.clock.elapsedTime / 2) / 2;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 2) / 2;
    cloud0.current.rotation.y += delta;
  });

  return (
    <React.Fragment>
      <SkyImpl />
      <group ref={ref}>
        <Clouds material={THREE.MeshLambertMaterial} limit={400}>
          <Cloud ref={cloud0} bounds={[x, y, z]} color={color} />
          <Cloud bounds={[x, y, z]} color="#eed0d0" seed={2} position={[15, y.value, 0]} />
          <Cloud bounds={[x, y, z]} color="#d0e0d0" seed={3} position={[-15, y.value, 0]} />
          <Cloud bounds={[x, y, z]} color="#a0b0d0" seed={4} position={[0, y.value, -12]} />
          <Cloud concentrate="inside" growth={20} color={colorcode} opacity={1.25} seed={0.3} bounds={200} volume={200} />
        </Clouds>
      </group>
    </React.Fragment>
  );
}
