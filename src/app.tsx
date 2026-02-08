import { Logo } from "./components/logo"
import { SearchInput } from "./components/search-input"
import { UnitsConverter } from "./components/units-converter"
import Provider from "./components/provider"


function App() {
  return (
    <Provider>
      <div className="flex items-center justify-between p-4">
        <Logo />
        <UnitsConverter />
      </div>
      <h1 className="text-2xl font-bold text-center mb-4">
      How's the sky looking today?
      </h1>

      <SearchInput />
      


     

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
    </Provider>

  )
}

export default App
