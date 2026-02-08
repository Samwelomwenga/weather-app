import LogoSvg from "@/assets/images/logo.svg"

  export function Logo() {
  return (
    <div className="flex items-center">
      <img src={LogoSvg} alt="Logo" />
      <span className="font-bold">Weather Now</span>
    </div>
  )
}
