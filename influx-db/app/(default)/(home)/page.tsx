import LoginClientComponent from "@/app/ClientComponent/loginComponent/loginClientComponent";
import Header from "@/app/ClientComponent/loginComponent/header";
import {ParticlesComponent} from "@/app/ServerComponent/Particles";
export default function Home() {
  return (
    <>
      <div className="bg-[#171415]">
        <Header />
        <LoginClientComponent />
        <ParticlesComponent />
      </div>
    </>
  );
}
