import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Deck } from "./deck/Deck"
import { Presenter } from "./deck/Presenter"
import { isPresenter } from "./deck/sync"

createRoot(document.getElementById("root")!).render(
  <StrictMode>{isPresenter() ? <Presenter /> : <Deck />}</StrictMode>
)
