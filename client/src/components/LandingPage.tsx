import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <h1>VideoChat</h1>
      <button
        className="button button-primary"
        onClick={() => navigate("/meeting")}
      >
        Start a meeting
      </button>
    </main>
  );
}
