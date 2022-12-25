import './index.css'
import  * as THREE from 'three'
import gsap from 'gsap'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

//scene for 3d view
const scene= new THREE.Scene();

//create sphere 1st giving outer shape
const geometry= new THREE.SphereGeometry(3,64,64)

//giving the inner shape how ll it look in 3d
const material= new THREE.MeshStandardMaterial({
  color:"#00ff83",
  roughness: .5,
})

//making geometry and mesh together
const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh)

//size for the black screen
const sizes= {
  width: window.innerWidth,
  height: window.innerHeight, 
}

//Light of circle
const light = new THREE.PointLight(0xffffff,1,100 )
light.position.set(0,10,10)
light.intensity= 1.5
scene.add(light)

//camera   (.1 - 100)dist of camera viewing
const camera= new THREE.PerspectiveCamera(45,
  sizes.width/sizes.height,.1,100)
//to move it back as they r in same position
camera.position.z=20
scene.add(camera)

//renderer
const canvas= document.querySelector(".webgl")
const renderer= new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height)
//to hide those pixel in circle side (default 1)
renderer.setPixelRatio(4)
renderer.render(scene,camera)

//resize window smooth animation while moving
window.addEventListener("resize",()=>{
  //Updated sizes
  sizes.width= window.innerWidth
  sizes.height= window.innerHeight
  //updated camera viewport we need to write this everytime
  camera.aspect= sizes.width/ sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

//controls
const controls= new OrbitControls(camera,canvas)
controls.enableDamping= true
controls.enablePan= false
controls.enableZoom= false
//automatic animating
controls.autoRotate= true
controls.autoRotateSpeed= 5

//this ll fix the ball size
const loop= ()=>{
  controls.update()
  renderer.render(scene,camera)
  window.requestAnimationFrame(loop)
}
loop()

//timeline magic Sync all animation
const t1= gsap.timeline({defaults:{duration:1 }})
//tht zooming animation
t1.fromTo(mesh.scale,{z:0,x:0,y:0}, {z:1,x:1,y:1})
t1.fromTo('nav',{y:'-100%'}, {y:'0%'})
t1.fromTo('title',{opacity:0}, {opacity: 1})

//mouse animation color
let mouseDown= false
let rgb= []
window.addEventListener('mousedown',()=> (mouseDown=true))
window.addEventListener('mouseup',()=>(mouseDown= false))

window.addEventListener('mousemove',(e)=>{
  if(mouseDown){
    rgb=[
      //mouse range 0--255 and 150-- blue color
      Math.round((e.pageX/sizes.width)*255),
      Math.round((e.pageY/sizes.height)*255),
      150,
    ]
    //color change   //new TH.color(`rgb(0,100,150)`)
    let newColor= new THREE.Color(`rgb(${rgb.join(',')})`)
    gsap.to(mesh.material.color,{
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    })
  }
})