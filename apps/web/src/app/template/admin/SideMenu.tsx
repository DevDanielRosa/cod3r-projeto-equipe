import LogoSecurity from "../../../../public/logo-security.png";
import Link from 'next/link';
import UserIcon from "../../../../public/user-icon.png";
import VisualizeIcon from "../../../../public/visualize-icon.png";
import ReportIcon from "../../../../public/report-icon.png";

export default function SideMenu() {
  return (
    <div className="h-full w-1/6 flex flex-col">
      <img src={LogoSecurity.src} alt="Logo Security" width="162" height="129" className="my-4 mx-auto" />
      <select className="bg-slate-800 text-slate-500 leading-9 w-4/5 h-10 rounded-lg mb-3.5 mx-auto font-Poppins font-semibold ">
        <option>Perfil de Acesso 1</option>
        <option>Perfil de Acesso 2</option>
        <option>Perfil de Acesso 3</option>
        <option>Perfil de Acesso 4</option>
      </select>
      <Link href="#" className="flex gap-x-2.5 p-1.5 mx-auto my-1 font-Poppins font-semibold text-slate-500">
        <img src={UserIcon.src} alt="user icon" />
        Gerenciar
      </Link>
      <Link href="#" className="flex gap-x-2.5 p-1.5 mx-auto my-1 font-Poppins font-semibold text-slate-500">
        <img src={VisualizeIcon.src} alt="visualize icon" />
        Visualizar
      </Link>
      <Link href="#" className="flex gap-x-2.5 p-1.5 mx-auto my-1 font-Poppins font-semibold text-slate-500">
        <img src={ReportIcon.src} alt="report icon" />
        Relatório
      </Link>
    </div >
  )
}