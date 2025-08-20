import React from "react";
import { INVITATIONS } from "./invitations";

export default function InviteGate({ children }) {
    const [step, setStep] = React.useState(() => {
        // Si ya validaron antes, los dejamos pasar directo
        const saved = localStorage.getItem("inviteCode");
        return saved && INVITATIONS[saved] ? 3 : 1;
    });
    const [code, setCode] = React.useState(() => localStorage.getItem("inviteCode") || "");
    const [data, setData] = React.useState(() => (code && INVITATIONS[code]) || null);
    const [error, setError] = React.useState("");

    const normalize = (raw) =>
        raw
            .toUpperCase()
            .replace(/\s+/g, "") // quita espacios: "CYM 000" -> "CYM000"
            .replace(/[^A-Z0-9]/g, ""); // solo letras/números

    function handleSubmit(e) {
        e.preventDefault();
        const normalized = normalize(code);
        const match = INVITATIONS[normalized];
        if (!match) {
            setError("Código inexistente. Intentá de nuevo");
            setData(null);
            setStep(1);
            return;
        }
        setError("");
        setCode(normalized);
        setData(match);
        setStep(2);
    }

    function handleConfirm() {
        localStorage.setItem("inviteCode", code);
        setStep(3);
    }

    function handleChangeCode() {
        localStorage.removeItem("inviteCode");
        setCode("");
        setData(null);
        setStep(1);
    }

    if (step === 1) return <CodeScreen
        code={code}
        setCode={setCode}
        error={error}
        onSubmit={handleSubmit}
    />;

    if (step === 2 && data) return <ConfirmScreen
        code={code}
        names={data.names}
        count={data.count}
        onBack={handleChangeCode}
        onConfirm={handleConfirm}
    />;

    // Paso 3: Ya validado → mostramos la app real
    return <>{children}</>;
}

/* -------- UI Screens -------- */

function CodeScreen({ code, setCode, error, onSubmit }) {
    return (
        <div className="gate-wrap">
            <div className="gate-card">
                <h1 className="gate-title">Ingresá tu código de invitación</h1>
                <form onSubmit={onSubmit} className="gate-form">
                    <input
                        type="text"
                        inputMode="text"
                        autoFocus
                        placeholder="Ej: CYM000"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="gate-input"
                        aria-label="Código de invitación"
                    />
                    {!!error && <p className="gate-error">{error}</p>}
                    <button className="gate-btn" type="submit">Continuar</button>
                </form>
            </div>
        </div>
    );
}

function ConfirmScreen({ code, names, count, onBack, onConfirm }) {
    const namesLine = names.join(", ");
    return (
        <div className="gate-wrap">
            <div className="gate-card">
                <h2 className="gate-title">{namesLine}</h2>
                <p className="gate-sub">¡Esperamos que puedan acompañarnos en este fiestón!</p>
                <div className="gate-info">
                    <div>
                        <span className="label">Nro de invitados</span>
                        <span className="value">{count}</span>
                    </div>
                    <div>
                        <span className="label">Código</span>
                        <span className="value">{code}</span>
                    </div>
                </div>
                <div className="gate-actions">
                    <button className="gate-btn ghost" onClick={onBack}>Cambiar código</button>
                    <button className="gate-btn" onClick={onConfirm}>Entrar</button>
                </div>
            </div>
        </div>
    );
}