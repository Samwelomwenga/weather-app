import { Logo } from "./components/logo"
import { UnitsConverter } from "./components/units-converter"

function App() {
  return (
    <>
      
      <div className="flex items-center justify-between p-4">
        <Logo />
        <UnitsConverter />
      </div>
      

      How's the sky looking today?

      Search for a city, e.g., New York
      Search

      Feels like
      {/* Insert temperature here */}

      Humidity
      {/* Insert humidity here */}

      Wind
      {/* Insert wind here */}

      Precipitation
      {/* Insert precipitation here */}

      Daily forecast
      {/* Insert daily forecast for the next 7 days here */}

      Hourly forecast
      {/* Insert hourly forecast for the selected day here */}

      <div className="attribution">
        Challenge by
        {" "}
        <a href="https://www.frontendmentor.io?ref=challenge">
          Frontend Mentor
        </a>
        .
        {" "}
        Coded by
        {" "}
        <a href="#">Your Name Here</a>
        .
      </div>
    </>

  )
}

export default App
