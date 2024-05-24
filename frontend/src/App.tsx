import { ChangeEvent, FormEvent, useState } from "react";
import "./App.css";

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_UPLOAD: "ready_upload",
  UPLOADING: "uploading",
  READY_USAGE: "ready_usage",
} as const;

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: "Subir Archivo",
  [APP_STATUS.UPLOADING]: "Subiendo Archivo...",
};

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ?? [];
    console.log(file);

    if (file) {
      setFile(file[0]);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("TODO");
  };

  const showButton =
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;

  return (
    <>
      <h1>Reto: Subir CSV + Busqueda</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            disabled={appStatus === APP_STATUS.UPLOADING}
            onChange={handleInputChange}
            name="file"
            type="file"
            accept=".csv"
          />
        </label>
        {showButton && <button>{BUTTON_TEXT[appStatus]}</button>}
      </form>
    </>
  );
}

export default App;
