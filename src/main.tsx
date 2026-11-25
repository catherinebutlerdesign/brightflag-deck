import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Deck } from "./deck/Deck"
import { Presenter } from "./deck/Presenter"
import { isPrep, isPresenter } from "./deck/sync"

// The private revision page only exists in local builds. In the hosted build this
// is the constant null, so the bundler drops the import and its content entirely.
const Prep = import.meta.env.VITE_PUBLIC_BUILD ? null : lazy(() => import("./prep/Prep"))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {Prep && isPrep() ? (
      <Suspense fallback={null}><Prep /></Suspense>
    ) : isPresenter() ? (
      <Presenter />
    ) : (
      <Deck />
    )}
  </StrictMode>
)
