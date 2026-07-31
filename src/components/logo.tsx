import LogoSvg from "@/assets/images/logo.svg"

export function Logo() {
  return (
    <img
      src={LogoSvg}
      alt="Weather Now"
      className="h-7 w-auto sm:h-10"
    />
  )
}
