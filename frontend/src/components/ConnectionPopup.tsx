import { useConnectionStore } from "../stores/connectionStore";
import "./ConnectionPopup.css";

function ConnectionPopup(){

    const {status, retryCount, maxRetries} = useConnectionStore();

    if(status === "idle"){
        return null;
    }

    if(status === "retrying"){
        return (
            <div className="connection-popup">
                <strong>Conectando con el servidor...</strong>
                <span>
                    Intento {retryCount} de {maxRetries}
                </span>
            </div>  
        );
    }

    if(status === "failed"){
        return (
            <div className="connection-popup ">
            <strong>❌ El servicio no está disponible temporalmente</strong>
            </div>
        )
    }

    return (
        <div className="connection-popup ">
         <strong>✅ Conexión restablecida</strong>
        </div>
    )
}

export default ConnectionPopup;